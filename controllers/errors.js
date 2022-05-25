exports.get404page = (request, response, next) => {

  response.status(404).render('404', { title: 'Page Not Found', path: null });

};