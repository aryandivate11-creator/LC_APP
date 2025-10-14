const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { verifyStudentToken } = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', verifyStudentToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ student });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', verifyStudentToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('motherName').optional().notEmpty().withMessage('Mother name cannot be empty'),
  body('course').optional().notEmpty().withMessage('Course cannot be empty'),
  body('year').optional().notEmpty().withMessage('Year cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const student = await Student.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student fields
    const updateFields = req.body;
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        student[key] = updateFields[key];
      }
    });

    await student.save();

    res.json({
      message: 'Profile updated successfully',
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
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/password', verifyStudentToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check current password
    const isMatch = await student.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    student.password = newPassword;
    await student.save();

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificate status
router.get('/certificate', verifyStudentToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      certificate: {
        status: student.status,
        generated: student.certificateGenerated,
        generatedDate: student.certificateGeneratedDate,
        student: {
          name: student.name,
          email: student.email,
          enrollmentNumber: student.enrollmentNumber,
          motherName: student.motherName,
          course: student.course,
          year: student.year,
          personalDetails: student.personalDetails
        }
      }
    });
    
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard data
router.get('/dashboard', verifyStudentToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      dashboard: {
        student: {
          name: student.name,
          email: student.email,
          enrollmentNumber: student.enrollmentNumber,
          status: student.status,
          course: student.course,
          year: student.year,
          motherName: student.motherName,
          personalDetails: student.personalDetails
        },
        certificate: {
          status: student.status,
          generated: student.certificateGenerated,
          generatedDate: student.certificateGeneratedDate,
          createdAt: student.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



