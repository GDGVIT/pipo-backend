const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
  userId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER, allowNull: false, default: 20 }
};

const options = {
  timestamps: false
};

const user = sequelize.define('User', schema, options);

module.exports = user;
