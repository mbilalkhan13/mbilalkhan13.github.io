const express = require('express');
const authMiddleware = require('../middleware/auth');
const { studentLimiter } = require('../middleware/rateLimiter');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();

router.post('/', authMiddleware, studentLimiter, createStudent);
router.get('/', authMiddleware, studentLimiter, getStudents);
router.get('/:id', authMiddleware, studentLimiter, getStudentById);
router.put('/:id', authMiddleware, studentLimiter, updateStudent);
router.delete('/:id', authMiddleware, studentLimiter, deleteStudent);

module.exports = router;
