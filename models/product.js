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

    const result = db.execute(
      'INSERT INTO products (title, price, description, imageURL) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageURL]
    );

    return result;

  }

  static deleteProductById(productId) {

  }

  static getAllProducts() {

    const result = db.execute('SELECT * FROM products');

    return result;

  }

  static findProductById() {

  }

};

module.exports = Product;