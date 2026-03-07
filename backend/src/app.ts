import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

export const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'API is running smoothly! 🚀' });
});

// Fallback for 404
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});
