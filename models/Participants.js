const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const User = require("./User");
const Champion = require("./Champion");
const Match = require("./Match");

const Participant = sequelize.define("participant", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  match_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Match,
      key: "id",
    },
  },
  champion_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Champion,
      key: "id",
    },
  },
  kills: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lane: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  deaths: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  assists: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  win: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  magicDamageDealtToChampions: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  physicalDamageDealtToChampions: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  trueDamageDealtToChampions: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  magicDamageTaken: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  physicalDamageTaken: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  trueDamageTaken: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalHeal: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  visionScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  goldEarned: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalMinionsKilled: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Participant;
