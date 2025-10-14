const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const initializeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new Admin({
      name: 'ADMIN',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
    
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the initialization
initializeAdmin();
