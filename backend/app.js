const express = require('express');
const { connectDB } = require('./config/config'); // Load database & environment config
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();


// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Import API routes (✅ FIXED PATHS)
const userRoutes = require('./routes/UserRoutes');
const appointmentRoutes = require('./routes/AppointmentRoutes');
const chatbotRoutes = require('./routes/ChatbotRoutes');

// Use API routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
