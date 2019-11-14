const Sequelize = require("sequelize");

const sequelize = require("../database/mysql-db");

const WorkDay = sequelize.define("workDay", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  payRate: {
    type: Sequelize.DECIMAL(4, 2),
    allowNull: false
  },
  shift_start: {
    type: Sequelize.TIME,
    allowNull: false
  },
  shift_end: {
    type: Sequelize.TIME,
    allowNull: false
  },
  break_length: {
    type: Sequelize.INTEGER(2),
    allowNull: false
  },
  shift_hours: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  shift_wage: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  year: {
    type: Sequelize.INTEGER(4),
    allowNull: false
  },
  month: {
    type: Sequelize.INTEGER(2),
    allowNull: false
  },
  day: {
    type: Sequelize.INTEGER(2),
    allowNull: false
  },
  week_day: {
    type: Sequelize.INTEGER(1),
    allowNull: false
  },
  week: {
    type: Sequelize.INTEGER(2),
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    }
  }
});

module.exports = WorkDay;
