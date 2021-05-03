const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  challengeId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  challengerId: { type: DataTypes.UUID },
  challengedId: { type: DataTypes.UUID },
  startTime: { type: DataTypes.DATE, allowNull: false },
  timeDuration: { type: DataTypes.timeDuration, allowNull: false },
  title: {},
  description: {}
}

const options = {

  timestamps: true
}

const challenge = sequelize.define('challenge', schema, options)

module.exports = challenge
