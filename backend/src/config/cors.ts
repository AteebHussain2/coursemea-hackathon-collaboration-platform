import cors from 'cors';

const allowedOrigins = [
    'https://collab-platform-ateeb-hussain.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Required for HttpOnly cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

export default corsOptions;
