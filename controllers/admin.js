const Product = require('../models/product');

exports.getAddProducts = (request, response, next) => {

  response.render('admin/add-product', {
    title: 'Add Product',
    path: '/admin/add-product'
  });

};

exports.postAddProducts = (request, response, next) => {

  const product = new Product(request.body.title);

  product.save();

  response.redirect('/');

}

exports.getProducts = (request, response, next) => {

  Product.getAllProducts((products) => {

    response.render('admin/products', {
      title: 'Admin Products',
      products,
      path: '/admin/products'
    });

  });

}