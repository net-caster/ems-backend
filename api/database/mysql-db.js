const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PW, {
	dialect: 'mysql',
	host: 'remotemysql.com',
	port: 3306
});

module.exports = sequelize;
