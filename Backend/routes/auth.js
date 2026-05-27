const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- 1. REGISTER ROUTE ---
// Accessible via POST to http://localhost:5000/api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, university } = req.body;
        
        // Simple validation to ensure data exists before hitting DB
        if (!name || !email || !password || !university) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword,
            university: university.trim(),
            points: 0 
        });

        await user.save();
        return res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// --- 2. LOGIN ROUTE ---
// Accessible via POST to http://localhost:5000/api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        return res.status(200).json({ 
            msg: "Login successful", 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                university: user.university,
                points: user.points || 0     
            } 
        });
    } catch (err) {
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// --- 3. COMPLETE TASK ROUTE ---
// Accessible via POST to http://localhost:5000/api/auth/complete-task
router.post('/complete-task', async (req, res) => {
    try {
        const { userId, pointsToAdd } = req.body;

        if (!userId || pointsToAdd === undefined) {
            return res.status(400).json({ msg: 'Missing field requirements' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { points: pointsToAdd } }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "Points updated successfully", points: user.points });
    } catch (err) {
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// --- 4. RANKINGS ROUTE ---
// Accessible via GET to http://localhost:5000/api/auth/rankings
router.get('/rankings', async (req, res) => {
    try {
        const topStudents = await User.find()
            .sort({ points: -1 }) 
            .limit(50)
            .select('name university points'); 

        return res.status(200).json(topStudents);
    } catch (err) {
        console.error("Leaderboard Fetch Error:", err);
        return res.status(500).json({ msg: "Could not calculate rankings" });
    }
});

module.exports = router;