const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Training modules configuration (complete set)
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
            }
        ]
    },
    {
        id: 'password',
        number: 2,
        name: 'Password Security',
        description: 'Best practices for creating, managing, and protecting strong passwords',
        videoType: 'placeholder',
        duration: '8 minutes',
        objectives: [
            'Create strong, unique passwords',
            'Understand password manager benefits',
            'Learn multi-factor authentication',
            'Recognize password-related threats'
        ],
        questions: [
            {
                question: "What makes a password strong?",
                options: [
                    "Using your birthday",
                    "At least 12 characters with mixed case, numbers, and symbols",
                    "Using common words",
                    "Making it easy to remember"
                ],
                correct: 1
            },
            {
                question: "How often should you change your passwords?",
                options: [
                    "Every day",
                    "Only when compromised or required by policy",
                    "Never",
                    "Every week"
                ],
                correct: 1
            },
            {
                question: "What is two-factor authentication?",
                options: [
                    "Using two passwords",
                    "An additional security layer beyond just a password",
                    "Having two user accounts",
                    "Using uppercase and lowercase letters"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'data',
        number: 3,
        name: 'Data Protection & Privacy',
        description: 'Safeguarding sensitive information and understanding privacy regulations',
        videoType: 'placeholder',
        duration: '12 minutes',
        objectives: [
            'Classify data sensitivity levels',
            'Understand GDPR and privacy laws',
            'Learn secure data handling',
            'Practice data breach response'
        ],
        questions: [
            {
                question: "What is considered personally identifiable information (PII)?",
                options: [
                    "Only social security numbers",
                    "Any information that can identify an individual",
                    "Only credit card numbers",
                    "Only addresses"
                ],
                correct: 1
            },
            {
                question: "How should sensitive data be transmitted?",
                options: [
                    "Via regular email",
                    "Using encrypted channels only",
                    "Through social media",
                    "Via text message"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'finance',
        number: 10,
        name: 'Church Ministry Finance Training',
        description: 'Equipping ministries for faithful financial stewardship and proper financial controls',
        videoType: 'pdf',
        pdfUrl: '/assets/TBC_Church_Ministry_Finance_Training.pdf',
        duration: '15 minutes',
        objectives: [
            'Understand biblical principles for financial stewardship',
            'Learn key roles in church finance management',
            'Master budgeting basics for ministry operations',
            'Implement proper record keeping and reporting procedures',
            'Apply financial controls to reduce risk and ensure transparency'
        ],
        questions: [
            {
                question: "Why is regular financial reporting important in church ministry?",
                options: [
                    "It's required by law only",
                    "To build trust, ensure transparency, and maintain accountability to the congregation",
                    "Only the pastor needs to know financial details",
                    "It's not really necessary if you trust the treasurer"
                ],
                correct: 1
            },
            {
                question: "Only one person should be responsible for handling all church finances.",
                options: [
                    "True",
                    "False"
                ],
                correct: 1
            },
            {
                question: "What document should track all income and expenses?",
                options: [
                    "A simple notebook",
                    "Financial ledger or accounting system",
                    "Bank statements only",
                    "Memory and receipts"
                ],
                correct: 1
            },
            {
                question: "Who is typically responsible for financial decisions in a church?",
                options: [
                    "Only the pastor",
                    "The finance committee/treasurer",
                    "Every church member",
                    "The choir"
                ],
                correct: 1
            },
            {
                question: "Name one control measure to reduce financial risk.",
                options: [
                    "Let one person handle everything for efficiency",
                    "Segregation of duties, dual signatures, or regular audits",
                    "Keep all financial information secret",
                    "Only use cash transactions"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'incident',
        number: 4,
        name: 'Incident Reporting',
        description: 'How to properly report security incidents and breaches',
        videoType: 'placeholder',
        duration: '7 minutes',
        objectives: [
            'Recognize security incidents',
            'Learn reporting procedures',
            'Understand response timelines',
            'Practice incident documentation'
        ],
        questions: [
            {
                question: "When should you report a security incident?",
                options: [
                    "Only if you're certain it's serious",
                    "Immediately upon discovery",
                    "After trying to fix it yourself",
                    "Only during business hours"
                ],
                correct: 1
            },
            {
                question: "What information should be included in an incident report?",
                options: [
                    "Only the time it occurred",
                    "Who, what, when, where, and how",
                    "Only your opinion of what happened",
                    "Just the outcome"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'internet',
        number: 5,
        name: 'Safe Internet Practices',
        description: 'Guidelines for secure web browsing and online activities',
        videoType: 'placeholder',
        duration: '9 minutes',
        objectives: [
            'Identify unsafe websites',
            'Understand download risks',
            'Learn secure browsing habits',
            'Recognize web-based threats'
        ],
        questions: [
            {
                question: "What indicates a secure website?",
                options: [
                    "Colorful design",
                    "HTTPS and valid SSL certificate",
                    "Many advertisements",
                    "Social media links"
                ],
                correct: 1
            },
            {
                question: "When downloading software, you should:",
                options: [
                    "Use any available download site",
                    "Only download from official or trusted sources",
                    "Always choose the fastest download",
                    "Download everything to the desktop"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'role',
        number: 6,
        name: 'Role-Specific Threat Awareness',
        description: 'Understanding security threats specific to your job function',
        videoType: 'placeholder',
        duration: '11 minutes',
        objectives: [
            'Identify role-specific risks',
            'Understand targeted attacks',
            'Learn department-specific protocols',
            'Practice threat scenarios'
        ],
        questions: [
            {
                question: "Role-specific security training is important because:",
                options: [
                    "All employees face identical threats",
                    "Different roles have different risk profiles and access levels",
                    "It's required by law",
                    "It makes training more expensive"
                ],
                correct: 1
            },
            {
                question: "If you handle financial data, you should be especially aware of:",
                options: [
                    "Only physical security",
                    "Fraud attempts and financial scams",
                    "Only password security",
                    "Social media policies"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'malware',
        number: 7,
        name: 'Malware & Virus Prevention',
        description: 'Protecting systems from malicious software and viruses',
        videoType: 'placeholder',
        duration: '10 minutes',
        objectives: [
            'Recognize malware indicators',
            'Understand prevention methods',
            'Learn response procedures',
            'Practice safe computing habits'
        ],
        questions: [
            {
                question: "Common signs of malware infection include:",
                options: [
                    "Faster computer performance",
                    "Slow performance, pop-ups, and unexpected behavior",
                    "Better internet connectivity",
                    "Improved battery life"
                ],
                correct: 1
            },
            {
                question: "The best malware prevention strategy includes:",
                options: [
                    "Only using antivirus software",
                    "Regular updates, antivirus, and safe browsing habits",
                    "Avoiding all internet use",
                    "Only downloading from email"
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'safety',
        number: 8,
        name: 'Workplace Safety & Emergency Procedures',
        description: 'Physical safety protocols and emergency response procedures',
        videoType: 'placeholder',
        duration: '15 minutes',
        objectives: [
            'Know evacuation procedures',
            'Understand safety protocols',
            'Learn emergency contacts',
            'Practice safety scenarios'
        ],
        questions: [
            {
                question: "In case of a fire alarm, you should:",
                options: [
                    "Finish your current task first",
                    "Immediately evacuate using designated routes",
                    "Wait for further instructions",
                    "Take the elevator to exit quickly"
                ],
                correct: 1
            },
            {
                question: "Workplace safety is the responsibility of:",
                options: [
                    "Only the safety officer",
                    "Only management",
                    "Every employee",
                    "Only security personnel"
                ],
                correct: 2
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
    },
    {
        id: 'customer-service',
        number: 11,
        name: 'Customer Service & Hospitality In Ministry',
        description: 'Excellence in customer service and hospitality for ministry environments',
        videoType: 'pdf',
        pdfUrl: '/assets/TBC_Customer_Service_Hospitality_Ministry.pdf',
        duration: '15 minutes',
        objectives: [
            'Understand the importance of first impressions in ministry',
            'Learn effective listening and complaint handling techniques',
            'Master welcoming strategies for visitors and guests',
            'Develop professional communication skills for ministry settings',
            'Implement hospitality improvements in your ministry area'
        ],
        questions: [
            {
                question: "Why is the first impression important for church visitors?",
                options: [
                    "It doesn't really matter since they'll get to know us eventually",
                    "It sets the tone for their entire experience and can influence their decision to return",
                    "Only the pastor's impression matters",
                    "First impressions are overrated in church settings"
                ],
                correct: 1
            },
            {
                question: "Listening to a complaint is as important as solving it.",
                options: [
                    "True",
                    "False"
                ],
                correct: 0
            },
            {
                question: "What's a good way to make visitors feel welcome?",
                options: [
                    "Ignore them so they don't feel pressured",
                    "Greet them warmly, offer assistance, and provide helpful information",
                    "Only acknowledge them if they approach you first",
                    "Point them to a seat and leave them alone"
                ],
                correct: 1
            },
            {
                question: "If you don't know the answer to a visitor's question, you should:",
                options: [
                    "Ignore them",
                    "Make something up",
                    "Politely say you'll find out and follow up",
                    "Ask them to leave"
                ],
                correct: 2
            }
        ]
    }
];

// @route   GET /api/modules/:employeeId
// @desc    Get all assigned modules for a user
// @access  Public
router.get('/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        // Get user's assigned modules
        const userModules = User.getUserModules(employeeId);

        // Get full module details for assigned modules
        const assignedModules = userModules.map(userModule => {
            const fullModule = trainingModules.find(module => module.id === userModule.moduleId);
            return {
                ...fullModule,
                completed: userModule.completed,
                score: userModule.score,
                percentage: userModule.percentage,
                totalQuestions: userModule.totalQuestions
            };
        });

        res.json({
            success: true,
            modules: assignedModules
        });

    } catch (error) {
        console.error('Get user modules error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving user modules'
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
        let user = null;
        
        // Check if MongoDB is available
        if (global.mongodbAvailable && global.mongodbAvailable()) {
            user = await User.findOne({ employeeId });
        } else {
            user = global.findInMemoryUser(employeeId);
        }
        
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
