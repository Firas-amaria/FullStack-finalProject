const express = require('express');
const { connectDB } = require('./config/config'); // Load database & environment config
const dotenv = require('dotenv');
const path = require('path');
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());


// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));
// Redirect root URL to index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// Import API routes (✅ FIXED PATHS)
const userRoutes = require('./routes/UserRoutes');
const appointmentRoutes = require('./routes/AppointmentRoutes');
const chatbotRoutes = require('./routes/ChatbotRoutes');
const adminRoutes = require("./routes/adminRoutes");
const DoctorRoutes = require("./routes/DoctorRoutes");


// Use API routes
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/chat', chatbotRoutes);
app.use("/admin", adminRoutes);
app.use("/doctor", DoctorRoutes);


// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});



