
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in to use the assistant"
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

router.post("/", authenticate, async (req, res) => {
  const message =
    typeof req.body.message === "string"
      ? req.body.message.trim()
      : "";

  if (!message) {
    return res.status(400).json({
      message: "Enter a question or message"
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      message: "Please keep your message under 5,000 characters"
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message: "AI assistant is not configured. Add GEMINI_API_KEY to server .env."
    });
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

console.log("Gemini model currently used:", model);

    const controller = new AbortController();

const timeout = setTimeout(() => {
  controller.abort();
}, 30000);

const response = await fetch(
  signal: controller.signal,
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
  model: model,
  input: message,
  store: false,

  generation_config: {
    thinking_level: "low"
  },
          system_instruction:
            "You are CyberQuest's cybersecurity education assistant. Explain concepts in beginner-friendly language. When reviewing suspicious messages, identify warning signs and safe next steps. Never claim a link is definitely safe or malicious based only on text. Never ask for passwords, OTPs, bank details, or private credentials. Do not provide instructions for hacking, malware deployment, credential theft, or evasion. Keep answers concise and practical."
        })
      }
    );

    const data = await response.json();
    clearTimeout(timeout);

    if (!response.ok) {
      const detail =
        data.error?.message || "Gemini API request failed";

      console.error("Gemini API Error:", detail);

      return res.status(502).json({
        message: detail
      });
    }

    const reply = (data.steps || [])
      .filter(step => step.type === "model_output")
      .flatMap(step => step.content || [])
      .filter(part => part.type === "text")
      .map(part => part.text || "")
      .join("\n")
      .trim();

    if (!reply) {
      return res.status(502).json({
        message: "The assistant did not return a response. Please try again."
      });
    }

    return res.json({ reply });

  } catch (error) {
    console.error("Assistant Error:", error.message);
      if (error.name === "AbortError") {
    return res.status(504).json({
      message: "Gemini is taking too long. Please try again."
    });
  }

    return res.status(500).json({
      message: "Could not contact the AI assistant"
    });
  }
});

module.exports = router;
