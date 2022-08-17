const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.getLogin = (request, response, next) => {

  response.render('auth/login', {
    path: '/login',
    title: 'Login',
    authenticated: request.session.authenticated
  });

};

exports.postLogin = (request, response, next) => {

  request.session.authenticated = true;
  request.session.save((error) => {
    console.log(error);
    response.redirect('/');
  });

};

exports.postLogout = (request, response, next) => {

  request.session.destroy(() => {
    response.redirect('/');
  });

};

exports.getSignup = (request, response, next) => {

  response.render('auth/signup', {
    path: '/signup',
    title: 'Signup',
    authenticated: request.session.authenticated
  });

};

exports.postSignup = (request, response, next) => {

  const body = request.body;

  User.findOne({ email: body.email })
    .then((userRecord) => {

      if (userRecord !== null) {
        return response.redirect('/signup');
      }

      return bcrypt.hash(body.password, 12)
        .then((hashedPassword) => {

          const data = {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            cart: { items: [] }
          };

          const user = new User(data);

          return user.save();

        });

    })
    .then(() => {
      return response.redirect('/login');
    })
    .catch((error) => console.log(error));


};