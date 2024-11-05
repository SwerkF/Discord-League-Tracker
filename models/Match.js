const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Match = sequelize.define("match", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  match_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  game_duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  game_mode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  game_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  game_start: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  game_end: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Match;
