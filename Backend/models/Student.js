const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  enrollmentNumber: {
    type: String,
    required: [true, 'Enrollment number is required'],
    unique: true,
    uppercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
    trim: true,
    uppercase: true
  },
  course: {
    type: String,
    trim: true,
    uppercase: true
  },
  motherTongue: {
    type: String,
    trim: true,
    default: 'Gujarati'
  },
  year: {
    type: String,
    required: [true, 'Year is required']
  },
  religion: {
    type: String,
    default: 'Hindu'
  },
  caste: {
    type: String,
    default: 'OBC'
  },
  nationality: {
    type: String,
    default: 'Indian'
  },
  placeOfBirth: {
    type: String,
    default: 'Mumbai'
  },
  dateOfBirth: {
    type: Date,
    default: Date.now
  },
  instituteLastAttended: {
    type: String,
    default: 'ABC High School, Mumbai'
  },
  dateOfAdmission: {
    type: Date,
    default: Date.now
  },
  branch: {
    type: String,
    trim: true,
    uppercase: true
  },
  classAndYear: {
    type: String,
    trim: true,
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  personalDetails: {
    religion: {
      type: String,
      default: 'Hindu'
    },
    caste: {
      type: String,
      default: 'OBC'
    },
    motherTongue: {
      type: String,
      default: 'Gujarati'
    },
    nationality: {
      type: String,
      default: 'Indian'
    },
    placeOfBirth: {
      type: String,
      default: 'Mumbai'
    },
    dateOfBirth: Date,
    instituteLastAttended: {
      type: String,
      default: 'ABC High School, Mumbai'
    },
    dateOfAdmission: Date,
    conduct: {
      type: String,
      default: 'Very Good'
    },
    reasonForLeaving: {
      type: String,
      default: 'Completion of Course'
    },
    remarks: {
      type: String,
      default: 'Good Academic Record'
    },
    dateOfLeaving: Date
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateGeneratedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
