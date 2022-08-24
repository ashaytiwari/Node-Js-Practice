const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
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

userSchema.methods.removeFromCart = function (productId) {

  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;

  return this.save();

}

userSchema.methods.clearCart = function () {

  this.cart = { items: [] };

  return this.save();

}

module.exports = mongoose.model('User', userSchema);