require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Middlewares
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server running' });
});

// Group routes
// Routes
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));

// MongoDB connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not set in .env file');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
