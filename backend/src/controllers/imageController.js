const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const resizeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    const { width, height, quality } = req.body;
    const inputPath = req.file.path;
    const outputFilename = `resized-${req.file.filename}`;
    const outputPath = path.join(__dirname, '../../uploads', outputFilename);

    // Parse dimensions
    const resizeOptions = {};
    if (width) resizeOptions.width = parseInt(width);
    if (height) resizeOptions.height = parseInt(height);

    // Resize image
    await sharp(inputPath)
      .resize(resizeOptions)
      .jpeg({ quality: quality ? parseInt(quality) : 80 })
      .toFile(outputPath);

    // Get image metadata
    const metadata = await sharp(outputPath).metadata();

    res.json({
      success: true,
      message: 'Image resized successfully',
      image: {
        original: `/uploads/${req.file.filename}`,
        resized: `/uploads/${outputFilename}`,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      }
    });
  } catch (error) {
    console.error('Resize error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to resize image',
      error: error.message 
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    const metadata = await sharp(req.file.path).metadata();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        size: req.file.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image' 
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Sanitize filename to prevent path traversal attacks
    const sanitizedFilename = path.basename(filename);
    
    // Only allow files in the uploads directory
    const filePath = path.join(__dirname, '../../uploads', sanitizedFilename);
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    // Verify the resolved path is within the uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file path'
      });
    }

    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete image'
    });
  }
};

module.exports = { upload, resizeImage, uploadImage, deleteImage };
