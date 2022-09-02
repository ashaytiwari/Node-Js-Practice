const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/add-product', isAuth, adminController.getAddProducts);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', isAuth, [
  body('title').isString().isLength({ min: 2 }).withMessage('Title should be at least 2 characters long.').trim(),
  body('price').isFloat().withMessage('Invalid price value'),
  body('description').isString().isLength({ min: 3, max: 200 }).withMessage('Description characters should be in length from 3 to 200 characters.').trim()
], adminController.postEditProducts);

router.post('/add-product', isAuth, [
  body('title').isString().isLength({ min: 2 }).withMessage('Title should be at least 2 characters long.').trim(),
  body('price').isFloat().withMessage('Invalid price value'),
  body('description').isLength({ min: 3, max: 200 }).withMessage('Description characters should be in length from 3 to 200 characters.').trim()
], adminController.postAddProducts);

router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;