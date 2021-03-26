const todo = require('../controllers/todoController');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');

router.post('/', [jwtAuth], async (req, res) => {
  const response = await todo.createTodo(req.body.todo, req.claims.email);
  console.log('ausg');
  return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/', [jwtAuth], async (req, res) => {
  const response = await todo.getAllTodos(req.claims.userId);
  return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;
