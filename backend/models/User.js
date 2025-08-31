const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: [
            'Human Resources',
            'Information Technology',
            'Finance',
            'Operations',
            'Sales',
            'Marketing',
            'Customer Service',
            'Administration',
            'Legal',
            'Research & Development'
        ]
    },
    assignedModules: [{
        moduleId: {
            type: String,
            required: true
        },
        moduleName: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        score: {
            type: Number,
            default: 0
        },
        totalQuestions: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        },
        completedAt: {
            type: Date
        }
    }],
    overallScore: {
        type: Number,
        default: 0
    },
    overallPercentage: {
        type: Number,
        default: 0
    },
    trainingCompleted: {
        type: Boolean,
        default: false
    },
    certificateGenerated: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminLevel: {
        type: String,
        enum: ['none', 'full'],
        default: 'none'
    }
}, {
    timestamps: true
});

// Static method to check if user is admin
userSchema.statics.isAdminUser = function(employeeId) {
    const adminEmployeeIds = ['969631', '969632', '969634']; // Cornelius, Fatima, Mary
    return adminEmployeeIds.includes(employeeId);
};

// Static method to get user-specific modules
userSchema.statics.getUserModules = function(employeeId) {
    // Admin users get all modules
    if (this.isAdminUser(employeeId)) {
        return [
            {
                moduleId: 'phishing',
                moduleName: 'Phishing & Social Engineering Detection'
            },
            {
                moduleId: 'password',
                moduleName: 'Password Security'
            },
            {
                moduleId: 'data',
                moduleName: 'Data Protection & Privacy'
            },
            {
                moduleId: 'incident',
                moduleName: 'Incident Reporting'
            },
            {
                moduleId: 'internet',
                moduleName: 'Safe Internet Practices'
            },
            {
                moduleId: 'role',
                moduleName: 'Role-Specific Threat Awareness'
            },
            {
                moduleId: 'malware',
                moduleName: 'Malware & Virus Prevention'
            },
            {
                moduleId: 'safety',
                moduleName: 'Workplace Safety & Emergency Procedures'
            },
            {
                moduleId: 'harassment',
                moduleName: 'Anti-Harassment in the Workplace'
            }
        ];
    }
    
    // Special case for Timothy Young (Employee ID 969633) - restricted access
    if (employeeId === '969633') {
        return [
            {
                moduleId: 'phishing',
                moduleName: 'Phishing & Social Engineering Detection'
            },
            {
                moduleId: 'harassment',
                moduleName: 'Anti-Harassment in the Workplace'
            }
        ];
    }
    
    // Default modules for all other regular users
    return [
        {
            moduleId: 'phishing',
            moduleName: 'Phishing & Social Engineering Detection'
        },
        {
            moduleId: 'password',
            moduleName: 'Password Security'
        },
        {
            moduleId: 'data',
            moduleName: 'Data Protection & Privacy'
        },
        {
            moduleId: 'incident',
            moduleName: 'Incident Reporting'
        },
        {
            moduleId: 'internet',
            moduleName: 'Safe Internet Practices'
        },
        {
            moduleId: 'role',
            moduleName: 'Role-Specific Threat Awareness'
        },
        {
            moduleId: 'malware',
            moduleName: 'Malware & Virus Prevention'
        },
        {
            moduleId: 'safety',
            moduleName: 'Workplace Safety & Emergency Procedures'
        },
        {
            moduleId: 'harassment',
            moduleName: 'Anti-Harassment in the Workplace'
        }
    ];
};

// Method to initialize user modules based on employee ID
userSchema.methods.initializeModules = function() {
    const userModules = this.constructor.getUserModules(this.employeeId);
    this.assignedModules = userModules.map(module => ({
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        completed: false,
        score: 0,
        totalQuestions: 0,
        percentage: 0
    }));
    return this.save();
};

// Method to update module completion
userSchema.methods.updateModuleCompletion = function(moduleId, score, totalQuestions) {
    const moduleIndex = this.assignedModules.findIndex(m => m.moduleId === moduleId);
    if (moduleIndex !== -1) {
        const percentage = Math.round((score / totalQuestions) * 100);
        this.assignedModules[moduleIndex].completed = true;
        this.assignedModules[moduleIndex].score = score;
        this.assignedModules[moduleIndex].totalQuestions = totalQuestions;
        this.assignedModules[moduleIndex].percentage = percentage;
        this.assignedModules[moduleIndex].completedAt = new Date();
        
        // Calculate overall score
        const completedModules = this.assignedModules.filter(m => m.completed);
        if (completedModules.length > 0) {
            const totalScore = completedModules.reduce((sum, m) => sum + m.score, 0);
            const totalQuestions = completedModules.reduce((sum, m) => sum + m.totalQuestions, 0);
            this.overallScore = totalScore;
            this.overallPercentage = Math.round((totalScore / totalQuestions) * 100);
            
            // Check if all modules are completed
            this.trainingCompleted = completedModules.length === this.assignedModules.length;
        }
    }
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
