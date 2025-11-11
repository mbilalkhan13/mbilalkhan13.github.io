# Full Stack Image Resizer App

A modern full-stack web application for resizing images with user authentication. Built with Node.js Express backend and Next.js frontend.

## Features

### Backend (Node.js + Express)
- **User Authentication**
  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt
  - Protected API routes
- **Image Processing**
  - Image upload functionality
  - Image resizing with Sharp library
  - Customizable dimensions (width/height)
  - Quality control
  - Multiple image format support

### Frontend (Next.js + TypeScript)
- **Modern UI**
  - Responsive design
  - Gradient backgrounds
  - Clean and intuitive interface
- **User Features**
  - User registration/login pages
  - Protected dashboard
  - Image upload with preview
  - Real-time resize options
  - Download original and resized images
- **State Management**
  - React Context API for authentication
  - Local storage for session persistence

## Tech Stack

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Sharp (image processing)
- Multer (file uploads)
- CORS
- dotenv

### Frontend
- Next.js 15
- TypeScript
- React 19
- CSS Modules

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Register a new account**
   - Navigate to `http://localhost:3000/register`
   - Fill in your name, email, and password
   - Click "Register"

2. **Login**
   - Navigate to `http://localhost:3000/login`
   - Enter your credentials
   - Click "Login"

3. **Resize Images**
   - After logging in, you'll be redirected to the dashboard
   - Click "Select Image" to choose an image file
   - Preview the image
   - Set desired dimensions (width/height) - leave empty for auto
   - Adjust quality using the slider (1-100%)
   - Click "Resize Image"
   - View both original and resized images
   - Download either version

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Images
- `POST /api/images/upload` - Upload an image (protected)
- `POST /api/images/resize` - Upload and resize an image (protected)
- `DELETE /api/images/:filename` - Delete an image (protected)

### Health
- `GET /api/health` - Server health check

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── imageController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── image.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   └── utils/
    │       └── api.ts
    ├── .env.example
    ├── .env.local
    └── package.json
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Token validation middleware
- Secure HTTP headers with CORS
- Input validation
- File type validation for uploads
- File size limits (10MB)

## Notes

- The current implementation uses in-memory storage for users (not suitable for production)
- For production use, integrate a proper database (MongoDB, PostgreSQL, etc.)
- Update the JWT secret in production
- Consider adding rate limiting for API endpoints
- Implement proper error logging
- Add comprehensive testing

## License

ISC

## Author

Muhammad Bilal Khan