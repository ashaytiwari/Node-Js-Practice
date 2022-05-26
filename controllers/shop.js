const Product = require('../models/product');

exports.getLandingPage = (request, response, next) => {

  Product.getAllProducts((products) => {

    response.render('shop/index', {
      title: 'My Amazing Shop',
      products,
      path: '/'
    });

  });

}

exports.getProducts = (request, response, next) => {

  Product.getAllProducts((products) => {

    response.render('shop/product-list', {
      title: 'Products',
      products,
      path: '/products'
    });

  });

}

exports.getCart = (request, response, next) => {

  response.render('shop/cart', {
    title: 'Cart',
    path: '/cart'
  });

}

exports.getCheckout = (request, response, next) => {

  response.render('shop/checkout', {
    title: 'Checkout',
    path: '/checkout'
  });

}