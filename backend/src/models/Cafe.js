const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Cafe name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters'],
  },
  photo: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  tags: {
    type: [String],
    enum: ['wifi', 'quiet', 'aesthetic', 'good-coffee', 'pet-friendly'],
    default: [],
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: '',
  },
  status: {
    type: String,
    enum: ['visited', 'wishlist'],
    default: 'visited',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  visitedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
cafeSchema.index({ userId: 1, createdAt: -1 });
cafeSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Cafe', cafeSchema);
