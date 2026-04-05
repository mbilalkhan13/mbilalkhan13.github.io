const rateLimit = require('express-rate-limit');

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for image operations
const imageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 image operations per windowMs
  message: 'Too many image operations, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for student CRUD operations
const studentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 student operations per windowMs
  message: 'Too many student API requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, imageLimiter, studentLimiter };
