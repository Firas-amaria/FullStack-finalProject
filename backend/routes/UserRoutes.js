const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../middleware/AuthMiddleware");

/**
 * Register a new user
 */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Logging in User:", user); // DEBUG PRINT

    // Fix: Ensure `name` is included in the token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name, // Include name
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
