import express from 'express';
import { Activity } from '../models/Activity';
import { calculateCarbonFootprint } from '../utils/carbonCalculator';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all activities for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;

    const query: any = { user: req.user.id };
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
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new activity
router.post('/', auth, async (req, res) => {
  try {
    const { type, category, description, amount, date } = req.body;

    const carbonFootprint = calculateCarbonFootprint(type, category, amount);

    const activity = new Activity({
      user: req.user.id,
      type,
      category,
      description,
      amount,
      carbonFootprint,
      date: date || new Date()
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    if (error.message.includes('Invalid activity type or category')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update an activity
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, category, description, amount, date } = req.body;

    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const carbonFootprint = calculateCarbonFootprint(type, category, amount);

    activity.type = type;
    activity.category = category;
    activity.description = description;
    activity.amount = amount;
    activity.carbonFootprint = carbonFootprint;
    if (date) activity.date = date;

    await activity.save();
    res.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    if (error.message.includes('Invalid activity type or category')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Delete an activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 