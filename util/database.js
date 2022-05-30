const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'ONLINEBOOKSTORE',
  password: 'Ashay@123'
});

module.exports = pool.promise();