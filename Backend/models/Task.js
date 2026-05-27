const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    points: { 
        type: Number, 
        required: true 
    },
    budget: { 
        type: Number, 
        required: true 
    },
    creatorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    status: { 
        type: String, 
        enum: ['open', 'in-progress', 'completed'], 
        default: 'open' 
    },
    applicants: [
        { 
            userId: { type: String }, 
            appliedAt: { type: Date, default: Date.now } 
        }
    ],
    startedAt: { 
        type: Date 
    },
    completedAt: { 
        type: Date 
    }
}, { 
    timestamps: true // Automatically tracks createdAt and updatedAt lifecycle actions
});

module.exports = mongoose.model('Task', TaskSchema);