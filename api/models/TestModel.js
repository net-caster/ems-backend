const Sequelize = require('sequelize');

const sequelize = require('../database/mysql-db');

const TestModel = sequelize.define('testModel', {
  id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true
	},
	date: {
		type: Sequelize.DATEONLY,
		allowNull: false
	},
	y: {
		type: Sequelize.SMALLINT,
		allowNull: false
	},
	m: {
		type: Sequelize.SMALLINT,
		allowNull: false
	},
	d: {
		type: Sequelize.SMALLINT,
		allowNull: false
	},
	w: {
		type: Sequelize.SMALLINT,
		allowNull: false
	},
	wd: {
		type: Sequelize.SMALLINT,
		allowNull: false
	},
	q: {
		type: Sequelize.SMALLINT,
		allowNull: false
	},
  wd_name: {
		type: Sequelize.CHAR(10),
		allowNull: false
	},
	m_name: {
		type: Sequelize.CHAR(10),
		allowNull: false
	}
});

module.exports = TestModel;
