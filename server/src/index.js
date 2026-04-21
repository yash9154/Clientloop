import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import noteRoutes from './routes/notes.js';
import updateRoutes from './routes/updates.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// MIDDLEWARE
// ====================

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====================
// ROUTES
// ====================

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/updates', updateRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'ClientLoop API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use(errorHandler);

// ====================
// START SERVER
// ====================

const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 ClientLoop API running on port ${PORT}`);
            console.log(`📍 Health: http://localhost:${PORT}/api/health\n`);
        });

        process.on('SIGTERM', () => {
            server.close(() => process.exit(0));
        });

        process.on('SIGINT', () => {
            server.close(() => process.exit(0));
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();