// server/models/Team.js

const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a team name'],
        unique: true,
        trim: true,
    },
    // The user who created the team (the primary administrator)
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Array of users who are members of this team
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Array of projects managed by this team
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
    // Add an optional invite code or private/public status later
}, {
    timestamps: true,
});

module.exports = mongoose.model('Team', teamSchema);