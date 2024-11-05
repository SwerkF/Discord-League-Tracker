const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./User");

const RankHistory = sequelize.define("rank_history", {
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
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = RankHistory;
