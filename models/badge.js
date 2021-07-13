const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  badgeId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  badgeName: { type: DataTypes.STRING, allowNull: false },
  badgeUrl: { type: DataTypes.STRING },
  hasChallenge: { type: DataTypes.BOOLEAN, allowNull: false },
  days: { type: DataTypes.INTEGER, allowNull: false },
  upvotes: { type: DataTypes.INTEGER, allowNull: false, default: 0 }
}

const options = {

  timestamps: false
}

const badge = sequelize.define('Badge', schema, options)

module.exports = badge
