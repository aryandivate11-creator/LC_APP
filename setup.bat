@echo off
echo 🚀 Setting up Leaving Certificate Management System
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd Backend

REM Install backend dependencies
echo Installing backend dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo ⚠️  Please update the .env file with your MongoDB connection string and other settings
)

REM Initialize admin user
echo Initializing admin user...
npm run init-admin

echo ✅ Backend setup complete!

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd ..\Front-End\vite-project

REM Install frontend dependencies
echo Installing frontend dependencies...
npm install

echo ✅ Frontend setup complete!

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the application:
echo 1. Start the backend server:
echo    cd Backend
echo    npm run dev
echo.
echo 2. Start the frontend server (in a new terminal):
echo    cd Front-End\vite-project
echo    npm run dev
echo.
echo 3. Open your browser and go to: http://localhost:5173
echo.
echo Default Admin Credentials:
echo Email: admin@gpm.edu.in
echo Password: admin123
echo.
echo Happy coding! 🚀
pause


