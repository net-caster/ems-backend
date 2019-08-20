const Sequelize = require('sequelize');

const sequelize = require('../database/mysql-db');

const WorkWeek = sequelize.define('workWeek', {
	id: {
		type: Sequelize.INTEGER(11),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	totalHoursWeek: {
		type: Sequelize.DECIMAL,
		allowNull: true
	},
	totalPayWeek: {
		type: Sequelize.DECIMAL,
		allowNull: true
	}
});

module.exports = WorkWeek;
