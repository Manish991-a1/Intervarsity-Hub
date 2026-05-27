const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');

// --- PUBLIC ROUTES ---

/**
 * @route   GET /api/hubs/active-hubs
 * @desc    Get all unique university hubs with student counts and domains
 */
router.get('/active-hubs', hubController.getActiveHubs);

// --- SEMI-PRIVATE ROUTES ---

/**
 * @route   GET /api/hubs/:universityName/students
 * @desc    Get the list of students registered under a specific university hub
 * @param   universityName (e.g., "Medi-Caps University")
 */
router.get('/:universityName/students', hubController.getHubDetails);

module.exports = router;