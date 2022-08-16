exports.getLogin = (request, response, next) => {

  const authenticated = true

  response.render('auth/login', {
    path: '/login',
    title: 'Login',
    authenticated
  });

};

exports.postLogin = (request, response, next) => {

  response.setHeader('Set-Cookie', 'authenticated=true');

  response.redirect('/');

};
