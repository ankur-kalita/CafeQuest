const express = require('express');
const Cafe = require('../models/Cafe');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cafes
// @desc    Get all cafes for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, tags, search } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Filter by status
    if (status && ['visited', 'wishlist'].includes(status)) {
      query.status = status;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').filter((t) => t.trim());
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray };
      }
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const cafes = await Cafe.find(query).sort({ createdAt: -1 });
    res.json(cafes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cafes/:id
// @desc    Get single cafe
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const cafe = await Cafe.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    res.json(cafe);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cafes
// @desc    Create a new cafe
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, location, photo, rating, tags, notes, status, isPublic, visitedAt } = req.body;

    // Validation
    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const cafe = await Cafe.create({
      userId: req.user._id,
      name,
      location,
      photo: photo || '',
      rating: rating || 3,
      tags: tags || [],
      notes: notes || '',
      status: status || 'visited',
      isPublic: isPublic !== undefined ? isPublic : true,
      visitedAt: visitedAt || (status === 'visited' ? new Date() : null),
    });

    res.status(201).json(cafe);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cafes/:id
// @desc    Update a cafe
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, location, photo, rating, tags, notes, status, isPublic, visitedAt } = req.body;

    let cafe = await Cafe.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    // Update fields
    if (name !== undefined) cafe.name = name;
    if (location !== undefined) cafe.location = location;
    if (photo !== undefined) cafe.photo = photo;
    if (rating !== undefined) cafe.rating = rating;
    if (tags !== undefined) cafe.tags = tags;
    if (notes !== undefined) cafe.notes = notes;
    if (status !== undefined) cafe.status = status;
    if (isPublic !== undefined) cafe.isPublic = isPublic;
    if (visitedAt !== undefined) cafe.visitedAt = visitedAt;

    await cafe.save();
    res.json(cafe);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cafes/:id
// @desc    Delete a cafe
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const cafe = await Cafe.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    res.json({ message: 'Cafe removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
