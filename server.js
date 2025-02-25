 require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the .env file');
    process.exit(1);
}

console.log('Initializing with API key...');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Root route should serve the chatbot
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot.html'));
});


app.post('/message', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const userMessage = req.body.message;
        
        if (!userMessage) {
            return res.status(400).json({ error: true, response: 'Message is required' });
        }

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();
        
        console.log('Generated response:', text);
        return res.json({ response: text });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: true,
            response: "Server Error: " + error.message 
        });
    }
});

 
app.options('/message', cors());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
 
