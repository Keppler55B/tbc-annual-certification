const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// In-memory storage for development (when MongoDB is not available)
let inMemoryUsers = new Map();
let mongodbAvailable = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: errors
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    
    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'TBC Compliance Training Server is running',
        timestamp: new Date().toISOString(),
        mongodb: mongodbAvailable ? 'Connected' : 'Using in-memory storage'
    });
});

// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/users', require('./backend/routes/users'));
app.use('/api/modules', require('./backend/routes/modules'));

// Global error handler middleware (must be after routes)
app.use(errorHandler);

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tbc-compliance', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('MongoDB connected successfully');
        mongodbAvailable = true;
    } catch (error) {
        console.error('MongoDB connection failed, using in-memory storage for development');
        mongodbAvailable = false;
        // Don't retry immediately, just use in-memory storage
    }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
    mongodbAvailable = true;
});

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    mongodbAvailable = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected, switching to in-memory storage');
    mongodbAvailable = false;
});

// In-memory storage helper functions
const createInMemoryUser = (userData) => {
    const userId = Date.now().toString();
    const user = {
        _id: userId,
        fullName: userData.name, // Correctly map name to fullName
        email: userData.email,
        employeeId: userData.employeeId,
        department: userData.department,
        assignedModules: [],
        overallScore: 0,
        overallPercentage: 0,
        trainingCompleted: false,
        certificateGenerated: false,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    // Initialize modules based on employee ID
    const User = require('./backend/models/User');
    const userModules = User.getUserModules(userData.employeeId);
    user.assignedModules = userModules.map(module => ({
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        completed: false,
        score: 0,
        totalQuestions: 0,
        percentage: 0
    }));
    
    inMemoryUsers.set(userData.employeeId, user);
    return user;
};

const findInMemoryUser = (employeeId) => {
    return inMemoryUsers.get(employeeId) || null;
};

const updateInMemoryUser = (employeeId, updates) => {
    const user = inMemoryUsers.get(employeeId);
    if (user) {
        Object.assign(user, updates, { updatedAt: new Date() });
        inMemoryUsers.set(employeeId, user);
        return user;
    }
    return null;
};

// Export helper functions for routes to use
global.mongodbAvailable = () => mongodbAvailable;
global.createInMemoryUser = createInMemoryUser;
global.findInMemoryUser = findInMemoryUser;
global.updateInMemoryUser = updateInMemoryUser;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit the process, just log the error
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
    console.log('Application started successfully with improved error handling');
});
