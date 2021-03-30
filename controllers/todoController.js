const { User } = require('../models/relations');
const logger = require('../logging/logger');

class TodoController {
  static async createTodo (todo, email) {
    try {
      const todoFound = await User.findAll({ where: { email: email } });
      if (todoFound[0].todo == null) {
        const arr = [];
        arr.push(todo);
        todoFound[0].todo = arr;
        const val = {};
        val.todo = todoFound[0].todo;
        const updatedUser = await User.update(val, { where: { email: email } });
        return {
          message: 'Added first todo',
          updatedUser
        };
      }
      const arr = todoFound[0].todo;
      arr.push(todo);
      todoFound[0].todo = arr;
      const val = {};
      val.todo = todoFound[0].todo;
      const updatedUser = await User.update(val, { where: { email: email } });
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
      if ((user.todo) == null) {
        return {
          message: 'Empty'
        };
      }
      return user.todo;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }
}

module.exports = TodoController;
