const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const Participant = require("./Participants");
const Item = require("./Items");

const ItemsParticipants = sequelize.define("items_participants", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  participant_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Participant,
      key: "id",
    },
  },
  item_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Item,
      key: "id",
    },
  },
  timestamp: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = ItemsParticipants;
