const mongoose = require('mongoose');

// Define ChatLog Schema
const chatLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            sender: { type: String, enum: ['user', 'bot'], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    recommendations: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ChatLog', chatLogSchema);
