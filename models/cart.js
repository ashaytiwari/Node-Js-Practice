const fs = require('fs');
const path = require('path');

const rootDirectory = require('../util/path');

const filePath = path.join(rootDirectory, 'data', 'cart.json');

class Cart {

  static addProductToCart(id, price) {

    // fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0
      };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex((product) => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // add new product and increase quantity
      if (existingProduct) {

        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;

      } else {

        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];

      }

      cart.totalPrice += +price;

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err, 'error with data');
      });

    });
  }

  static deleteProductFromCart(id, price) {

    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((_product) => _product.id === id);
      const productQuantity = product.quantity;

      updatedCart.products = updatedCart.products.filter((_product) => _product.id !== id);
      updatedCart.totalPrice -= price * productQuantity;

      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        console.log(err, 'error with data');
      });

    });
  }

}

module.exports = Cart;