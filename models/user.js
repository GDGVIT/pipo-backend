const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  userId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
  userName: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER, allowNull: false, default: 20 },
  // password: { type: DataTypes.STRING },
  isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, default: false },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
  todo: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  picture: { type: DataTypes.STRING, allowNull: false }
}

const options = {
  timestamps: false
}

const user = sequelize.define('User', schema, options)

module.exports = user
