// server/controllers/teamController.js

const asyncHandler = require('express-async-handler');
const Team = require('../models/Team'); // Dependency on Team model
const User = require('../models/User'); // Dependency on User model

// --- Helper: Check if user is the Team Admin ---
const isTeamAdmin = (team, userId) => {
    // Compares the admin ObjectId field (converted to string) with the user ID
    return team.admin.toString() === userId.toString();
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
        res.status(400);
        throw new Error('Team name is required.');
    }

    // 1. Create the team
    const team = await Team.create({
        name,
        admin: userId,
        members: [userId], // Creator is automatically the first member and admin
    });

    // 2. Update the User document to include the new team reference
    await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });

    res.status(201).json(team);
});

// @desc    Get details of a specific team
// @route   GET /api/teams/:teamId
// @access  Private (Team Member)
const getTeamDetails = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId;
    const userId = req.user._id;

    // Fetch team and populate members and projects
    const team = await Team.findById(teamId)
        .populate('admin', 'name email avatar')
        .populate('members', 'name email avatar')
        .populate('projects', 'name description status'); 

    if (!team) {
        res.status(404);
        throw new Error('Team not found.');
    }

    // Authorization Check: Must be a member to view details
    // Note: Use .some() on the populated array to check for member ID
    const isMember = team.members.some(member => member._id.toString() === userId.toString());
    
    if (!isMember) {
        res.status(403);
        throw new Error('Not authorized to view this team.');
    }

    res.status(200).json(team);
});

// @desc    Add a member to a team
// @route   PUT /api/teams/:teamId/member
// @access  Private (Team Admin Only)
const addTeamMember = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const teamId = req.params.teamId;
    const adminId = req.user._id;

    // 1. Fetch team and new member user
    const team = await Team.findById(teamId);
    const newMember = await User.findOne({ email });

    if (!team || !newMember) {
        res.status(404);
        throw new Error(!team ? 'Team not found.' : 'User with that email not found.');
    }

    // 2. Authorization Check: Only the team admin can add members
    if (!isTeamAdmin(team, adminId)) {
        res.status(403);
        throw new Error('Only the team admin can manage members.');
    }

    // 3. Check if already a member (using includes on the array of ObjectIds)
    if (team.members.includes(newMember._id)) {
        res.status(400);
        throw new Error('User is already a member of this team.');
    }

    // 4. Add to Team and User documents (Atomic updates)
    await Team.findByIdAndUpdate(teamId, { $push: { members: newMember._id } });
    await User.findByIdAndUpdate(newMember._id, { $push: { teams: teamId } });

    // Fetch the updated team details to send back (optional but useful)
    const updatedTeam = await Team.findById(teamId).populate('members', 'name email avatar');

    res.status(200).json(updatedTeam);
});

// @desc    Remove a member from a team
// @route   DELETE /api/teams/:teamId/member/:memberId
// @access  Private (Team Admin Only)
const removeTeamMember = asyncHandler(async (req, res) => {
    const { teamId, memberId } = req.params;
    const adminId = req.user._id;

    const team = await Team.findById(teamId);

    if (!team) {
        res.status(404);
        throw new Error('Team not found.');
    }

    // 1. Authorization Check: Only the team admin can remove members
    if (!isTeamAdmin(team, adminId)) {
        res.status(403);
        throw new Error('Only the team admin can manage members.');
    }

    // 2. Prevent removing the admin
    if (memberId === team.admin.toString()) {
        res.status(400);
        throw new Error('Cannot remove the team admin.');
    }

    // 3. Remove from Team and User documents
    await Team.findByIdAndUpdate(teamId, { $pull: { members: memberId } });
    await User.findByIdAndUpdate(memberId, { $pull: { teams: teamId } });

    res.status(200).json({ message: 'Member successfully removed.' });
});

// @desc    Get all teams for the current user
// @route   GET /api/teams
// @access  Private
const getUserTeams = asyncHandler(async (req, res) => {
    // Find teams where the current user is listed in the 'members' array
    const teams = await Team.find({ members: req.user._id });
    res.status(200).json(teams);
});

module.exports = {
    createTeam,
    getTeamDetails,
    addTeamMember,
    removeTeamMember,
    getUserTeams,
};