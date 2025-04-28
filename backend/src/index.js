const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const carbonRoutes = require('./routes/carbon');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Friendly root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Carbon Tracker API' });
});

// Friendly /api route
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Carbon Tracker API Root' });
});

// Database connection with more detailed error logging
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/carbon-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack
  });
});

// Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/carbon', carbonRoutes);

// Error handling middleware with more detail
app.use((err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});