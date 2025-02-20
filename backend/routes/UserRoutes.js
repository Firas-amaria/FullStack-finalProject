const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../middleware/AuthMiddleware');

/**
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = new User({ name, email, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Login user
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get user details (protected route)
 */
router.get('/me', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
