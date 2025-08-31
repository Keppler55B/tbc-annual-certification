const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Training modules configuration (matches frontend)
const trainingModules = [
    {
        id: 'phishing',
        number: 1,
        name: 'Phishing & Social Engineering Detection',
        description: 'How to recognize and report phishing, scam emails, and suspicious activity',
        videoUrl: 'https://www.youtube.com/embed/WNVTGTrWcvw?start=36',
        videoType: 'youtube',
        duration: '10 minutes',
        objectives: [
            'Identify common phishing indicators and red flags',
            'Understand social engineering tactics and manipulation techniques',
            'Learn proper reporting procedures for suspicious emails',
            'Recognize urgent or threatening language patterns',
            'Understand the financial and security impact of phishing attacks',
            'Practice safe email and link handling procedures'
        ],
        questions: [
            {
                question: "Which of the following is the MOST reliable indicator of a phishing email?",
                options: [
                    "The email has your company logo",
                    "Sender's email domain doesn't match the company name",
                    "The email is marked as important",
                    "It was sent during business hours"
                ],
                correct: 1
            },
            {
                question: "You receive an urgent email from 'IT Support' asking you to verify your password immediately. What should you do FIRST?",
                options: [
                    "Reply with your password immediately to avoid account suspension",
                    "Click the provided link to verify your credentials",
                    "Contact IT directly through official channels to verify the request",
                    "Forward the email to a colleague for their opinion"
                ],
                correct: 2
            },
            {
                question: "Social engineering attacks often exploit which psychological triggers?",
                options: [
                    "Urgency, fear, and authority",
                    "Complex technical jargon only",
                    "Long detailed explanations",
                    "Multiple file attachments"
                ],
                correct: 0
            },
            {
                question: "What should you do if you accidentally click on a suspicious link in an email?",
                options: [
                    "Continue browsing to see what happens",
                    "Immediately disconnect from the network and report to IT",
                    "Delete the email and pretend it never happened",
                    "Share the link with colleagues to warn them"
                ],
                correct: 1
            },
            {
                question: "Which of these email characteristics is LEAST likely to indicate a phishing attempt?",
                options: [
                    "Generic greeting like 'Dear Customer'",
                    "Urgent language demanding immediate action",
                    "Email sent during normal business hours",
                    "Suspicious attachments or links"
                ],
                correct: 2
            },
            {
                question: "Spear phishing differs from regular phishing because it:",
                options: [
                    "Uses more colorful graphics",
                    "Targets specific individuals with personalized information",
                    "Only happens on weekends",
                    "Always includes malware attachments"
                ],
                correct: 1
            },
            {
                question: "Before entering sensitive information on a website, you should always check for:",
                options: [
                    "Bright colors and animations",
                    "HTTPS encryption (lock icon) and correct URL spelling",
                    "Pop-up advertisements",
                    "Social media sharing buttons"
                ],
                correct: 1
            },
            {
                question: "If you receive an email claiming to be from your bank asking for account verification, you should:",
                options: [
                    "Provide the information immediately to avoid account closure",
                    "Call the bank directly using the number on your bank card or statement",
                    "Reply to the email asking for more details",
                    "Forward it to friends to see if they got the same email"
                ],
                correct: 1
            },
            {
                question: "Which of the following is a common sign that an email attachment might be malicious?",
                options: [
                    "It's a PDF document",
                    "It has an unusual file extension like .exe, .scr, or double extensions",
                    "It's larger than 1MB in size",
                    "It was sent during business hours"
                ],
                correct: 1
            },
            {
                question: "The best defense against phishing attacks includes:",
                options: [
                    "Only using Internet Explorer browser",
                    "Employee training, email filters, and verification procedures",
                    "Avoiding all email communication",
                    "Using only company computers for personal email"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'harassment',
        number: 9,
        name: 'Anti-Harassment in the Workplace',
        description: 'Recognize, denounce, and prevent all forms of harassment including sexual, physical, psychological, and cyberbullying',
        videoUrl: 'https://www.dol.gov/agencies/eta/apprenticeship/eeo/harassment/video',
        videoType: 'external',
        duration: '12 minutes',
        objectives: [
            'Recognize all forms of harassment',
            'Understand reporting procedures and confidentiality',
            'Practice bystander intervention',
            'Create respectful work environments',
            'Know anti-retaliation policies'
        ],
        questions: [
            {
                question: "Workplace harassment includes:",
                options: [
                    "Only physical contact",
                    "Only verbal abuse",
                    "Any unwelcome conduct that creates hostile environment",
                    "Only actions outside of work"
                ],
                correct: 2
            },
            {
                question: "As a bystander witnessing harassment, you should:",
                options: [
                    "Ignore it as it's not your business",
                    "Safely intervene or report to HR",
                    "Join in if others are laughing",
                    "Wait for the victim to complain first"
                ],
                correct: 1
            },
            {
                question: "Retaliation against someone who reports harassment is:",
                options: [
                    "Sometimes justified",
                    "A private matter",
                    "Strictly prohibited and illegal",
                    "Up to management discretion"
                ],
                correct: 2
            },
            {
                question: "Cyberbullying in the workplace includes:",
                options: [
                    "Only direct threats",
                    "Spreading rumors online, hostile emails, or social media harassment",
                    "Only physical threats",
                    "Constructive criticism"
                ],
                correct: 1
            },
            {
                question: "Creating a respectful workplace is the responsibility of:",
                options: [
                    "Only HR department",
                    "Only senior management",
                    "Only team leaders",
                    "Every employee at all levels"
                ],
                correct: 3
            }
        ]
    }
    // Note: Other modules would be defined here but are excluded for Timothy Young
];

// @route   GET /api/modules/:employeeId
// @desc    Get modules assigned to a specific user
// @access  Public
router.get('/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        // Get user-specific modules from the User model
        const userModules = User.getUserModules(employeeId);
        
        // Filter training modules to only include assigned ones
        const assignedTrainingModules = trainingModules.filter(module => 
            userModules.some(userModule => userModule.moduleId === module.id)
        );

        // Get user progress if user exists
        let userProgress = null;
        const user = await User.findOne({ employeeId });
        if (user) {
            userProgress = {
                assignedModules: user.assignedModules,
                overallScore: user.overallScore,
                overallPercentage: user.overallPercentage,
                trainingCompleted: user.trainingCompleted
            };
        }

        res.json({
            success: true,
            modules: assignedTrainingModules,
            userProgress: userProgress,
            totalModules: assignedTrainingModules.length,
            specialUser: employeeId === '969633' ? 'Timothy Young - Limited Module Access' : null
        });

    } catch (error) {
        console.error('Get modules error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving modules' 
        });
    }
});

