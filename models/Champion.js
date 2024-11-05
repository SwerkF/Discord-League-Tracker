const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Champion = sequelize.define("champion", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lore: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
});

module.exports = Champion;
