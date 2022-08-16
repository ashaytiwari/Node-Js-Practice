exports.getLogin = (request, response, next) => {

  const authenticated = true

  console.log(request.session.authenticated);

  response.render('auth/login', {
    path: '/login',
    title: 'Login',
    authenticated
  });

};

exports.postLogin = (request, response, next) => {

  request.session.authenticated = true;

  response.redirect('/');

};
