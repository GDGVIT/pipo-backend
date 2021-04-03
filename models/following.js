const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  followingId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }
}

const options = {
  timestamps: true
}

const following = sequelize.define('Following', schema, options)

module.exports = following
