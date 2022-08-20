const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/add-product', isAuth, adminController.getAddProducts);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', isAuth, adminController.postEditProducts);

router.post('/add-product', isAuth, adminController.postAddProducts);

router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;