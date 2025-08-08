const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// In-memory store
const tasks = {};

router.get('/', authenticateToken, (req, res) => {
  const userTasks = tasks[req.user.username] || [];
  res.json(userTasks);
});

router.post('/', authenticateToken, (req, res) => {
  const { title, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required.' });

  const newTask = {
    id: Date.now().toString(),
    title,
    dueDate,
    completed: false,
  };

  if (!tasks[req.user.username]) {
    tasks[req.user.username] = [];
  }

  tasks[req.user.username].push(newTask);
  res.status(201).json(newTask);
});

module.exports = router;
