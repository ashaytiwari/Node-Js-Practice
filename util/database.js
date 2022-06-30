const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://ashaytiwari:pJrtOMROPgB1z80O@cluster0.k9sp9pl.mongodb.net/?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected');
      callback(client);
    })
    .catch((error) => console.log(error));
};

module.exports = mongoConnect;