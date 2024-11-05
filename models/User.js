const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Users = sequelize.define("users", {
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tag: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  puuid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  secretId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  iconId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  solo_duo_rank: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  solo_duo_rank_lp: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  flex_rank: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  flex_rank_lp: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Users;
