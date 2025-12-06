// server/routes/authRoutes.js

const express = require('express');
// Import the controller functions that contain the actual logic
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
// Route to create a new user account. This is a public route.
router.post('/register', registerUser);

// POST /api/auth/login
// Route to authenticate a user and receive a JWT token. This is a public route.
router.post('/login', loginUser);

module.exports = router;