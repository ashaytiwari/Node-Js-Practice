const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// adding configuration to inform application that use ejs as view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
  User.findByPk(1)
    .then((user) => {
      request.user = user;
      next();
    }).catch((error) => console.log(error));
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorsController.get404page);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// Syncing application models with sequelize mysql
sequelize
  .sync({ force: true }) // {force: true} only for development mode to override the changes done. "Uncomment this line only when overriding is required (not always)"
  // .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'Ashay',
        email: 'ashay@test.com'
      });
    }

    return user;

  })
  .then((user) => {
    return { cart: user.getCart(), user };
  })
  .then((data) => {
    if (!data.cart) {
      return data.user.createCart();
    }

    return data.cart;
  })
  .then((cart) => {
    app.listen(8000);
  })
  .catch((error) => {
    console.log(error);
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