const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: '*'
}));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authapp';
// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    firstname: {
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
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Team Schema
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

// Routes

// Create Team endpoint
app.post('/team/create', async (req, res) => {
    try {
        const { userId, name } = req.body;

        if (!userId || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide user ID and team name'
            });
        }

        const team = new Team({
            name,
            leader: userId,
            members: [userId]
        });

        await team.save();

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            team
        });

    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during team creation'
        });
    }
});

// Get Team endpoint
app.get('/team/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const team = await Team.findOne({ members: userId }).populate('members', 'firstname email');

        if (!team) {
            return res.json({
                success: true,
                team: null
            });
        }

        res.json({
            success: true,
            team
        });

    } catch (error) {
        console.error('Get team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving team'
        });
    }
});

// Add Member endpoint
app.post('/team/addMember', async (req, res) => {
    try {
        const { teamId, email } = req.body;

        if (!teamId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide team ID and member email'
            });
        }

        const userToAdd = await User.findOne({ email });

        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: 'User with this email not found'
            });
        }

        // Check if user is already in a team (optional but good practice)
        const existingTeam = await Team.findOne({ members: userToAdd._id });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'User is already in a team'
            });
        }

        const team = await Team.findByIdAndUpdate(
            teamId,
            { $addToSet: { members: userToAdd._id } },
            { new: true }
        ).populate('members', 'firstname email');

        res.json({
            success: true,
            message: 'Member added successfully',
            team
        });

    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding member'
        });
    }
});

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { firstname, email, password } = req.body;

        // Validation
        if (!firstname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide firstname, email and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = new User({
            firstname,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                firstname: user.firstname,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                firstname: user.firstname,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Get all users (for testing)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Authentication API is running in progress',
        endpoints: {
            register: 'POST /register',
            login: 'POST /login',
            users: 'GET /users (get all users)'
        },
        example: {
            register: {
                firstname: 'John',
                email: 'john@example.com',
                password: 'password123'
            },
            login: {
                email: 'john@example.com',
                password: 'password123'
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB: mongodb://localhost:27017/authapp`);
});