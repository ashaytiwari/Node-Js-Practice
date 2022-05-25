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

  constructor(title) {
    this.title = title
  }

  writeFile(filePath, products) {

    fs.writeFile(filePath, JSON.stringify(products), (err) => {
      console.log(err);
    });

  }

  save() {

    getProducts((products) => {

      products.push(this);

      this.writeFile(filePath, products);

    });

  }

  static getAllProducts(callback) {

    getProducts(callback);

  }

};

module.exports = Product;