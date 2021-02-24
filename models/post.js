const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
  postId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING },
  image: { type: [DataTypes.BLOB], allowNull: false },
  description: { type: DataTypes.STRING },
  userBadge: { type: DataTypes.STRING },
  postNumber: { type: DataTypes.INTEGER }
};

const options = {
  timestamps: true
};

const post = sequelize.define('Post', schema, options);

module.exports = post;
