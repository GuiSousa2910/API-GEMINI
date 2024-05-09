const express = require('express');
const cors = require('cors');
const serveStatic = require('serve-static');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3000;

const API_KEY = "AIzaSyDK-JGs7x-LesCNeFRixixZuDIqCQH41s8";

const MODEL_NAME = "gemini-1.0-pro";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.5,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}
];

app.use(cors());

app.use(serveStatic(__dirname));

app.get('/generate-text', async (req, res) => {
  const text = req.query.text;
  const chat = model.startChat({ generationConfig, safetySettings });
  const result = await chat.sendMessage(text);
  const response = result.response;
  res.send(response.text());
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});