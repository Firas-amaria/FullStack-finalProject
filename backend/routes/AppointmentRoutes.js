const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { authenticateUser } = require("../middleware/authMiddleware");


/**
 * Schedule an appointment
 */
router.post("/schedule", authenticateUser, async (req, res) => {
  try {
    const { doctorName, specialty, appointmentDate } = req.body;
    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorName,
      specialty,
      appointmentDate,
    });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all appointments for a user
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
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
