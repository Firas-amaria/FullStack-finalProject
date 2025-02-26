const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 *  Get All Users (Admin Only)
 */
router.get(
  "/users",
  authenticateUser,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find().select("name email role createdAt");
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

/**
 *  Get All courses (Admin Only)
 */
// router.get(
//   "/courses",
//   authenticateUser,
//   authorizeRole(["admin"]),
//   async (req, res) => {
//     try {
//       const courses = await Course.find().populate(
//         "instructorId",
//         "username email"
//       ); // Fetch instructor details
//       res.json(courses);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       res.status(500).json({ error: "Failed to fetch courses" });
//     }
//   }
// );

/**
 *  Delete a User (Admin Only)
 */
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

router.patch(
  "/users/:id/role",
  authenticateUser,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!["user", "doctor"].includes(role)) {
        return res.status(400).json({ error: "Invalid role provided" });
      }

      // Update role
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: `User role updated to ${role}`, user });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
);

module.exports = router;
