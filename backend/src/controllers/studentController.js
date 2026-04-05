const { eq } = require('drizzle-orm');
const { db } = require('../db/client');
const { students } = require('../db/schema');

const isValidEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }

  const normalized = email.trim();
  if (!normalized || normalized.length > 254 || normalized.includes(' ')) {
    return false;
  }

  const atIndex = normalized.indexOf('@');
  if (atIndex <= 0 || atIndex !== normalized.lastIndexOf('@')) {
    return false;
  }

  const localPart = normalized.slice(0, atIndex);
  const domainPart = normalized.slice(atIndex + 1);

  if (!localPart || !domainPart) {
    return false;
  }

  const dotIndex = domainPart.indexOf('.');
  if (dotIndex <= 0 || dotIndex === domainPart.length - 1) {
    return false;
  }

  return true;
};

const validateStudentInput = ({ name, email, age, grade }) => {
  if (!name || !email || age === undefined || !grade) {
    return 'name, email, age, and grade are required';
  }

  if (!isValidEmail(email)) {
    return 'email is invalid';
  }

  const parsedAge = Number(age);
  if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
    return 'age must be an integer between 1 and 120';
  }

  return null;
};

const createStudent = async (req, res) => {
  try {
    const { name, email, age, grade } = req.body;
    const validationError = validateStudentInput({ name, email, age, grade });

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const newStudent = await db
      .insert(students)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: Number(age),
        grade: grade.trim(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student: newStudent[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Student email already exists' });
    }

    console.error('Create student error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create student' });
  }
};

const getStudents = async (req, res) => {
  try {
    const allStudents = await db.select().from(students);
    return res.json({ success: true, students: allStudents });
  } catch (error) {
    console.error('Get students error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get students' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid student id' });
    }

    const student = await db.select().from(students).where(eq(students.id, studentId)).limit(1);

    if (!student.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.json({ success: true, student: student[0] });
  } catch (error) {
    console.error('Get student error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid student id' });
    }

    const { name, email, age, grade } = req.body;
    const validationError = validateStudentInput({ name, email, age, grade });

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updated = await db
      .update(students)
      .set({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: Number(age),
        grade: grade.trim(),
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.json({ success: true, message: 'Student updated successfully', student: updated[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Student email already exists' });
    }

    console.error('Update student error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update student' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid student id' });
    }

    const deleted = await db.delete(students).where(eq(students.id, studentId)).returning();

    if (!deleted.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.json({ success: true, message: 'Student deleted successfully', student: deleted[0] });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
