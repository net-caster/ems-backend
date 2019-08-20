const Sequelize = require('sequelize');

const sequelize = require('../database/mysql-db');

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER(11),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	company: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: null
	}
});

module.exports = User;
