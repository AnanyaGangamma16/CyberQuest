
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    completedLessons: {
      type: [String],
      default: []
    },

    quizAttempts: [
      {
        score: {
          type: Number,
          required: true
        },
        totalQuestions: {
          type: Number,
          required: true
        },
        attemptedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

progressSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
