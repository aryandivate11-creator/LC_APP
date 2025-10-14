const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const router = express.Router();

// Generate JWT token
const generateToken = (user, role) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Student Signup
router.post('/student/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
  body('motherName').notEmpty().withMessage('Mother name is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('religion').optional(),
  body('caste').optional(),
  body('nationality').optional(),
  body('placeOfBirth').optional(),
  body('dateOfBirth').optional(),
  body('instituteLastAttended').optional(),
  body('dateOfAdmission').optional(),
  body('branch').optional(),
  body('classAndYear').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, enrollmentNumber, motherName, course, year, religion, caste, nationality, placeOfBirth, dateOfBirth, instituteLastAttended, dateOfAdmission, branch, classAndYear } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { enrollmentNumber }]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student already exists with this email or enrollment number' 
      });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      password,
      enrollmentNumber,
      motherName,
      course,
      year,
      religion: religion || 'Hindu',
      caste: caste || 'OBC',
      nationality: nationality || 'Indian',
      placeOfBirth: placeOfBirth || 'Mumbai',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
      instituteLastAttended: instituteLastAttended || 'ABC High School, Mumbai',
      dateOfAdmission: dateOfAdmission ? new Date(dateOfAdmission) : new Date(),
      branch: branch || course,
      classAndYear: classAndYear || year,
      personalDetails: {
        religion: religion || 'Hindu',
        caste: caste || 'OBC',
        nationality: nationality || 'Indian',
        placeOfBirth: placeOfBirth || 'Mumbai',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        instituteLastAttended: instituteLastAttended || 'ABC High School, Mumbai',
        dateOfAdmission: dateOfAdmission ? new Date(dateOfAdmission) : new Date(),
        conduct: 'Very Good',
        reasonForLeaving: 'Completion of Course',
        remarks: 'Good Academic Record'
      },
      status: 'pending'
    });

    await student.save();

    // Generate token
    const token = generateToken(student, 'student');

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status
      }
    });

  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Student Login
router.post('/student/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(student, 'student');

    res.json({
      message: 'Student login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status,
        course: student.course,
        year: student.year,
        motherName: student.motherName
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Admin Login
router.post('/admin/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin, 'admin');

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'student') {
      const student = await Student.findById(decoded.id).select('-password');
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json({ user: student, role: 'student' });
    } else if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      return res.json({ user: admin, role: 'admin' });
    }

    res.status(400).json({ message: 'Invalid token' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

module.exports = router;
