const express = require('express');
const Cafe = require('../models/Cafe');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/discover
// @desc    Get public cafes from all users (for discovery feed)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { tags, search, page = 1, limit = 20 } = req.query;

    // Build query for public cafes (excluding current user's cafes)
    const query = {
      isPublic: true,
      userId: { $ne: req.user._id },
    };

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').filter((t) => t.trim());
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray };
      }
    }

    // Search by name or location
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cafes = await Cafe.find(query)
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Cafe.countDocuments(query);

    res.json({
      cafes,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/discover/:id/save
// @desc    Save a discovered cafe to user's wishlist
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
  try {
    const originalCafe = await Cafe.findById(req.params.id);

    if (!originalCafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    // Check if user already has this cafe saved
    const existingCafe = await Cafe.findOne({
      userId: req.user._id,
      name: originalCafe.name,
      location: originalCafe.location,
    });

    if (existingCafe) {
      return res.status(400).json({ message: 'Cafe already in your collection' });
    }

    // Create a copy in user's wishlist
    const newCafe = await Cafe.create({
      userId: req.user._id,
      name: originalCafe.name,
      location: originalCafe.location,
      photo: originalCafe.photo,
      rating: originalCafe.rating,
      tags: originalCafe.tags,
      notes: `Discovered from ${originalCafe.userId}'s collection`,
      status: 'wishlist',
      isPublic: false,
    });

    res.status(201).json(newCafe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
