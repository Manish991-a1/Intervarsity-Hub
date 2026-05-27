const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6 // Good practice for security
  },
  university: { 
    type: String, 
    required: [true, 'University/Hub identifier is required'], 
    trim: true,
    index: true // Crucial for multi-tenant "Hub" logic
  },
  semester: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 12 // Adjust based on common degree lengths
  },
  role: { 
    type: String, 
    enum: ['student', 'admin', 'moderator'], 
    default: 'student' 
  },
  points: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index if you plan to search users by semester within a specific university
UserSchema.index({ university: 1, semester: 1 });

module.exports = mongoose.model('User', UserSchema);