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

  Product.findProductById(productId)
    .then((result) => {

      const [product] = result;

      response.render('shop/product-detail', {
        title: product[0].title,
        product: product[0],
        path: '/products'
      });

    })
    .catch((error) => {
      console.log(error);
    });



};

exports.getCart = (request, response, next) => {

  Cart.getAllProductsFromCart((cart) => {

    Product.getAllProducts((products) => {

      const cartProducts = [];

      if (cart === null) {
        response.render('shop/cart', {
          title: 'Your Cart',
          path: '/cart',
          products: cartProducts
        });
      } else {

        for (let product of products) {

          const cartData = cart.products.find((_product) => _product.id === product.id);

          if (cartData) {
            cartProducts.push({ productData: product, quantity: cartData.quantity });
          }

        }

        response.render('shop/cart', {
          title: 'Your Cart',
          path: '/cart',
          products: cartProducts
        });
      }


    });


  });


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

  Product.findProductById(productId, (product) => {
    Cart.addProductToCart(productId, product.price);
  });

  response.redirect('/cart');

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