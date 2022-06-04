const Product = require('../models/product');
const Cart = require('../models/cart');
const res = require('express/lib/response');

exports.getLandingPage = (request, response, next) => {

  Product.findAll()
    .then((products) => {
      response.render('shop/index', {
        title: 'My Amazing Shop',
        products,
        path: '/'
      });
    })
    .catch((error) => {
      console.log(error);
    });

}

exports.getProducts = (request, response, next) => {

  Product.findAll()
    .then((products) => {
      response.render('shop/product-list', {
        title: 'Products',
        products,
        path: '/products'
      });
    })
    .catch((error) => {
      console.log(error);
    });

};

exports.getProductDetails = (request, response, next) => {

  const productId = request.params.productId;

  Product.findByPk(productId)
    .then((product) => {

      response.render('shop/product-detail', {
        title: product.title,
        product,
        path: '/products'
      });

    })
    .catch((error) => {
      console.log(error);
    });



};

exports.getCart = (request, response, next) => {

  request.user.getCart()
    .then((cart) => {
      console.log(cart, 'cart');

      return cart.getProducts()
        .then((products) => {
          response.render('shop/cart', {
            title: 'Your Cart',
            path: '/cart',
            products
          });
        })
        .catch((error) => {
          console.log(error);
        });

    })
    .catch((error) => console.log(error));

};

exports.postCartDeleteProduct = (request, response, next) => {

  const productId = request.body.productId;

  request.user.getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      response.redirect('/cart');
    })
    .catch((error) => console.log(error));

};

exports.postCart = (request, response, next) => {

  const productId = request.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  request.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {

      let product;

      if (products.length > 0) {
        product = products[0];
      }

      if (typeof product !== 'undefined') {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(productId);

    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      response.redirect('/cart');
    })
    .catch((error) => console.log(error));

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