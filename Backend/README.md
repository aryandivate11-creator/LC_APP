# Leaving Certificate Management System - Backend

A Node.js/Express backend API for the Leaving Certificate Management System for Government Polytechnic Mumbai.

## Features

- **Authentication System**: Separate login/signup for students and admins
- **Student Management**: CRUD operations for student records
- **Status Management**: Approve/pending status for students
- **Certificate Generation**: Track certificate generation status
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Data persistence with MongoDB

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://ogmandatory_db:<db_password>@mandatory.pyimksc.mongodb.net/?retryWrites=true&w=majority&appName=Mandatory
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
ADMIN_EMAIL=admin@gpm.edu.in
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:5173
```

3. Initialize the admin user:
```bash
npm run init-admin
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Admin Routes (`/api/admin`)

- `GET /api/admin/students` - Get all students (with search/pagination)
- `GET /api/admin/students/:id` - Get single student
- `POST /api/admin/students` - Add new student
- `PUT /api/admin/students/:id` - Update student
- `PATCH /api/admin/students/:id/status` - Update student status
- `DELETE /api/admin/students/:id` - Delete student
- `POST /api/admin/students/:id/generate-certificate` - Generate certificate
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Student Routes (`/api/student`)

- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `PUT /api/student/password` - Update password
- `GET /api/student/certificate` - Get certificate status
- `GET /api/student/dashboard` - Get dashboard data

## Database Models

### Student Model
- Personal information (name, email, enrollment number)
- Academic details (course, year, mother name)
- Status (pending/approved)
- Certificate generation tracking
- Personal details (religion, caste, etc.)

### Admin Model
- Admin credentials and role
- Login tracking
- Activity monitoring

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Default Admin Credentials

- **Email**: admin@gpm.edu.in
- **Password**: admin123

*Change these credentials in production!*

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Development

- Use `npm run dev` for development with auto-restart
- Use `npm start` for production
- Use `npm run init-admin` to create the default admin user

## Security Features

- Password hashing with bcryptjs
- JWT token expiration (7 days)
- Input validation and sanitization
- CORS configuration
- Role-based access control



