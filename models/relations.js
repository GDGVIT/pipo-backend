const { DataTypes } = require('sequelize')
const User = require('./user')
const Badge = require('./badge')
const UserBadge = require('./userBadge')
const Post = require('./post')
const Comment = require('./comment')
const Follow = require('./follow')
// const Challange = require('./challange')
// const sequelize = require('../db/db')
// sequelize.sync({ alter: true })

User.Post = User.hasMany(Post, {
  foreignKey: 'userId',
  type: DataTypes.UUID
})
Post.User = Post.belongsTo(User, {
  foreignKey: 'userId',
  type: DataTypes.UUID
})

User.Badge = User.belongsToMany(Badge, {
  through: UserBadge,
  foreignKey: 'UserUserId',
  constraints: false
})
Badge.User = Badge.belongsToMany(User, {
  through: UserBadge,
  foreignKey: 'BadgeBadgeId',
  constraints: false
})

Post.Comment = Post.hasMany(Comment, {
  foreignKey: 'postId',
  type: DataTypes.UUID
})
Comment.Post = Comment.belongsTo(Post, {
  foreignKey: 'postId',
  type: DataTypes.UUID
})

if (process.env.SYNC) {
  User.sync({
    alter: true
  })
  Badge.sync({
    alter: true
  })
  UserBadge.sync({
    alter: true
  })
  Post.sync({
    alter: true
  })
  Comment.sync({
    alter: true
  })
  Follow.sync({
    alter: true
  })
}
module.exports = { User, Badge, UserBadge, Post, Comment, Follow }
