import dotenv from 'dotenv';
// Load environment variables immediately at the top
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xss from 'xss-clean';
import { connectDB } from './configs/database';
import { setupSocketIO } from '../sockets';
import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/scanRoutes';
import reportRoutes from './routes/reportRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import logger from './utils/logger';
import '../workers/scanWorker';

const app: Application = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Secure Scanner API is running' });
});

// 404 handler for unknown API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initialize Socket.io
setupSocketIO(server);

const PORT = process.env.PORT || 5001;
const HOST = '127.0.0.1';

const startServer = async () => {
  try {
    await connectDB();
    server.listen(Number(PORT), HOST, () => {
      logger.info(`[Server] Sentinel Security API active at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
