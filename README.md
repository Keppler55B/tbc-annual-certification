# TBC Annual Compliance Training System

A comprehensive compliance training system for TBC with user-specific module assignments, progress tracking, and certificate generation.

## Features

- User authentication and registration
- Department-specific module assignments
- Progress tracking and scoring
- Certificate generation
- Responsive web interface
- MongoDB integration with fallback to in-memory storage

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Keppler55B/tbc-annual-certification.git
cd tbc-annual-certification
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:5000`

### Railway Deployment

This application is configured for easy deployment on Railway.

1. Fork this repository to your GitHub account
2. Connect your Railway account to GitHub
3. Create a new Railway project from your forked repository
4. Set the following environment variables in Railway:
   - `MONGODB_URI`: Your MongoDB connection string (or use Railway's MongoDB addon)
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NODE_ENV`: Set to `production`

Railway will automatically deploy your application using the `railway.json` configuration.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (automatically set by Railway)

## Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/
│   ├── assets/
│   ├── css/
│   └── js/
├── database/
├── server.js
└── package.json
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/modules` - Get available modules
- `POST /api/modules/submit` - Submit module answers

## License

This project is proprietary to TBC.
