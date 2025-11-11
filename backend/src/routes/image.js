const express = require('express');
const router = express.Router();
const { upload, resizeImage, uploadImage, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');

// All image routes require authentication
router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
router.post('/resize', authMiddleware, upload.single('image'), resizeImage);
router.delete('/:filename', authMiddleware, deleteImage);

module.exports = router;
