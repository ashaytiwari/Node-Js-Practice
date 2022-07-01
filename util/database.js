const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://ashaytiwari:pJrtOMROPgB1z80O@cluster0.k9sp9pl.mongodb.net/bookshop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected');
      db = client.db();
      callback(client);
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDB = () => {

  if (db) {
    return db;
  }

  throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;