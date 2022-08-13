const Order = require('../models/order');
const Product = require('../models/product');

const { parseOrdersData, parseCartItemsData } = require('./utilities');

exports.getLandingPage = (request, response, next) => {

  Product.find()
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

  Product.find()
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

  Product.findById(productId)
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

  request.user
    .populate('cart.items.productId')
    .then((user) => {

      const products = parseCartItemsData(user.cart.items);

      response.render('shop/cart', {
        title: 'Your Cart',
        path: '/cart',
        products
      });

    })
    .catch((error) => {
      console.log(error);
    });

};

exports.postCartDeleteProduct = (request, response, next) => {

  const productId = request.body.productId;

  request.user.removeFromCart(productId)
    .then(() => {
      response.redirect('/cart');
    })
    .catch((error) => console.log(error));

};

exports.postCart = (request, response, next) => {

  const productId = request.body.productId;

  Product.findById(productId)
    .then((product) => {
      return request.user.addToCart(product);
    })
    .then((result) => {
      response.redirect('/cart');
    });

};

// exports.getCheckout = (request, response, next) => {

//   response.render('shop/checkout', {
//     title: 'Your Checkout',
//     path: '/checkout'
//   });

// };

exports.postOrders = (request, response, next) => {

  request.user
    .populate('cart.items.productId')
    .then((user) => {

      const products = parseOrdersData(user.cart.items);

      const orderData = {
        user: {
          name: request.user.name,
          userId: request.user._id
        },
        products
      };

      const order = new Order(orderData);

      return order.save();

    })
    .then(() => {
      return request.user.clearCart();
    })
    .then(() => {
      response.redirect('/orders');
    })
    .catch((error) => console.log(error));

};

exports.getOrders = (request, response, next) => {

  request.user.getOrders()
    .then((orders) => {
      response.render('shop/orders', {
        title: 'Your Orders',
        path: '/orders',
        orders
      });
    })
    .catch((error) => console.log(error));

};