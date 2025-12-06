// server/server.js
const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const cors = require('cors');
require('dotenv').config({ path: './.env' }); // Load .env file

const connectDB = require('./config/db');

// --- 1. Initialization ---
const app = express();
const server = http.createServer(app); // HTTP server wrapped around Express
const PORT = process.env.PORT || 5000;

// --- 2. Socket.IO Setup ---
// Attach Socket.IO to the HTTP server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, 
        methods: ["GET", "POST"]
    }
});

// Basic Socket.IO connection handler (This is where real-time magic happens)
io.on('connection', (socket) => {
    console.log(`[Socket.IO] User Connected: ${socket.id}`);
    
    // In a real application, we'd add the user to their respective project rooms here.
    socket.on('disconnect', () => {
        console.log('[Socket.IO] User Disconnected', socket.id);
    });
});

// --- 3. Middleware ---
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json()); // Body parser for JSON data

// --- 4. Routes Integration ---
app.get('/', (req, res) => {
    res.send('ProFlow Backend is running and ready.');
});

// Import and use our modular route files:
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/teams', require('./routes/teamRoutes')); 
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));


// --- 5. Server Start ---
connectDB().then(() => {
    // We use the 'server' object (the one with Socket.IO attached) to listen.
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// Export the Socket.IO instance so controllers can use it (e.g., taskController.js)
module.exports = { io };