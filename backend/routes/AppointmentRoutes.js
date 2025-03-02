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

    if (!userId || !doctorName || !specialty || !appointmentDate) {
      console.log("Missing required fields"); // DEBUG PRINT
      return res.status(400).json({ message: "All fields are required." });
    }

    const appointment = await Appointment.create({
      userId,
      doctorName,
      specialty,
      appointmentDate,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error); // DEBUG PRINT
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
