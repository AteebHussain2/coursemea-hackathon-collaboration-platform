import dotenv from 'dotenv';
// Load env vars immediately
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors';
import authRoutes from './routes/authRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import searchRoutes from './routes/searchRoutes';

export const app: Express = express();

// Required for Secure cookies behind Vercel's proxy
app.set('trust proxy', 1);

// DB Connection Middleware for Vercel
import { connectDB } from './config/db';
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/search', searchRoutes);

// Default Route
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'API is running smoothly! 🚀' });
});

// Fallback for 404
// app.all('(.*)', (req: Request, res: Response) => {
//     res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
// });
