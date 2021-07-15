const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  challangeId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  challangerId: { type: DataTypes.UUID, allowNull: false },
  challangedId: { type: DataTypes.UUID, allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  timeDuration: { type: DataTypes.TIME, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false }
}

const options = {

  timestamps: true
}

const challenge = sequelize.define('challenge', schema, options)

module.exports = challenge
