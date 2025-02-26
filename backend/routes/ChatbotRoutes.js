const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');
const Appointment = require('../models/Appointment'); // Import Appointment model
const axios = require('axios');
const { authenticateUser } = require('../middleware/AuthMiddleware');

/**
 * @route POST /api/chatbot/send
 * @desc Handle user messages and respond with appointment data or AI-generated answers
 * @access Private (requires authentication)
 */
router.post('/send', authenticateUser, async (req, res) => {
    try {
        const userMessage = req.body.message.toLowerCase();
        let botMessage = '';

        // **Check if the user is asking about their appointments**
        if (userMessage.includes('התורים שלי') || userMessage.includes('מתי התור הבא')) {
            const appointments = await Appointment.find({ userId: req.user.id }).sort({ appointmentDate: 1 });

            if (appointments.length === 0) {
                botMessage = 'אין לך תורים כרגע.';
            } else {
                botMessage = 'אלו התורים שלך:\n' +
                    appointments.map(appt =>
                        `📅 ${appt.appointmentDate.toISOString().split('T')[0]} - ${appt.doctorName} (${appt.specialty})`
                    ).join('\n');
            }
        }
        // **Check if the user is asking about a medical condition**
        else if (userMessage.includes('כאב ראש') || userMessage.includes('חום גבוה')) {
            botMessage = await getMedicalAdvice(userMessage);
        }
        // **If no relevant data is found, send the query to DeepSeek AI**
        else {
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: userMessage }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
                    }
                }
            );

            botMessage = response.data.choices[0].message.content;
        }

        // **Save the chat conversation in the database**
        await ChatLog.findOneAndUpdate(
            { userId: req.user.id },
            { $push: { messages: { sender: 'user', text: userMessage }, messages: { sender: 'bot', text: botMessage } } },
            { upsert: true, new: true }
        );

        res.json({ botMessage });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc Provides predefined medical advice based on detected symptoms
 * @param {String} symptoms - User's input message
 * @returns {String} - Advice or a default response
 */
const getMedicalAdvice = async (symptoms) => {
    const medicalResponses = {
        'כאב ראש': 'אם יש לך כאב ראש קל, נסה לשתות מים ולנוח. אם הכאב נמשך, מומלץ להיוועץ ברופא.',
        'חום גבוה': 'אם החום עולה מעל 38.5°C למשך יותר מיום, מומלץ לקחת אקמול ולפנות לרופא.',
        'לחץ דם גבוה': 'במצב של לחץ דם גבוה, מומלץ לבדוק את לחץ הדם ולהימנע ממלח. יש לפנות לרופא להמשך בירור.',
    };

    for (let key in medicalResponses) {
        if (symptoms.includes(key)) {
            return medicalResponses[key];
        }
    }
    return "לא הצלחתי למצוא מידע רפואי מתאים, פנה לרופא.";
};

/**
 * @route GET /api/chatbot/history
 * @desc Retrieve the chat history of the authenticated user
 * @access Private (requires authentication)
 */
router.get('/history', authenticateUser, async (req, res) => {
    try {
        const chatHistory = await ChatLog.findOne({ userId: req.user.id });
        res.json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
