const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get all activities for a user
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.userId })
      .sort({ date: -1 });
    res.json(activities);
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
      carbonFootprint,
      location,
      metadata
    } = req.body;

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

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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

    await activity.remove();
    res.json({ message: 'Activity removed' });
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
          totalCarbon: { $sum: '$carbonFootprint.value' },
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