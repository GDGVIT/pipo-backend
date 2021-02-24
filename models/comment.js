const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
  commentId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, default: 'anonymous' },
  postId: { type: DataTypes.UUID, default: 'anonymous' },
  comment: { type: DataTypes.STRING }
};

const options = {
  timestamps: true
};

const comment = sequelize.define('Comment', schema, options);

module.exports = comment;
