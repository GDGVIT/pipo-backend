const { DataTypes } = require('sequelize')
const User = require('./user')
const Badge = require('./badge')
const UserBadge = require('./userBadge')
const Post = require('./post')

User.Badge = User.belongsToMany(Badge, {
  through: UserBadge
})
Badge.User = Badge.belongsToMany(User, {
  through: UserBadge
})

User.Post = User.hasMany(Post, {
  foreignKey: 'userId',
  type: DataTypes.UUID
})
Post.User = Post.belongsTo(User)

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
}
module.exports = { User, Badge, UserBadge }
