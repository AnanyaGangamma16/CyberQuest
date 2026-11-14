
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");
const adminRoutes = require("./routes/admin");
const assistantRoutes = require("./routes/assistant");

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assistant", assistantRoutes);

// Test backend
app.get("/", (req, res) => {
  res.send("CyberQuest Backend is Running!");
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CyberQuest server is running"
  });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl
  });
});

// Start server independently of MongoDB
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CyberQuest server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  })
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
  });
