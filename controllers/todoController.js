const { User } = require('../models/relations')
const logger = require('../logging/logger')

class TodoController {
  static async createTodo (todo, email) {
    try {
      const todoFound = await User.findAll({ where: { email: email }, raw: true })
      todo = todo.split(',')
      todo.filter(function (e) { return true })
      if (todoFound[0].todo == null) {
        const val = {}
        val.todo = todo
        const updatedUser = await User.update(val, { where: { email: email } })
        return {
          message: 'Added first todo',
          updatedUser
        }
      }
      let arr = todoFound[0].todo
      arr = arr.concat(todo)
      todoFound[0].todo = arr
      const val = {}
      val.todo = todoFound[0].todo
      const updatedUser = await User.update(val, { where: { email: email } })
      return { message: 'Added todo', updatedUser }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllTodos (userId) {
    try {
      const user = await User.findByPk(userId)
      if ((user.todo) == null) {
        return {
          message: 'Empty List, start filling some today'
        }
      }
      return user.todo
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async deleteTodo (arrIndex, email) {
    try {
      const todoFound = await User.findAll({ where: { email: email } })
      if (todoFound[0].todo == null || todoFound[0].todo.length === 0) {
        return {
          message: 'Todo doesn\'t exist, so can\'t delete anything from it'
        }
      }
      const arr = todoFound[0].todo
      arr.splice(arrIndex, 1)
      todoFound[0].todo = arr
      const val = {}
      val.todo = todoFound[0].todo
      const updatedUser = await User.update(val, { where: { email: email } })
      return { message: 'Deleted todo', updatedUser }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async deleteAllTodos (email) {
    try {
      const todoFound = await User.findAll({ where: { email: email } })
      if (todoFound[0].todo == null || todoFound[0].todo.length === 0) {
        return {
          message: 'Todo doesn\'t exist, so can\'t delete anything from it'

        }
      }
      const val = {}
      val.todo = []
      const updatedUser = await User.update(val, { where: { email: email } })
      return { message: 'Deleted all todo, empty list', updatedUser }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }
}

module.exports = TodoController
