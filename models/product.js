// const mongodb = require('mongodb');

// const getDB = require('../util/database').getDB;

// class Product {

//   constructor(title, price, imageURL, description, id, userId) {
//     this.title = title.trim();
//     this.price = price.trim();
//     this.imageURL = imageURL.trim();
//     this.description = description.trim();
//     this._id = id ? mongodb.ObjectId(id) : null;
//     this.userId = userId
//   }

//   save() {

//     const db = getDB();
//     let dbOperation;

//     if (this._id !== null) {
//       dbOperation = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOperation = db.collection('products').insertOne(this);
//     }

//     return dbOperation
//       .then((result) => {
//         console.log(result, 'result');
//       })
//       .catch((error) => console.log(error, 'error'));

//   }

//   static fetchAll() {

//     const db = getDB();

//     return db.collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((error) => console.log(error));
//   }

//   static findById(id) {

//     const db = getDB();

//     const objectId = new mongodb.ObjectId(id);

//     return db.collection('products')
//       .find({ _id: objectId })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((error) => console.log(error));

//   }

//   static deleteById(id) {

//     const db = getDB();

//     const objectId = new mongodb.ObjectId(id);

//     return db.collection('products')
//       .deleteOne({ _id: objectId })
//       .then(() => {
//         console.log('Product deleted');
//       })
//       .catch((error) => console.log(error));
//   }

// }

// module.exports = Product;