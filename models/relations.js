const User = require('./user');
const Badge = require('./badge');
const UserBadge = require('./userBadge');

User.Badge = User.belongsToMany(Badge, {
  through: UserBadge
});
Badge.User = Badge.belongsToMany(User, {
  through: UserBadge
});

if (process.env.SYNC) {
  User.sync({
    alter: true
  });
  Badge.sync({
    alter: true
  });
  UserBadge.sync({
    alter: true
  });
}
module.exports = { User, Badge, UserBadge };
