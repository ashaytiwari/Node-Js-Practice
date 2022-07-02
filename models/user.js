const mongodb = require('mongodb');

const { getDB } = require("../util/database");

class User {

  constructor(name, email) {
    this.name = name;
    this.email = email;
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