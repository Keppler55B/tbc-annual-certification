const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// @route   PUT /api/users/:employeeId/module/:moduleId/complete
// @desc    Update module completion status
// @access  Public
router.put('/:employeeId/module/:moduleId/complete', [
    body('score').isNumeric().withMessage('Score must be a number'),
    body('totalQuestions').isNumeric().withMessage('Total questions must be a number')
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

        const { employeeId, moduleId } = req.params;
        const { score, totalQuestions } = req.body;

        const user = await User.findOne({ employeeId });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if user is assigned this module
        const assignedModule = user.assignedModules.find(m => m.moduleId === moduleId);
        if (!assignedModule) {
            return res.status(403).json({ 
                success: false, 
                message: 'User is not assigned to this module' 
            });
        }

        // Update module completion
        await user.updateModuleCompletion(moduleId, parseInt(score), parseInt(totalQuestions));

        res.json({
            success: true,
            message: 'Module completion updated successfully',
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
                certificateGenerated: user.certificateGenerated
            }
        });

    } catch (error) {
        console.error('Module completion error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating module completion' 
        });
    }
});

// @route   PUT /api/users/:employeeId/certificate
// @desc    Mark certificate as generated
// @access  Public
router.put('/:employeeId/certificate', async (req, res) => {
    try {
        const { employeeId } = req.params;

        const user = await User.findOne({ employeeId });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if training is completed
        if (!user.trainingCompleted) {
            return res.status(400).json({ 
                success: false, 
                message: 'Training must be completed before generating certificate' 
            });
        }

        user.certificateGenerated = true;
        await user.save();

        res.json({
            success: true,
            message: 'Certificate generation status updated',
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
                certificateGenerated: user.certificateGenerated
            }
        });

    } catch (error) {
        console.error('Certificate update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating certificate status' 
        });
    }
});

// @route   GET /api/users/:employeeId/progress
// @desc    Get user training progress
// @access  Public
router.get('/:employeeId/progress', async (req, res) => {
    try {
        const { employeeId } = req.params;

        const user = await User.findOne({ employeeId });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const completedModules = user.assignedModules.filter(m => m.completed);
        const totalModules = user.assignedModules.length;
        const progressPercentage = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;

        res.json({
            success: true,
            progress: {
                completedModules: completedModules.length,
                totalModules: totalModules,
                progressPercentage: progressPercentage,
                overallScore: user.overallScore,
                overallPercentage: user.overallPercentage,
                trainingCompleted: user.trainingCompleted,
                certificateGenerated: user.certificateGenerated,
                modules: user.assignedModules.map(module => ({
                    moduleId: module.moduleId,
                    moduleName: module.moduleName,
                    completed: module.completed,
                    score: module.score,
                    totalQuestions: module.totalQuestions,
                    percentage: module.percentage,
                    completedAt: module.completedAt
                }))
            }
        });

    } catch (error) {
        console.error('Progress retrieval error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving progress data' 
        });
    }
});

// @route   POST /api/users/:employeeId/email-results
// @desc    Log email results sending (for audit purposes)
// @access  Public
router.post('/:employeeId/email-results', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { emailSent, recipient } = req.body;

        const user = await User.findOne({ employeeId });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Log the email sending attempt (you could extend the schema to track this)
        console.log(`Email results sent for ${user.fullName} (${employeeId}) to ${recipient}`);

        res.json({
            success: true,
            message: 'Email results logged successfully'
        });

    } catch (error) {
        console.error('Email logging error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error logging email results' 
        });
    }
});

module.exports = router;
