const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { authenticateUser } = require("../middleware/AuthMiddleware");


/**
 * Create an appointment (Admin can create for patients)
 */
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { userId, doctorName, specialty, appointmentDate } = req.body;
    console.log(
      `Appointments: ${userId}, ${doctorName}, ${specialty}, ${appointmentDate}`
    );
    // Validate required fields
    if (!userId || !doctorName || !specialty || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      userId, // Admin provides the userId
      doctorName,
      specialty,
      appointmentDate,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all appointments for the logged-in user
 */
router.get("/", authenticateUser, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({
      appointmentDate: 1,
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Cancel an appointment
 */
router.put("/cancel/:id", authenticateUser, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "canceled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment canceled successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
