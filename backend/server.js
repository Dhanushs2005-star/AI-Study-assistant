const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    status: "healthy",
    message: "StudyAI Backend API is running smoothly!",
    database: {
      status: dbStatus,
      databaseName: mongoose.connection.name || "studyai",
      host: mongoose.connection.host || "127.0.0.1",
    },
    timestamp: new Date().toISOString(),
  });
});

// Root welcome endpoint
app.get("/", (req, res) => {
  res.send("StudyAI API Server is active. Open MongoDB Compass to view database collections.");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 StudyAI Server running on http://localhost:${PORT}`);
  console.log(`📡 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🗄️  MongoDB Compass Connection String: mongodb://127.0.0.1:27017/studyai`);
  console.log(`======================================================\n`);
});
