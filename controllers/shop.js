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

};

exports.getProductDetails = (request, response, next) => {

  const productId = request.params.productId;

  Product.findProductById(productId, (product) => {
    response.render('shop/product-detail', {
      title: product.title,
      product,
      path: '/products'
    });
  });

};

exports.getCart = (request, response, next) => {

  response.render('shop/cart', {
    title: 'Your Cart',
    path: '/cart'
  });

};

exports.getCheckout = (request, response, next) => {

  response.render('shop/checkout', {
    title: 'Your Checkout',
    path: '/checkout'
  });

};

exports.getOrders = (request, response, next) => {

  response.render('shop/orders', {
    title: 'Your Orders',
    path: '/orders'
  });

};