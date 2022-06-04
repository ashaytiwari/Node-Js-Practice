const Product = require('../models/product');
const Cart = require('../models/cart');

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

  Product.findProductById(productId, (product) => {

    Cart.deleteProductFromCart(productId, product.price);

    response.redirect('/cart');

  });

};

exports.postCart = (request, response, next) => {

  const productId = request.body.productId;

  let fetchedCart;

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

      let newQuantity = 1;

      if (typeof product !== 'undefined') {

      }

      return Product.findByPk(productId)
        .then((_product) => {
          return fetchedCart.addProduct(_product, {
            through: { quantity: newQuantity }
          });
        })
        .catch((error) => console.log(error));

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