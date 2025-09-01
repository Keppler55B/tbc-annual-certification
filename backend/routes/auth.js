const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user and get user data
// @access  Public
router.post('/login', [
    body('name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { name, email, employeeId, department } = req.body;

        let user;

        // Check if MongoDB is available
        if (global.mongodbAvailable && global.mongodbAvailable()) {
            // Use MongoDB
            user = await User.findOne({ employeeId });

            if (user) {
                // Update user information and last login
                user.fullName = name;
                user.email = email;
                user.department = department;
                user.lastLogin = new Date();
                
                // Check and update admin status
                const isAdminUser = User.isAdminUser(employeeId);
                user.isAdmin = isAdminUser;
                user.adminLevel = isAdminUser ? 'full' : 'none';
                
                await user.save();
            } else {
                // Check if user is admin
                const isAdminUser = User.isAdminUser(employeeId);
                
                // Create new user
                user = new User({
                    fullName: name,
                    email,
                    employeeId,
                    department,
                    lastLogin: new Date(),
                    isAdmin: isAdminUser,
                    adminLevel: isAdminUser ? 'full' : 'none'
                });

                // Initialize modules based on employee ID
                await user.initializeModules();
            }
        } else {
            // Use in-memory storage
            user = global.findInMemoryUser(employeeId);
            
            if (user) {
                // Update existing user
                const isAdminUser = User.isAdminUser(employeeId);
                global.updateInMemoryUser(employeeId, {
                    name,
                    email,
                    department,
                    lastLogin: new Date(),
                    isAdmin: isAdminUser,
                    adminLevel: isAdminUser ? 'full' : 'none'
                });
                user = global.findInMemoryUser(employeeId);
            } else {
                // Create new user in memory
                const isAdminUser = User.isAdminUser(employeeId);
                user = global.createInMemoryUser({
                    name,
                    email,
                    employeeId,
                    department,
                    isAdmin: isAdminUser,
                    adminLevel: isAdminUser ? 'full' : 'none'
                });
            }
        }

        // Return user data with assigned modules
        res.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                employeeId: user.employeeId,
                department: user.department,
                assignedModules: user.assignedModules,
                overallScore: user.overallScore,
                overallPercentage: user.overallPercentage,
                trainingCompleted: user.trainingCompleted,
                certificateGenerated: user.certificateGenerated,
                lastLogin: user.lastLogin,
                isAdmin: user.isAdmin,
                adminLevel: user.adminLevel
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication' 
        });
    }
});

// @route   GET /api/auth/user/:employeeId
// @desc    Get user data by employee ID
// @access  Public
router.get('/user/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        let user;
        
        // Check if MongoDB is available
        if (global.mongodbAvailable && global.mongodbAvailable()) {
            user = await User.findOne({ employeeId });
        } else {
            user = global.findInMemoryUser(employeeId);
        }
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                employeeId: user.employeeId,
                department: user.department,
                assignedModules: user.assignedModules,
                overallScore: user.overallScore,
                overallPercentage: user.overallPercentage,
                trainingCompleted: user.trainingCompleted,
                certificateGenerated: user.certificateGenerated,
                lastLogin: user.lastLogin,
                isAdmin: user.isAdmin,
                adminLevel: user.adminLevel
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving user data' 
        });
    }
});

module.exports = router;
