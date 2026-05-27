const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    competitionId: {
        type: Number, // Matches the ID in your frontend list
        required: true
    },
    competitionTitle: {
        type: String,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Registration', RegistrationSchema);