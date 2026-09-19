import express from 'express';
import { upload } from '../utils/cloudinary.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private/Admin
router.post('/', protect, authorize('SUPER ADMIN', 'SALES MANAGER'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }
  
  res.status(200).json({
    message: 'Image uploaded successfully',
    url: req.file.path, // Cloudinary URL
  });
});

export default router;
