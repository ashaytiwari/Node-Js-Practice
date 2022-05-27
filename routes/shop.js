const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getLandingPage);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

module.exports = router;