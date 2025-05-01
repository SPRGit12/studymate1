// Import required modules
const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// API key
const GEMINI_API_KEY = 'AIzaSyAqN-wdv8FEuIafnHfSJES4uR3f49yqA-M';

// Use Node.js built-in HTTPS module instead of axios/fetch to avoid URL parsing issues
function callGeminiAPI(message) {
  return new Promise((resolve, reject) => {
    // Prepare the request data
    const systemPrompt = "You are a helpful learning assistant. Provide concise, accurate information to help students understand concepts. If you're explaining code or technical topics, try to include examples when appropriate.";
    
    const requestData = JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: message }
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    // Set up the request options
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    // Make the request
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.candidates && parsedData.candidates[0] && 
              parsedData.candidates[0].content && parsedData.candidates[0].content.parts) {
            resolve(parsedData.candidates[0].content.parts[0].text);
          } else {
            reject(new Error('Invalid response format from Gemini API'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // Write data to request body
    req.write(requestData);
    req.end();
  });
}

// Chat endpoint
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

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});