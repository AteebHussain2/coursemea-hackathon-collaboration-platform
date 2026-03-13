import { app } from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coursemea_hackathon';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express Server only if not in Vercel
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
