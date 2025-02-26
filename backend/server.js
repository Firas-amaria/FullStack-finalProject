require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// console.log(process.env.PORT);
// console.log(process.env.MONGO_URI);

// console.log(process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/LMS-System";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const UserRoutes = require("./routes/UserRoutes");
app.use("/auth", UserRoutes);

const { authenticateUser } = require("./middleware/AuthMiddleware");

app.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const AppointmentRoutes = require("./routes/AppointmentRoutes");
app.use("/appointment", AppointmentRoutes);
