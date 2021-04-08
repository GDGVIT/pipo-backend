const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  followId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  followerId: { type: DataTypes.UUID },
  followingId: { type: DataTypes.UUID },
  isFriend: { type: DataTypes.BOOLEAN }
}

const options = {

  timestamps: true
}

const follow = sequelize.define('Follow', schema, options)

module.exports = follow
