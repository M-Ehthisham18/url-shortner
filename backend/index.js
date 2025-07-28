import express from 'express';
import cors from 'cors';
import connectDB from './database/connectDB.js';
import { handleRedirectUrl,handleCustomShortUrl,handleUrlAnalytics,generateNewShortUrl } from './controllers/url.controller.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

connectDB();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, // allow your frontend origin
  credentials: true               // allow cookies if you're using them
}));


app.post('/url', generateNewShortUrl)
app.post('/custom-url', handleCustomShortUrl)
app.get('/:shortId',handleRedirectUrl)
app.get('/:shortId/analytics',handleUrlAnalytics)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));;
