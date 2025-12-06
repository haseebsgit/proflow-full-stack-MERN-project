// server/routes/projectRoutes.js

const express = require('express');
const { 
    createProject, 
    getTeamProjects,
    getProjectDetails
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here will start with /api/projects

// POST /api/projects - Create a new project. Protected route.
router.post('/', protect, createProject);

// GET /api/projects/team/:teamId - Get all projects for a specific team. Protected route.
router.get('/team/:teamId', protect, getTeamProjects);

// You would add routes for GET /api/projects/:projectId, PUT, and DELETE here later.
// GET /api/projects/:id - Get single project details
router.get('/:id', protect, getProjectDetails);

module.exports = router;