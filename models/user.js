const mongodb = require('mongodb');

const { getDB } = require("../util/database");

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
    const updatedCart = { items: [{ productId: product._id, quantity: 1 }] };
    const db = getDB();

    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        {
          $set: { cart: updatedCart }
        });

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