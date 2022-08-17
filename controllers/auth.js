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

};