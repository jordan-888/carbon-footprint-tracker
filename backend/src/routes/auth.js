const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt details:', {
      body: req.body,
      headers: req.headers,
      url: req.url
    });

    const { email, password, name } = req.body;

    // Validate input
    if (!name) {
      console.log('Registration failed: Missing name');
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email) {
      console.log('Registration failed: Missing email');
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      console.log('Registration failed: Missing password');
      return res.status(400).json({ message: 'Password is required' });
    }

    console.log('Checking for existing user with email:', email);
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('User found:', user);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    console.log('Creating new user with:', { name, email });
    user = new User({
      email,
      password,
      name
    });

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully:', user._id);

    // Generate JWT token with the correct userId field
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Registration successful, sending response');
    res.status(201).json({
      token,  // Send the token
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
      errors: error.errors
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;