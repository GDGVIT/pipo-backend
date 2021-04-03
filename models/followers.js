const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  followerId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }
}

const options = {
  timestamps: true
}

const followers = sequelize.define('Followers', schema, options)

module.exports = followers
