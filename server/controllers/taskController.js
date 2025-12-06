const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { name, description, projectId, priority, assignedTo } = req.body;

    if (!name || !projectId) {
        res.status(400);
        throw new Error('Please add a name and project ID');
    }

    const task = await Task.create({
        name,
        description,
        project: projectId,
        priority: priority || 'Medium',
        assignedTo: assignedTo || null, // Optional assignee
        status: 'To Do'
    });

    // Add task to project's task list
    await Project.findByIdAndUpdate(projectId, {
        $push: { tasks: task._id }
    });

    // Populate assignee details if exists
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name avatar');

    res.status(201).json(populatedTask);
});

// @desc    Get tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ project: req.params.projectId })
        .populate('assignedTo', 'name avatar')
        .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(tasks);
});

// @desc    Update task status (Drag and Drop)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // 'To Do', 'In Progress', or 'Done'

    const task = await Task.findByIdAndUpdate(
        req.params.id, 
        { status },
        { new: true } // Return the updated document
    ).populate('assignedTo', 'name avatar');

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.status(200).json(task);
});

module.exports = {
    createTask,
    getTasks,
    updateTaskStatus
};