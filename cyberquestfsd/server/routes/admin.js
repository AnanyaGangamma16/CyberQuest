const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Progress = require("../models/Progress");

const router = express.Router();

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please log in first" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("name email");
    if (!user || !process.env.ADMIN_EMAIL || user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: "Administrator access is required" });
    }
    req.admin = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

router.get("/overview", requireAdmin, async (req, res) => {
  try {
    const [users, progressRecords] = await Promise.all([
      User.find().select("name email createdAt").sort({ createdAt: -1 }),
      Progress.find().select("completedLessons quizAttempts")
    ]);
    const totalLessonsCompleted = progressRecords.reduce((sum, item) => sum + item.completedLessons.length, 0);
    const totalQuizAttempts = progressRecords.reduce((sum, item) => sum + item.quizAttempts.length, 0);
    res.json({
      totalUsers: users.length,
      totalLessonsCompleted,
      totalQuizAttempts,
      users: users.map((user) => ({ ...user.toObject(), isAdmin: user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() }))
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load administrator overview" });
  }
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ message: "The administrator account cannot be deleted here" });
    }
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Progress.deleteOne({ user: req.params.id })
    ]);
    res.json({ message: "User and saved progress deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete user" });
  }
});

module.exports = router;
