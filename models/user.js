const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
  userId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: true },
  points: { type: DataTypes.INTEGER, allowNull: true, default: 20 },
  password: { type: DataTypes.STRING },
  isAdmin: { type: DataTypes.BOOLEAN, allowNull: true, default: false },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
  todo: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
};

const options = {
  timestamps: false
};

const user = sequelize.define('User', schema, options);

module.exports = user;
