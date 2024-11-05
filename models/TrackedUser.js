const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./User");
const Channel = require("./Channel");

const TrackedUser = sequelize.define("tracked_users", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
  },
  guild: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Channel,
      key: "id",
    },
  },
});

module.exports = TrackedUser;
