import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'API Key not configured' });
    }

    try {
      console.log('Attempting to use Gemini API with model: gemini-1.5-flash-latest');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const result = await model.generateContent(message);
      const text = result.response.text();
      console.log('Success! Got response from Gemini');
      return res.status(200).json({ reply: text });
    } catch (error: any) {
      console.warn('Primary model (gemini-1.5-flash-latest) failed. Trying alternative model.', error);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(message);
      const text = result.response.text();
      console.log('Success with alternative model (gemini-pro)!');
      return res.status(200).json({ reply: text });
    }
  } catch (error: any) {
    console.error('Full Gemini Error (including fallback):', error);
    return res.status(500).json({ error: error.message || 'Failed to get AI response after trying all models' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
