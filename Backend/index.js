const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Task = require('./models/Task'); // Imported for database seeding

const app = express();

// --- 1. MIDDLEWARE SETUP ---
app.use(express.json());

// Allows all incoming traffic (tunnels, mobile phones, localhost) to pass through smoothly
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 

// --- 2. FILE STORAGE CONFIGURATION ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📁 'uploads' directory created.");
}

// Serve files statically (e.g., http://localhost:5000/uploads/notes.pdf)
app.use('/uploads', express.static(uploadDir));

// --- 3. DATABASE CONNECTION & SEEDER ---
const seedTasksIfEmpty = async () => {
    try {
        const taskCount = await Task.countDocuments();
        if (taskCount === 0) {
            console.log("🌱 Database task collection is empty. Seeding initial data...");
            
            const dummyTasks = [
                {
                    title: "Website Bug Fix",
                    description: "Fix layout breakages and structural responsive padding alignments on the student dashboard.",
                    budget: 500,
                    points: 50,
                    status: "open",
                    type: "Paid",
                    difficulty: "Medium",
                    deadline: "2 days",
                    creatorId: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f7a8b9c0d1")
                },
                {
                    title: "Logo Design",
                    description: "Create a modern, high-resolution vector brand identity for the newly established university tech hub.",
                    budget: 200,
                    points: 20,
                    status: "open",
                    type: "Paid",
                    difficulty: "Easy",
                    deadline: "5 days",
                    creatorId: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f7a8b9c0d1")
                },
                {
                    title: "Data Entry Hub",
                    description: "Sanitize, organize, and transform raw student registration logs into structured relational CSV/JSON document tables.",
                    budget: 100,
                    points: 10,
                    status: "open",
                    type: "Free",
                    difficulty: "Easy",
                    deadline: "1 day",
                    creatorId: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f7a8b9c0d1")
                }
            ];

            await Task.insertMany(dummyTasks);
            console.log("✅ Successfully seeded 3 marketplace tasks into MongoDB!");
        } else {
            console.log(`📊 Verified: Database already contains ${taskCount} task documents.`);
        }
    } catch (error) {
        console.error("❌ Failed to verify or seed database collections:", error);
    }
};

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB!");
        // Safely trigger seeder logic only after connected to the instance
        seedTasksIfEmpty();
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 4. API ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/competitions', require('./routes/competitionRoutes'));
app.use('/api/hubs', require('./routes/hubRoutes'));

// --- 5. SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;

// Binding to '0.0.0.0' allows external devices on your Wi-Fi to discover the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Intervarsity Hub Server running on port ${PORT}`);
    console.log(`📡 Local Network Access: http://10.10.70.54:${PORT}`);
});