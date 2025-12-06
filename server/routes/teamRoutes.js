// server/routes/teamRoutes.js

const express = require('express');
const { 
    createTeam,
    getTeamDetails,
    addTeamMember,
    removeTeamMember,
    getUserTeams,
    // Add deleteTeam in a later step
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here will start with /api/teams

// POST /api/teams - Create a new team. Protected route.
router.post('/', protect, createTeam);

// GET /api/teams - Get all teams for the current user
router.get('/', protect, getUserTeams);

// GET /api/teams/:teamId - Get details of a specific team. Protected route.
router.get('/:teamId', protect, getTeamDetails);

// PUT /api/teams/:teamId/member - Add a member to the team (Admin check inside controller). Protected route.
router.put('/:teamId/member', protect, addTeamMember);

// DELETE /api/teams/:teamId/member/:memberId - Remove a member (Admin check inside controller). Protected route.
router.delete('/:teamId/member/:memberId', protect, removeTeamMember);


module.exports = router;