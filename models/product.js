const fs = require('fs');
const path = require('path');

const rootDirectory = require('../util/path');

const filePath = path.join(rootDirectory, 'data', 'products.json');

const getProducts = (callback) => {


  fs.readFile(filePath, (err, fileContent) => {

    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }

  });

}

class Product {

  constructor(title, imageURL, price, description) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  writeFile(filePath, products) {

    fs.writeFile(filePath, JSON.stringify(products), (err) => {
      console.log(err);
    });

  }

  save() {

    this.id = Date.now().toString();

    getProducts((products) => {

      products.push(this);

      this.writeFile(filePath, products);

    });

  }

  static getAllProducts(callback) {

    getProducts(callback);

  }

  static findProductById(id, callback) {

    getProducts((products) => {
      const product = products.find((_product) => _product.id === id);
      callback(product);
    });

  }

};

module.exports = Product;