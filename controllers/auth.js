const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "dc9ca81cde9ba6",
    pass: "c7814ed5725169"
  }
});

exports.getLogin = (request, response, next) => {

  let message = request.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  response.render('auth/login', {
    path: '/login',
    title: 'Login',
    errorMessage: message
  });

};

exports.postLogin = (request, response, next) => {

  const body = request.body;

  User.findOne({ email: body.email })
    .then((user) => {

      if (user === null) {
        request.flash('error', 'Account with this email does not exists.');
        return response.redirect('/login');
      }

      bcrypt.compare(body.password, user.password)
        .then((matched) => {

          if (matched === false) {
            request.flash('error', 'Password mismatch.');
            return response.redirect('/login');
          }

          request.session.authenticated = true;
          request.session.user = user;
          request.session.save((error) => {
            console.log(error);
            return response.redirect('/');
          });

        })
    })
    .catch((error) => console.log(error));

};

exports.postLogout = (request, response, next) => {

  request.session.destroy(() => {
    response.redirect('/');
  });

};

exports.getSignup = (request, response, next) => {

  let message = request.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  response.render('auth/signup', {
    path: '/signup',
    title: 'Signup',
    errorMessage: message
  });

};

exports.postSignup = (request, response, next) => {

  const body = request.body;

  const email = body.email;

  const errors = validationResult(request);

  if (errors.isEmpty() === false) {

    return response.render('auth/signup', {
      path: '/signup',
      title: 'Signup',
      errorMessage: errors.array()[0].msg
    });

  }

  User.findOne({ email })
    .then((userRecord) => {

      if (userRecord !== null) {
        request.flash('error', 'Account with this email already exists. Try with another email!');
        return response.redirect('/signup');
      }

      return bcrypt.hash(body.password, 12)
        .then((hashedPassword) => {

          const data = {
            name: body.name,
            email,
            password: hashedPassword,
            cart: { items: [] }
          };

          const user = new User(data);

          return user.save();

        });

    })
    .then(() => {

      response.redirect('/login');

      const mailOptions = {
        from: 'bookshop@admin.com',
        to: email,
        subject: 'Registered successfully!',
        html: `<h2 style="color:#ff6600;">Hello ${body.name}!, Welcome to Book shop!</h2>`
      };

      transporter.sendMail(mailOptions);

    })
    .catch((error) => console.log(error));

};

exports.getForgotPassword = (request, response, next) => {

  let message = request.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  response.render('auth/forgot-password', {
    path: '/forgot-password',
    title: 'Forgot Password',
    errorMessage: message
  });

};

exports.postForgotPassword = (request, response, next) => {

  const body = request.body;

  crypto.randomBytes(32, (error, buffer) => {

    if (error) {
      request.flash('error', 'Error in generating authentication token.');
      return response.redirect('/forgot-password');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: body.email })
      .then((user) => {

        if (!user) {
          request.flash('error', 'Account with this email is not found.');
          return response.redirect('/forgot-password');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();

      })
      .then(() => {

        response.redirect('/');

        const mailOptions = {
          from: 'bookshop@admin.com',
          to: body.email,
          subject: 'Reset Password',
          html: `
          <h1 style="color:#ff6600;">Reset your password!</h1>
          <p style="color:#ff6600;">
          Click this 
          <a href="http://localhost:8000/forgot-password/${token}"> link </a>
          to set a new password.
          </p>
        `
        };

        transporter.sendMail(mailOptions);

      })
      .catch((error) => console.log(error));
  })


  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      return response.redirect('/forgot-password');
    }
  })
};

exports.getNewPassword = (request, response, next) => {

  const token = request.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {

      let message = request.flash('error');

      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      response.render('auth/new-password', {
        path: '/new-password',
        title: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });

    })
    .catch((error) => console.log(error));

};

exports.postNewPassword = (request, response, next) => {

  const password = request.body.password;
  const token = request.body.token;
  const userId = request.body.userId;

  let resetUser;

  User.findOne({
    resetToken: token,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then((user) => {

      if (!user) {
        request.flash('error', 'Something went wrong. Try again later!');
        return response.redirect('/forgot-password');
      }

      resetUser = user;

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {

      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();

    })
    .then((result) => {
      response.redirect('/login');
    })
    .catch((error) => console.log(error));

};