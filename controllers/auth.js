exports.getLogin = (request, response, next) => {

  response.render('auth/login', {
    path: '/login',
    title: 'Login',
    authenticated: request.session.authenticated
  });

};

exports.postLogin = (request, response, next) => {

  request.session.authenticated = true;

  response.redirect('/');

};

exports.postLogout = (request, response, next) => {

  request.session.destroy(() => {
    response.redirect('/');
  });

};