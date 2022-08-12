const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function (product) {

  let productIndex = -1;

  if (this.cart.items.length !== 0) {
    productIndex = this.cart.items.findIndex((_product) => {
      return _product.productId.toString() === product._id.toString();
    });
  }

  const updatedCartItems = [...this.cart.items];
  let quantity = 1;

  if (productIndex === -1) {
    updatedCartItems.push({ productId: product._id, quantity });
  } else {
    quantity = this.cart.items[productIndex].quantity + 1;
    updatedCartItems[productIndex].quantity = quantity;
  }

  const updatedCart = { items: updatedCartItems };

  this.cart = updatedCart;

  return this.save();

};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const { getDB } = require("../util/database");

// const Product = require('./product');

// class User {

//   constructor(name, email, cart, _id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//   }

//   save() {

//     const db = getDB();

//     return db.collection('users')
//       .insertOne(this)
//       .then((user) => {
//         console.log('user created');
//       })
//       .catch((error) => console.log(error));

//   }

//   addToCart(product) {

//     let productIndex = -1;

//     if (this.cart.items.length !== 0) {
//       productIndex = this.cart.items.findIndex((_product) => {
//         return _product.productId.toString() === product._id.toString();
//       });
//     }

//     const updatedCartItems = [...this.cart.items];
//     let quantity = 1;

//     if (productIndex === -1) {
//       updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity });
//     } else {
//       quantity = this.cart.items[productIndex].quantity + 1;
//       updatedCartItems[productIndex].quantity = quantity;
//     }

//     const updatedCart = { items: updatedCartItems };

//     return this.updateCart(updatedCart);

//   }

//   updateCart(cart) {

//     const db = getDB();

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         {
//           $set: { cart }
//         });

//   }

//   async getCart() {

//     // one way to fetch carts:
//     // const products = [];

//     // for (let cartItem of this.cart.items) {

//     //   let product = await Product.findById(cartItem.productId);
//     //   product.quantity = cartItem.quantity;

//     //   products.push(product);

//     // }

//     // return products;

//     //another way to fetch carts:
//     const db = getDB();

//     const cartItemIds = this.cart.items.map((item) => {
//       return item.productId;
//     });

//     return db
//       .collection('products')
//       .find({ _id: { $in: cartItemIds } })
//       .toArray()
//       .then((products) => {
//         return this.parseProductsDataWithQuantity(products);
//       })
//       .catch((error) => console.log(error));

//   }

//   parseProductsDataWithQuantity(_products) {

//     const products = _products.map((product) => {
//       return {
//         ...product,
//         quantity: this.findProductQuantityById(product._id)
//       }
//     });

//     return products;

//   }

//   findProductQuantityById(id) {

//     const product = this.cart.items.find((item) => {
//       return item.productId.toString() === id.toString();
//     });

//     return product.quantity;

//   }

//   deleteCartItemById(id) {

//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== id.toString();
//     });

//     const updatedCart = { items: updatedCartItems };

//     return this.updateCart(updatedCart);

//   }

//   static findById(id) {

//     const db = getDB();

//     return db.collection('users')
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((user) => {
//         return user;
//       })
//       .catch((error) => console.log(error));

//   }

//   addOrder() {

//     const db = getDB();

//     return this.getCart()
//       .then((products) => {

//         const order = {
//           items: products,
//           user: {
//             _id: this._id
//           }
//         };

//         return db.collection('orders').insertOne(order);

//       })
//       .then((result) => {

//         this.cart = { items: [] };

//         return this.updateCart({ items: [] });

//       })
//       .catch((error) => console.log(error));

//   }

//   getOrders() {

//     const db = getDB();

//     return db.collection('orders')
//       .find({ 'user._id': new mongodb.ObjectId(this._id) })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((error) => console.log(error));

//   }

// }

// module.exports = User;