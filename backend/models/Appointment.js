const mongoose = require('mongoose');

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
