const express = require('express');
const { check, body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
  check('email').isEmail().withMessage('Please enter valid email!'),
  body('password').isLength({ min: 6 }).withMessage('Please enter a password with at least 6 characters')
], authController.postLogin);

router.post('/signup',
  [
    check('email').isEmail().withMessage('Please enter valid email!').custom(async (value, { req }) => {
      return User.findOne({ email: value })
        .then((userRecord) => {

          if (userRecord !== null) {
            return Promise.reject('Account with this email already exists. Try with another email!');
          }

        })
    }),
    body('password', 'Please enter a password with at least 6 characters').isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password is not matching!');
      }
      return true;
    })
  ],
  authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/forgot-password', authController.getForgotPassword);

router.post('/forgot-password', authController.postForgotPassword);

router.get('/forgot-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;