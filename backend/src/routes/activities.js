const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { calculateCarbonFootprint } = require('../services/carbonCalculator');
const mongoose = require('mongoose');

// Get all activities for a user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type;

    const query = { user: req.user.userId };
    if (type) {
      query.type = type;
    }

    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activities summary
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await Activity.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(req.user.userId) 
        } 
      },
      {
        $group: {
          _id: '$type',
          totalCarbon: { $sum: '$carbonFootprint.value' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = summary.reduce((acc, curr) => acc + curr.totalCarbon, 0);
    
    res.json({
      byType: summary,
      total: {
        value: parseFloat(total.toFixed(2)),
        unit: 'kgCO2e'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new activity
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      category,
      description,
      amount,
      location,
      metadata
    } = req.body;

    // Calculate carbon footprint
    const carbonFootprint = calculateCarbonFootprint(type, category, amount);

    const activity = new Activity({
      user: req.user.userId,
      type,
      category,
      description,
      amount,
      carbonFootprint,
      location,
      metadata
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update activity
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Calculate carbon footprint
    const carbonFootprint = calculateCarbonFootprint(req.body.type, req.body.category, req.body.amount);

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          carbonFootprint
        }
      },
      { new: true }
    );

    res.json(updatedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Activity.aggregate([
      { $match: { user: req.user.userId } },
      {
        $group: {
          _id: '$type',
          totalCarbon: { $sum: '$carbonFootprint' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;