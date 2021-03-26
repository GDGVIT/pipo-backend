const { User } = require('../models/relations');
const logger = require('../logging/logger');

class BadgeController {
  static async createTodo (todo, email) {
    try {
      const todoFound = await User.findAll({ where: { email: email } });
      if (todoFound[0].todo == null) {
        todoFound[0].todo = [todo];
        const updatedUser = await User.update(todoFound[0], { where: { email: email } });
        return {
          message: 'Added first todo',
          updatedUser
        };
      }
      const arr = todoFound[0].todo;
      console.log(arr);
      arr.push(todo);
      todoFound[0].todo = arr;
      const updatedUser = await User.update(todoFound, { where: { email: email } });
      return { message: 'Added todo', updatedUser };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  static async getAllTodos (userId) {
    try {
      const user = await User.findByPk(userId);
      if (!((user.todo).length)) {
        return user.todo;
      }
      return {
        message: 'Empty'
      };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }
}

module.exports = BadgeController;
