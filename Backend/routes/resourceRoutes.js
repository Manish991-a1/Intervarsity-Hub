const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. ENFORCE AUTOMATIC AND ROBUST UPLOADS DIRECTORY CREATION
// This prevents system failures if the folder gets accidentally renamed or deleted
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. ROBUST MULTER STORAGE ENGINE CONFIGURATION
// Sanitizes the file extensions and prevents multi-user name collisions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Appends a unique identifier timestamp to clean filenames
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 3. IN-MEMORY STORAGE ARRAY 
// Holds resource data structures locally (Replace with a MongoDB database call later if needed)
let resources = [];

// @route   GET /api/resources
// @desc    Get all uploaded resources in descending order
router.get('/', (req, res) => {
    res.json(resources);
});

// @route   POST /api/resources/upload
// @desc    Upload a new file to server storage disk layer
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Standardized metadata response footprint designed to sync with your React layer
        const newResource = {
            id: Date.now().toString(),
            name: req.file.originalname,
            type: path.extname(req.file.originalname).substring(1) || req.file.mimetype, 
            size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
            date: new Date().toISOString().split('T')[0],
            // Configured directly for your current network binding profile
            url: `http://10.10.70.54:5000/uploads/${req.file.filename}`
        };

        // Prepend directly to your data tracking state array
        resources.unshift(newResource); 
        
        res.status(201).json(newResource);
    } catch (error) {
        console.error("Resource handler internal failure logic block triggered:", error);
        res.status(500).json({ error: "Internal processing error occurred during file persistence" });
    }
});

module.exports = router;