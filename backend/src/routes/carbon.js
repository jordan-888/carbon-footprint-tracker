const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Carbon emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
  transport: {
    car: 0.171, // kg CO2e per km
    bus: 0.04,  // kg CO2e per km
    train: 0.02, // kg CO2e per km
    plane: 0.255 // kg CO2e per km
  },
  energy: {
    electricity: 0.5, // kg CO2e per kWh
    natural_gas: 2.1, // kg CO2e per m³
    heating_oil: 2.7  // kg CO2e per liter
  },
  food: {
    meat: 27,    // kg CO2e per kg
    dairy: 2.4,  // kg CO2e per kg
    vegetables: 0.2, // kg CO2e per kg
    fruits: 0.3  // kg CO2e per kg
  },
  waste: {
    general: 2.53, // kg CO2e per kg
    recycling: -0.21 // kg CO2e per kg (negative because it reduces emissions)
  }
};

// Calculate carbon footprint for an activity
router.post('/calculate', auth, async (req, res) => {
  try {
    const { type, category, amount } = req.body;

    if (!EMISSION_FACTORS[type] || !EMISSION_FACTORS[type][category]) {
      return res.status(400).json({ message: 'Invalid activity type or category' });
    }

    const emissionFactor = EMISSION_FACTORS[type][category];
    const carbonFootprint = amount.value * emissionFactor;

    res.json({
      carbonFootprint: {
        value: carbonFootprint,
        unit: 'kgCO2e'
      },
      details: {
        type,
        category,
        amount,
        emissionFactor
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get emission factors
router.get('/factors', auth, (req, res) => {
  res.json(EMISSION_FACTORS);
});

// Calculate total carbon footprint for a time period
router.get('/total', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const activities = await Activity.find(query);
    
    const total = activities.reduce((sum, activity) => {
      return sum + activity.carbonFootprint.value;
    }, 0);

    const byType = activities.reduce((acc, activity) => {
      if (!acc[activity.type]) {
        acc[activity.type] = 0;
      }
      acc[activity.type] += activity.carbonFootprint.value;
      return acc;
    }, {});

    res.json({
      total: {
        value: total,
        unit: 'kgCO2e'
      },
      byType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 