const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { authenticateUser } = require("../middleware/AuthMiddleware");

/**
 * Get all appointments assigned to the doctor
 */
router.get("/appointments", authenticateUser, async (req, res) => {
  try {
    const doctorName = req.user.name; // Extract the logged-in doctor's name

    if (!doctorName) {
      console.log("Error: Doctor name not found in token!"); // DEBUG PRINT
      return res.status(400).json({ message: "Doctor name missing in token" });
    }
    // Fetch appointments assigned to this doctor
    const appointments = await Appointment.find({ doctorName }).populate(
      "userId",
      "name email"
    );

    if (appointments.length === 0) {
      console.log("No appointments found for this doctor."); // DEBUG PRINT
    }

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error); // DEBUG PRINT
    res.status(500).json({ message: error.message });
  }
});

/**
 * Mark an appointment as completed
 */
router.put("/appointment/:id/complete", authenticateUser, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment completed.", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Cancel an appointment
 */
router.put("/appointment/:id/cancel", authenticateUser, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "canceled" },
      { new: true }
    );

    res.json({ message: "Appointment canceled.", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
