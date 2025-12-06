// server/controllers/projectController.js

const asyncHandler = require('express-async-handler');
const Project = require('../models/Project'); // Dependency on Project model
const Team = require('../models/Team'); // Dependency on Team model
const User = require('../models/User'); // Dependency on User model


// Helper function to check if the user is a member of the given team
const checkTeamMembership = async (userId, teamId, res) => {
    const team = await Team.findById(teamId);
    
    if (!team) {
        res.status(404);
        throw new Error('Team not found.');
    }
    
    // Check if the user ID is included in the team's members array
    if (!team.members.map(id => id.toString()).includes(userId.toString())) {
        res.status(403);
        throw new Error('User is not a member of this team.');
    }
    return team;
};


// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { name, description, teamId } = req.body;
    
    // 1. Basic Validation
    if (!name || !teamId) {
        res.status(400);
        throw new Error('Project name and team ID are required.');
    }

    // 2. Authorization Check: Ensure user is a member of the team
    const team = await checkTeamMembership(req.user._id, teamId, res);
    if (!team) return; // Error already handled by helper

    // 3. Create the project
    const project = await Project.create({
        name,
        description,
        team: teamId,
        owner: req.user._id, // The user who created the project
    });

    // 4. Update the Team document to reference the new project
    team.projects.push(project._id);
    await team.save();

    res.status(201).json(project);
});


// @desc    Get all projects for a specific team
// @route   GET /api/projects/team/:teamId
// @access  Private
const getTeamProjects = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId;

    // 1. Authorization Check: Ensure user is a member of the team
    const team = await checkTeamMembership(req.user._id, teamId, res);
    if (!team) return; // Error already handled by helper

    // 2. Fetch all projects associated with the team
    // We only select essential fields for the dashboard list
    const projects = await Project.find({ team: teamId })
        .select('name description status createdAt owner')
        .populate('owner', 'name avatar'); // Get owner's name and avatar for display

    res.status(200).json(projects);
});


// Note: More functions like getProjectDetails, updateProject, deleteProject would be added here.
// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectDetails = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('owner', 'name email')
        .populate('tasks'); // We will populate tasks later when we add them

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Check if user belongs to the project's team
    // (We can skip complex checks for this quick tutorial or add them later)
    
    res.status(200).json(project);
});

module.exports = {
    createProject,
    getTeamProjects,
    getProjectDetails,
    // ... other exports
};