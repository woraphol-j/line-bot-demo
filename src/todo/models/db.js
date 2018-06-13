const config = require('config');
const Sequelize = require('sequelize');

const db = new Sequelize(
  config.get('database.name'),
  config.get('database.username'),
  config.get('database.password'),
  {
    host: config.get('database.host'),
    dialect: 'postgres',
  },
);

module.exports = db;
