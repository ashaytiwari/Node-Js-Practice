const mongodb = require('mongodb');

const { getDB } = require("../util/database");
const Product = require('./product');

class User {

  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {

    const db = getDB();

    return db.collection('users')
      .insertOne(this)
      .then((user) => {
        console.log('user created');
      })
      .catch((error) => console.log(error));

  }

  addToCart(product) {

    const productIndex = this.cart.items.findIndex((_product) => {
      return _product.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];
    let quantity = 1;

    if (productIndex === -1) {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity });
    } else {
      quantity = this.cart.items[productIndex].quantity + 1;
      updatedCartItems[productIndex].quantity = quantity;
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDB();

    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        {
          $set: { cart: updatedCart }
        });

  }

  async getCart() {

    const products = [];

    for (let cartItem of this.cart.items) {

      let product = await Product.findById(cartItem.productId);
      product.quantity = cartItem.quantity;

      products.push(product);

    }

    return products;

  }

  static findById(id) {

    const db = getDB();

    return db.collection('users')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((error) => console.log(error));

  }

}

module.exports = User;