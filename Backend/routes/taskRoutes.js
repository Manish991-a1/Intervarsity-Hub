const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Required for ObjectId validation
const Task = require('../models/Task');
const User = require('../models/User');

// --- 1. GET ALL TASKS ---
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ _id: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. CREATE A TASK (Admin Only logic) ---
router.post('/create', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- 3. APPLY FOR A TASK ---
router.post('/apply/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const { userId } = req.body;

        // Check if already applied
        const alreadyApplied = task.applicants.find(a => a.userId === userId);
        if (alreadyApplied) return res.status(400).json({ msg: "Already applied" });

        task.applicants.push({ userId });
        await task.save();
        res.json({ msg: "Application successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. START A TASK (Handles both Standard ObjectIds and Custom String IDs) ---
router.patch('/:id/start', async (req, res) => {
    try {
        const taskId = req.params.id;
        let updatedTask;

        // 1. Try finding by standard MongoDB ObjectId or custom dummy IDs
        if (mongoose.Types.ObjectId.isValid(taskId)) {
            updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { status: 'in-progress', startedAt: new Date() },
                { new: true }
            );
        } else {
            // Fallback handling if using simple dummy string numbers like "1", "2", "3"
            updatedTask = await Task.findOneAndUpdate(
                { id: taskId }, // Looks for your custom 'id' field instead of native '_id'
                { status: 'in-progress', startedAt: new Date() },
                { new: true }
            );
        }
        
        if (!updatedTask) {
            return res.status(404).json({ error: "Task item target not found in DB" });
        }
        
        res.json(updatedTask);
    } catch (error) {
        console.error("Error inside PATCH /api/tasks/:id/start:", error);
        res.status(500).json({ error: "Internal operational server failure" });
    }
});

// --- 5. VERIFY & PAY ---
router.post('/verify', async (req, res) => {
    try {
        const { taskId, userId, pointsToAdd, amountToPay } = req.body;

        // 1. Update User Wallet & Points
        // Note: amountToPay is already (Budget - 2%) calculated on frontend
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                $inc: { 
                    wallet: amountToPay, 
                    points: pointsToAdd 
                } 
            },
            { new: true }
        );

        // 2. Update Task status to completed
        await Task.findByIdAndUpdate(taskId, { status: 'completed' });

        res.status(200).json({ msg: "Verified and Paid", wallet: user.wallet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during verification" });
    }
});

module.exports = router;