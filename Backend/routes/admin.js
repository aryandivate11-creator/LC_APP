const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { verifyAdminToken } = require('../middleware/auth');

const router = express.Router();

// Get all students (with search and pagination)
router.get('/students', verifyAdminToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 10, status } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const students = await Student.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Student.countDocuments(query);
    
    res.json({
      students,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
    
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student
router.get('/students/:id', verifyAdminToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ student });
    
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new student
router.post('/students', verifyAdminToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
  body('motherName').notEmpty().withMessage('Mother name is required'),
  body('motherTongue').notEmpty().withMessage('Mother tongue is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('course').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, enrollmentNumber, motherName, motherTongue, course, year, personalDetails } = req.body;

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
      enrollmentNumber,
      motherName,
      motherTongue: motherTongue || 'Gujarati',
      course: course || '',
      year,
      personalDetails: {
        ...(personalDetails || {}),
        motherTongue: motherTongue || personalDetails?.motherTongue || 'Gujarati'
      },
      status: 'pending',
      password: 'default123' // Default password, student can change later
    });

    await student.save();

    res.status(201).json({
      message: 'Student added successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status
      }
    });

  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/students/:id', verifyAdminToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('enrollmentNumber').optional().notEmpty().withMessage('Enrollment number cannot be empty'),
  body('motherName').optional().notEmpty().withMessage('Mother name cannot be empty'),
  body('motherTongue').optional().notEmpty().withMessage('Mother tongue cannot be empty'),
  body('year').optional().notEmpty().withMessage('Year cannot be empty'),
  body('course').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const student = await Student.findById(req.params.id);
    
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
      message: 'Student updated successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status
      }
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student status (approve/pending)
router.patch('/students/:id/status', verifyAdminToken, [
  body('status').isIn(['pending', 'approved']).withMessage('Status must be pending or approved')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.status = status;
    await student.save();

    res.json({
      message: `Student status updated to ${status}`,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status
      }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/students/:id', verifyAdminToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate certificate for student
router.post('/students/:id/generate-certificate', verifyAdminToken, [
  body('certificateData').isObject().withMessage('Certificate data is required'),
  body('personalDetails').isObject().withMessage('Personal details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { certificateData, personalDetails } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.status !== 'approved') {
      return res.status(400).json({ 
        message: 'Cannot generate certificate for non-approved student' 
      });
    }

    // Update student with certificate data and personal details
    student.certificateGenerated = true;
    student.certificateGeneratedDate = new Date();
    student.personalDetails = {
      ...student.personalDetails,
      ...personalDetails
    };

    // Update basic student info if provided
    if (certificateData.name) student.name = certificateData.name;
    if (certificateData.motherName) student.motherName = certificateData.motherName;
    if (certificateData.motherTongue) student.motherTongue = certificateData.motherTongue;
    if (certificateData.branch) student.branch = certificateData.branch;
    if (certificateData.classAndYear) student.classAndYear = certificateData.classAndYear;

    await student.save();

    res.json({
      message: 'Certificate generated successfully',
      certificateGeneratedDate: student.certificateGeneratedDate,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status,
        personalDetails: student.personalDetails
      }
    });

  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', verifyAdminToken, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const approvedStudents = await Student.countDocuments({ status: 'approved' });
    const pendingStudents = await Student.countDocuments({ status: 'pending' });
    const certificatesGenerated = await Student.countDocuments({ certificateGenerated: true });

    res.json({
      stats: {
        totalStudents,
        approvedStudents,
        pendingStudents,
        certificatesGenerated
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
