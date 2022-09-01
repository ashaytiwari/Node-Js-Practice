require('dotenv').config();

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorsController = require('./controllers/errors');

const User = require('./models/user');

const app = express();
const csrfProtection = csrf();

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING;
const serverPort = process.env.SERVER_PORT;

const store = new MongoDBStore({
  uri: mongodbConnectionString,
  collection: 'sessions'
});

const fileStorageConfiguration = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'images');
  },
  filename: (request, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname);
  }
});

// adding configuration to inform application that use ejs as view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorageConfiguration }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));

// middleware to initialize session
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(csrfProtection);
app.use(flash());

// middleware for adding user to each request
app.use((request, response, next) => {

  const user = request.session.user;

  if (typeof user === 'undefined') {
    return next();
  }

  User.findById(user._id)
    .then((result) => {
      request.user = result;
      next();
    })
    .catch((error) => console.log(error));

});

//middleware for adding express locals values 
app.use((request, response, next) => {

  response.locals.authenticated = request.session.authenticated;
  response.locals.csrfToken = request.csrfToken();

  next();

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404page);

mongoose.connect(mongodbConnectionString)
  .then(() => {
    console.log('connected to a database');
    app.listen(serverPort);
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