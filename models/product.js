const mongodb = require('mongodb');

const getDB = require('../util/database').getDB;

class Product {

  constructor(title, price, imageURL, description) {
    this.title = title;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
  }

  save() {

    const db = getDB();

    return db.collection('products')
      .insertOne(this)
      .then((result) => {
        console.log(result, 'result');
      })
      .catch((error) => console.log(error, 'error'));

  }

  static fetchAll() {

    const db = getDB();

    return db.collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => console.log(error));
  }

  static findById(id) {

    const db = getDB();

    const objectId = new mongodb.ObjectId(id);

    return db.collection('products')
      .find({ _id: objectId })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => console.log(error));

  }

}

module.exports = Product;