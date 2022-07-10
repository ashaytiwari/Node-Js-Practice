const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getLandingPage);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.get('/orders', shopController.getOrders);

// router.get('/checkout', shopController.getCheckout);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

// router.post('/create-order', shopController.postOrders);

module.exports = router;