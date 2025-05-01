require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Gemini API call function
const callGeminiAPI = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const data = {
    contents: [
      {
        parts: [{ text: userMessage }],
        role: "user"
      }
    ]
  };

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );

  const text = await response.text();

  try {
    const result = JSON.parse(text);

    console.log("Gemini API response:", JSON.stringify(result, null, 2));

    if (!result || !result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    return result.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Raw response from Gemini (not JSON):", text);
    throw new Error("Failed to parse Gemini API response");
  }
};



// API endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const reply = await callGeminiAPI(message);
    res.json({ reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: 'Error fetching response from Gemini',
      details: error.message
    });
  }
});

// Fallback route for React app (MUST BE LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
