const Sequelize = require('sequelize');

const sequelize = new Sequelize('ONLINEBOOKSTORE', 'root', 'Ashay@123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;