const express = require('express');
const { cloudinary, upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// @route   POST /api/upload/base64
// @desc    Upload base64 image to Cloudinary
// @access  Private
router.post('/base64', protect, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'cafequest',
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// @route   DELETE /api/upload/:public_id
// @desc    Delete image from Cloudinary
// @access  Private
router.delete('/:public_id', protect, async (req, res) => {
  try {
    const { public_id } = req.params;
    await cloudinary.uploader.destroy(`cafequest/${public_id}`);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

module.exports = router;
