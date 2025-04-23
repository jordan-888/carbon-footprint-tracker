const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['transport', 'energy', 'food', 'waste', 'other'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  carbonFootprint: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'kgCO2e'
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient querying
activitySchema.index({ user: 1, date: -1 });
activitySchema.index({ location: '2dsphere' });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 