const express = require('express');
const router = express.Router();
const { upload, resizeImage, uploadImage, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');
const { imageLimiter } = require('../middleware/rateLimiter');

// All image routes require authentication and rate limiting
router.post('/upload', authMiddleware, imageLimiter, upload.single('image'), uploadImage);
router.post('/resize', authMiddleware, imageLimiter, upload.single('image'), resizeImage);
router.delete('/:filename', authMiddleware, imageLimiter, deleteImage);

module.exports = router;
