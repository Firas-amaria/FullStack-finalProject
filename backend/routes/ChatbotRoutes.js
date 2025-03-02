const express = require("express");
const router = express.Router();
const ChatLog = require("../models/ChatLog");
const Appointment = require("../models/Appointment");
const axios = require("axios");
const { authenticateUser } = require("../middleware/AuthMiddleware");
const NodeCache = require("node-cache");

// Initialize cache with a 10-minute expiration time
const cache = new NodeCache({ stdTTL: 600 });

/**
 * @route POST /api/chatbot/send
 * @desc Processes user messages and provides responses based on appointments or AI-generated answers
 * @access Private (requires authentication)
 */
router.post("/send", authenticateUser, async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase(); // Convert message to lowercase for better matching
    const cacheKey = `chat_${req.user.id}_${userMessage}`; // Generate a unique cache key for this user and message
    const cachedResponse = cache.get(cacheKey); // Check if the response is already in cache

    // If a cached response exists, return it immediately
    if (cachedResponse) {
      return res.json({ botMessage: cachedResponse });
    }

    let botMessage = "";

    // **Check if the user is asking about their appointments**
    if (
      userMessage.includes("התורים שלי") ||
      userMessage.includes("מתי התור הבא")
    ) {
      const appointments = await Appointment.find({ userId: req.user.id }).sort(
        { appointmentDate: 1 }
      );

      // If no appointments are found, notify the user
      if (appointments.length === 0) {
        botMessage = "אין לך תורים כרגע.";
      } else {
        // Format the appointment details
        botMessage =
          "🔹 אלו התורים שלך:\n" +
          appointments
            .map(
              (appt) =>
                `📅 ${appt.appointmentDate.toISOString().split("T")[0]} - ${
                  appt.doctorName
                } (${appt.details})`
            )
            .join("\n");
      }
    }
    // **If no relevant data is found, send the query to DeepSeek AI**
    else {
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a medical chatbot assisting users with appointment inquiries, symptoms, and general health questions. Provide very short, supportive responses (maximum 2 sentences) in Hebrew only. If unsure, respond with 'I am not sure, please consult a doctor for professional advice.'",
            },
            { role: "user", content: userMessage }, // User's message
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
        }
      );

      // Clean the response to remove unnecessary characters
      botMessage = cleanResponse(response.data.choices[0].message.content);
    }

    // Store the generated response in cache
    cache.set(cacheKey, botMessage);

    // **Save the chat conversation in the database**
    await ChatLog.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: {
          messages: { sender: "user", text: userMessage },
          messages: { sender: "bot", text: botMessage },
        },
      },
      { upsert: true, new: true } // Create a new document if one doesn't exist
    );

    res.json({ botMessage });
  } catch (error) {
    console.error("❌ Error in chatbot response:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

/**
 * @desc Cleans the response from unnecessary symbols like ###, -, etc.
 * @param {String} response - The raw response from the AI
 * @returns {String} - Cleaned response
 */
const cleanResponse = (response) => {
  return response
    .replace(/###/g, "") // Remove ###
    .replace(/- /g, "") // Remove "-" at the beginning of a line
    .replace(/\*\*/g, "") // Remove ** formatting
    .trim(); // Trim unnecessary spaces
};

/**
 * @route GET /api/chatbot/history
 * @desc Retrieves the chat history of the authenticated user
 * @access Private (requires authentication)
 */
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const chatHistory = await ChatLog.findOne({ userId: req.user.id });

    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found." });
    }

    res.json(chatHistory);
  } catch (error) {
    console.error("❌ Error retrieving chat history:", error);
    res.status(500).json({ message: "Error retrieving chat history." });
  }
});

module.exports = router;
