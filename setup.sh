#!/bin/bash

echo "🚀 Setting up Leaving Certificate Management System"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd Backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your MongoDB connection string and other settings"
fi

# Initialize admin user
echo "Initializing admin user..."
npm run init-admin

echo "✅ Backend setup complete!"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../Front-End

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo "1. Start the backend server:"
echo "   cd Backend"
echo "   npm run dev"
echo ""
echo "2. Start the frontend server (in a new terminal):"
echo "   cd Front-End"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to: http://localhost:5173"
echo ""
echo "Default Admin Credentials:"
echo "Email: admin@gpm.edu.in"
echo "Password: admin123"
echo ""
echo "Happy coding! 🚀"



