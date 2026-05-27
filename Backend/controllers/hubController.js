const User = require('../models/User');

/**
 * @desc    Get all active university hubs based on student registrations
 * @route   GET /api/hubs/active-hubs
 * @access  Public
 */
exports.getActiveHubs = async (req, res) => {
  try {
    // Aggregation Pipeline: Identify unique universities and count their students
    const hubs = await User.aggregate([
      {
        // Step 1: Group by the 'university' field in the User collection
        $group: {
          _id: "$university", 
          studentCount: { $sum: 1 }, // Count total students per group
          emailSample: { $first: "$email" } // Pick one email to extract the domain
        }
      },
      {
        // Step 2: Format the output for the frontend
        $project: {
          _id: 0,
          name: "$_id",
          registeredCount: "$studentCount",
          // Split email at '@' and take the second part (domain)
          domain: { $arrayElemAt: [{ $split: ["$emailSample", "@"] }, 1] }
        }
      },
      { 
        // Step 3: Sort by most active (highest count)
        $sort: { registeredCount: -1 } 
      }
    ]);

    res.status(200).json({
      success: true,
      count: hubs.length,
      data: hubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not aggregate hub data",
      error: error.message
    });
  }
};

/**
 * @desc    Get detailed list of students for a specific university hub
 * @route   GET /api/hubs/:universityName/students
 * @access  Private (Optional)
 */
exports.getHubDetails = async (req, res) => {
  try {
    const { universityName } = req.params;

    const students = await User.find({ university: universityName })
      .select('name email createdAt') // Don't send sensitive data like passwords
      .sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active students found for this university hub."
      });
    }

    res.status(200).json({
      success: true,
      university: universityName,
      activeStudents: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hub details",
      error: error.message
    });
  }
};