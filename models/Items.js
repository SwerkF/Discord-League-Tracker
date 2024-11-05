const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Item = sequelize.define("item", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  iconId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gold: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

module.exports = Item;
