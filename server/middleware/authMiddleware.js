// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Good practice for handling async errors
const User = require('../models/User'); // Import the User model

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Format: "Bearer TOKEN")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header (removes "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach user to the request object (without the password)
            req.user = await User.findById(decoded.id).select('-password');
            
            // Proceed to the next middleware or route handler
            next();

        } catch (error) {
            console.error(error);
            // If token is invalid or expired
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        // If no token is provided in the header
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

module.exports = { protect };