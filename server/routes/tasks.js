const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// In-memory store
const tasks = {};

// GET all tasks
router.get('/', authenticateToken, (req, res) => {
  const userTasks = tasks[req.user.username] || [];
  res.json(userTasks);
});

// CREATE a new task
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

// UPDATE a task (toggle complete or edit title/date)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, dueDate, completed } = req.body;
  const userTasks = tasks[req.user.username] || [];

  const task = userTasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Task not found.' });

  if (title !== undefined) task.title = title;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// DELETE a task
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  if (!tasks[req.user.username]) {
    return res.status(404).json({ message: 'No tasks for this user.' });
  }

  tasks[req.user.username] = tasks[req.user.username].filter(t => t.id !== id);
  res.json({ message: 'Task deleted.' });
});

module.exports = router;
