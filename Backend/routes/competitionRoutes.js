const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration'); //

// @route   POST /api/competitions/register
// @desc    Register a student for a specific competition
router.post('/register', async (req, res) => {
    const { userId, competitionId, competitionTitle } = req.body; //

    try {
        // 1. Check for duplicate registration to prevent double entry
        const existingRegistration = await Registration.findOne({ 
            userId, 
            competitionId 
        }); //

        if (existingRegistration) {
            return res.status(400).json({ msg: "You are already registered for this event!" }); //
        }

        // 2. Create and save new registration entry in MongoDB
        const newRegistration = new Registration({
            userId,
            competitionId,
            competitionTitle
        }); //

        await newRegistration.save(); //

        // Log success for your terminal debugging at 10.10.14.89
        console.log(`✅ User ${userId} registered for ${competitionTitle}`); //
        res.status(201).json({ msg: "Registration successful!", data: newRegistration }); //

    } catch (err) {
        console.error("Registration Error:", err.message); //
        res.status(500).json({ error: "Server Error: Could not complete registration" }); //
    }
});

// @route   GET /api/competitions/my-registrations/:userId
// @desc    Fetch all competitions joined by a specific student
router.get('/my-registrations/:userId', async (req, res) => {
    try {
        // Find all records matching the unique student ID
        const myEvents = await Registration.find({ userId: req.params.userId }); //
        res.json(myEvents); //
    } catch (err) {
        console.error("Fetch Error:", err.message); //
        res.status(500).send("Server Error"); //
    }
});

module.exports = router; //