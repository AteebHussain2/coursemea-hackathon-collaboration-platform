import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors';
import authRoutes from './routes/authRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import userRoutes from './routes/userRoutes';

// Load env vars
dotenv.config();

export const app: Express = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/users', userRoutes);

// Default Route
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'API is running smoothly! 🚀' });
});

// Fallback for 404
// app.all('(.*)', (req: Request, res: Response) => {
//     res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
// });
