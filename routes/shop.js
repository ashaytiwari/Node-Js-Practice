const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminData = require('./admin');

router.get('/', (request, response, next) => {

  const products = adminData.products;

  response.render('shop', { title: 'My Amazing Shop', products, path: '/' }); // telling application to use default template engine (here in this case is 'pug')

});

module.exports = router;