require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Verify API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the .env file');
    process.exit(1);
}

// Initialize the model with gemini-2.0-flash
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
        temperature: 0.7,
        topK: 1,
        maxOutputTokens: 2048,
    }
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.post('/message', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        if (!message) {
            throw new Error('Empty message received');
        }

        // Generate response with proper error handling
        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            const text = response.text();
            
            console.log('Generated response:', text);
            res.json({ response: text });
        } catch (genAIError) {
            console.error('Gemini API Error:', genAIError);
            throw new Error('Failed to generate response from AI model');
        }

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: true, 
            response: error.message 
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('API Key:', GEMINI_API_KEY.substring(0, 5) + '...');
}); 
