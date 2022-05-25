const products = [];

exports.getAddProducts = (request, response, next) => {

  response.render('add-product', { title: 'Add Product', path: '/admin/add-product' });

};

exports.postAddProducts = (request, response, next) => {

  products.push({ title: request.body.title });

  response.redirect('/');

}

exports.getProducts = (request, response, next) => {

  response.render('shop', {
    title: 'My Amazing Shop',
    products,
    path: '/',
    hasProducts: products.length > 0
  }); // telling application to use default template engine (here in this case is 'ejs')

}