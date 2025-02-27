const express = require("express");
const router = express.Router();
const ChatLog = require("../models/ChatLog");
const axios = require("axios");
const { authenticateUser } = require("../middleware/AuthMiddleware");

/**
 * Send message to chatbot and get response
 */
router.post("/send", authenticateUser, async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const botMessage = response.data.choices[0].message.content;

    // Save chat log
    await ChatLog.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: {
          messages: { sender: "user", text: userMessage },
          messages: { sender: "bot", text: botMessage },
        },
      },
      { upsert: true, new: true }
    );

    res.json({ botMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get chat history
 */
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const chatHistory = await ChatLog.findOne({ userId: req.user.id });
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
