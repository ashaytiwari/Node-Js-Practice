const db = require('../util/database');

const Cart = require('./cart');

class Product {

  constructor(id, title, imageURL, price, description) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  save() {

  }

  static deleteProductById(productId) {

  }

  static getAllProducts() {

    const data = db.execute('SELECT * FROM products');

    return data;

  }

  static findProductById() {

  }

};

module.exports = Product;