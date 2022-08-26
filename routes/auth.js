const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', check('email').isEmail().withMessage('Please enter valid email!'), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/forgot-password', authController.getForgotPassword);

router.post('/forgot-password', authController.postForgotPassword);

router.get('/forgot-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;