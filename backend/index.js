import express from 'express';
import cors from 'cors';
import router from './routes/url.routes.js';
import mongoose from 'mongoose';
import connectDB from './database/connectDB.js';
import { handleRedirectUrl,handleCustomShortUrl } from './controllers/url.controller.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

connectDB()
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend origin
  credentials: true               // allow cookies if you're using them
}));

app.use('/url', router);
app.post('/custom-url', handleCustomShortUrl)
app.get('/:shortId',handleRedirectUrl)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));;
