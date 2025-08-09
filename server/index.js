const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const authenticateToken = require('./middleware/authMiddleware');

// Middleware to parse JSON
app.use(express.json());

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://task-app-mvp.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (e.g., Postman) where origin is undefined/null
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Base test route
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend API!" });
});

// Protected route test
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}! You accessed a protected route.`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
