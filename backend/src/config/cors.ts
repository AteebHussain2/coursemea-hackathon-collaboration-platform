import cors from 'cors';

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-production-url.com'
        : 'http://localhost:5173', // Vite default port
    credentials: true, // Required for HttpOnly cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

export default corsOptions;
