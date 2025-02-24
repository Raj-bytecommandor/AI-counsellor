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

// Initialize Gemini with proper configuration
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
    },
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot.html'));
});

app.post('/message', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log('Processing message:', userMessage);

        if (!userMessage) {
            throw new Error('Empty message received');
        }

        // Generate the chat response
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();
        
        console.log('Generated response:', text);
        res.json({ response: text });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            response: "Server Error: " + (error.message || "Unknown error occurred"),
            error: true
        });
    }
});

// Add a test endpoint
app.get('/test', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
