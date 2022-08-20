module.exports = (request, response, next) => {

  if (typeof request.session.authenticated === 'undefined') {
    return response.redirect('/login');
  }

  next();

}