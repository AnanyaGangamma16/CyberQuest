
const express = require("express");
const jwt = require("jsonwebtoken");
const Progress = require("../models/Progress");

const router = express.Router();

// Verify logged-in user
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please log in first"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

// Get user's progress
router.get("/", authenticateToken, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.userId
    });

    res.json(progress || {
      completedLessons: [],
      quizAttempts: []
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not retrieve progress"
    });
  }
});

// Mark lesson as completed
router.post("/lesson", authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.body;

    if (!lessonId || typeof lessonId !== "string") {
      return res.status(400).json({
        message: "Valid lesson ID is required"
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.userId },
      { $addToSet: { completedLessons: lessonId } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: "Lesson progress saved",
      progress
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not save lesson progress"
    });
  }
});

// Save quiz score
router.post("/quiz", authenticateToken, async (req, res) => {
  try {
    const { score, totalQuestions } = req.body;

    if (
      !Number.isInteger(score) ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1 ||
      score < 0 ||
      score > totalQuestions
    ) {
      return res.status(400).json({
        message: "Invalid quiz score"
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.userId },
      {
        $push: {
          quizAttempts: { score, totalQuestions }
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: "Quiz score saved",
      progress
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not save quiz score"
    });
  }
});

module.exports = router;
