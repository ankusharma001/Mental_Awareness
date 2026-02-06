require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server running' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));
// Article routes
app.use('/api/articles', require('./routes/article'));
// Group routes
app.use('/api/groups', require('./routes/group'));

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
