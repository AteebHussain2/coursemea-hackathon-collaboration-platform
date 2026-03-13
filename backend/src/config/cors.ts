import cors from 'cors';

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://collab-platform-ateeb-hussain.vercel.app'
        : 'http://localhost:5173', // Vite default port
    credentials: true, // Required for HttpOnly cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

export default corsOptions;
