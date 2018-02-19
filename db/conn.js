const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgress://localhost/acme_directory_with_manager', {
  logging: false
});

module.exports = conn;
