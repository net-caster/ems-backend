const Sequelize = require('sequelize');

const sequelize = require('../database/mysql-db');

const Employee = sequelize.define('employee', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: true
	},
	payRate: {
		type: Sequelize.DECIMAL(4, 2),
		allowNull: false
	}
});

module.exports = Employee;
