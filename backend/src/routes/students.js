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

router.use(authMiddleware);
router.use(studentLimiter);
router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
