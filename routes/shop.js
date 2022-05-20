const express = require('express');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.send('<h1>Home Page</h1>');
});

module.exports = router;