// server/controllers/authController.js

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Dependency on the User model

// --- Helper function to Generate JWT Token ---
const generateToken = (id) => {
    // Uses the JWT_SECRET from your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields: name, email, and password.');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 3. Create user (Password hashing is handled in the User model's pre-save hook)
    const user = await User.create({
        name,
        email,
        password,
        // role defaults to 'Member' as defined in User model (recommended)
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            // 4. Generate and return JWT
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Check for user email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND if the password matches (using the method defined on the User model)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            // 3. Generate and return JWT
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // 401 Unauthorized
        throw new Error('Invalid credentials');
    }
});


module.exports = {
    registerUser,
    loginUser,
    // generateToken (optional to export)
};