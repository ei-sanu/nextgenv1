import dotenv from "dotenv";
// Load environment variables immediately at the top
dotenv.config();

import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";
import { connectDB, closeDB } from "./configs/database";
import { setupSocketIO } from "../sockets";
import authRoutes from "./routes/authRoutes";
import scanRoutes from "./routes/scanRoutes";
import reportRoutes from "./routes/reportRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import logger from "./utils/logger";
import "../workers/scanWorker";

const app: Application = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://nextgenova.cyberarcnova.workers.dev",
  ...(process.env.CORS_ORIGINS || "").split(",").map(o => o.trim())
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);

      // Allow if origin is in the allowed list or in development
      if (
        allowedOrigins.includes(origin) || 
        origin.includes("localhost") || 
        origin.includes("127.0.0.1") ||
        process.env.NODE_ENV === "development"
      ) {
        return callback(null, true);
      }

      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error("CORS blocked for origin"));
    },
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", message: "Secure Scanner API is running" });
});

// 404 handler for unknown API routes
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "API Route Not Found" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  // Initialize Socket.io
  await setupSocketIO(server);

  try {
    await connectDB();
    server.listen(Number(PORT), HOST, () => {
      logger.info(
        `[Server] Sentinel Security API active at http://${HOST}:${PORT}`,
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async () => {
  logger.info("[Server] Graceful shutdown initiated...");
  server.close(async () => {
    logger.info("[Server] HTTP server closed");
    await closeDB();
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error("[Server] Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

startServer();
