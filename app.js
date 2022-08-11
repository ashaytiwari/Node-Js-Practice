require('dotenv').config();

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');

const User = require('./models/user');

const app = express();

// adding configuration to inform application that use ejs as view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
  User.findById('62f519fec335821558216119')
    .then((user) => {
      request.user = user;
      next();
    })
    .catch((error) => console.log(error));
})

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorsController.get404page);

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING;
const serverPort = process.env.SERVER_PORT;

mongoose.connect(mongodbConnectionString)
  .then(() => {

    User.findOne()
      .then((user) => {

        if (user !== null) {
          return;
        }

        const _user = new User({
          name: 'Ashay',
          email: 'ashay@kritin.in',
          cart: {
            items: []
          }
        });

        return _user.save();

      })
      .then(() => {
        console.log('connected to a database');
        app.listen(serverPort);
      })
  })
  .catch((error) => console.log(error, 'Database connection error'));

// additional configuration for nodemon so address already in use error didn't stuck
process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});

console.log(`server is listening on port ${serverPort}`);