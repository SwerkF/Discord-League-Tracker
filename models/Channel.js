const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Channel = sequelize.define("channel", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  channel_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  guild_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Channel;
