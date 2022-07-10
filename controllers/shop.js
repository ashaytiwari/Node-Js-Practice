const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getLandingPage = (request, response, next) => {

  Product.fetchAll()
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

  Product.fetchAll()
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

  request.user.getCart()
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

};

exports.postCartDeleteProduct = (request, response, next) => {

  const productId = request.body.productId;

  request.user.deleteCartItemById(productId)
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

// exports.postOrders = (request, response, next) => {

//   let fetchedCart;

//   request.user.getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {

//       return request.user.createOrder()
//         .then((order) => {
//           return order.addProducts(products.map((product) => {
//             product.orderItem = { quantity: product.cartItem.quantity }
//             return product;
//           }))
//         })
//         .catch((error) => console.log(error));
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       response.redirect('/orders');
//     })
//     .catch((error) => console.log(error));
// };

// exports.getOrders = (request, response, next) => {

//   request.user.getOrders({ include: ['products'] })
//     .then((orders) => {
//       console.log(orders, 'orders');
//       response.render('shop/orders', {
//         title: 'Your Orders',
//         path: '/orders',
//         orders
//       });
//     })
//     .catch((error) => console.log(error));

// };