// @route   GET /api/modules/:employeeId/:moduleId
// @desc    Get specific module details for a user
// @access  Public
router.get('/:employeeId/:moduleId', async (req, res) => {
    try {
        const { employeeId, moduleId } = req.params;

        // Check if user is assigned this module
        const userModules = User.getUserModules(employeeId);
        const isAssigned = userModules.some(module => module.moduleId === moduleId);

        if (!isAssigned) {
            return res.status(403).json({ 
                success: false, 
                message: 'User is not assigned to this module' 
            });
        }

        // Find the module
        const module = trainingModules.find(m => m.id === moduleId);
        
        if (!module) {
            return res.status(404).json({ 
                success: false, 
                message: 'Module not found' 
            });
        }

        // Get user's progress for this module
        let moduleProgress = null;
        const user = await User.findOne({ employeeId });
        if (user) {
            const userModule = user.assignedModules.find(m => m.moduleId === moduleId);
            if (userModule) {
                moduleProgress = {
                    completed: userModule.completed,
                    score: userModule.score,
                    totalQuestions: userModule.totalQuestions,
                    percentage: userModule.percentage,
                    completedAt: userModule.completedAt
                };
            }
        }

        res.json({
            success: true,
            module: module,
            progress: moduleProgress
        });

    } catch (error) {
        console.error('Get module error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving module' 
        });
    }
});

module.exports = router;
