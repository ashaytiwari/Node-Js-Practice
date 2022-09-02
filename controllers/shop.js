const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Order = require('../models/order');
const Product = require('../models/product');

const { parseOrdersData, parseCartItemsData } = require('./utilities');

const PAGE_LIMIT = 3;

exports.getLandingPage = (request, response, next) => {

  const page = request.query.page;

  Product.find()
    .skip((page - 1) * PAGE_LIMIT)
    .limit(PAGE_LIMIT)
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

  Order.find({ 'user.userId': request.user._id })
    .then((orders) => {
      response.render('shop/orders', {
        title: 'Your Orders',
        path: '/orders',
        orders
      });
    })
    .catch((error) => console.log(error));

};

exports.getInvoice = (request, response, next) => {

  const orderId = request.params.orderId;
  const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);

  Order.findById(orderId)
    .then((order) => {

      if (!order) {
        return console.log('Order not found');
      }

      if (order.user.userId.toString() !== request.user._id.toString()) {
        return console.log('Unauthorized user for accessing invoice');
      }

      // fs.readFile(invoicePath, (error, data) => {

      //   if (error) {
      //     console.log(error);
      //   }

      //   response.setHeader('Content-Type', 'application/pdf');
      //   response.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

      //   response.send(data);

      // });

      // const file = fs.createReadStream(invoicePath);

      const pdfDocument = new PDFDocument();

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

      pdfDocument.pipe(fs.createWriteStream(invoicePath));
      pdfDocument.pipe(response);

      // generating invoice document content
      pdfDocument.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDocument.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDocument
          .fontSize(14)
          .text(
            prod.product.title +
            ' - ' +
            prod.quantity +
            ' x ' +
            '$' +
            prod.product.price
          );
      });
      pdfDocument.text('---');
      pdfDocument.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDocument.end();

    })
    .catch((error) => console.log(error));

};