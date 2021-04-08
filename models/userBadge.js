const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  userBadgeId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  inProgress: {
    type: DataTypes.BOOLEAN,
    default: true
  },
  daysLeft: { type: DataTypes.INTEGER }
}

const options = {

  timestamps: true
}

const userBadge = sequelize.define('UserBadge', schema, options)

module.exports = userBadge
