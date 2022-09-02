const express = require('express');

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getLandingPage);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/orders', isAuth, shopController.getOrders);

// // router.get('/checkout', shopController.getCheckout);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

router.post('/create-order', isAuth, shopController.postOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;