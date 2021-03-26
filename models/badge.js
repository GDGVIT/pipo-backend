const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
  badgeId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  badgeName: { type: DataTypes.STRING, allowNull: false },
  days: { type: DataTypes.INTEGER, allowNull: false },
  badgeImgUrl: { type: DataTypes.STRING },
  upvotes: { type: DataTypes.INTEGER, allowNull: false, default: 0 }
};

const options = {

  timestamps: false
};

const badge = sequelize.define('Badge', schema, options);

module.exports = badge;
