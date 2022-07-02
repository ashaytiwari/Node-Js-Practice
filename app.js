const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');

const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const app = express();

// adding configuration to inform application that use ejs as view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {

  User.findById('62c043fa033014cecb9627d9')
    .then((user) => {
      request.user = user;
      next();
    }).catch((error) => console.log(error));

});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorsController.get404page);

mongoConnect(() => {
  app.listen(8000);
});

// additional configuration for nodemon so address already in use error didn't stuck
process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});

console.log('server is listening on port 8000');