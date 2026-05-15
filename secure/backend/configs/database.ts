import mongoose from "mongoose";
import logger from "../utils/logger";

/**
 * MongoDB Atlas Connection Configuration
 * Optimized for production use and Atlas Free Tier
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    logger.error("[MongoDB] MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  const dbOptions: mongoose.ConnectOptions = {
    autoIndex: true, // Build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  };

  try {
    mongoose.set("bufferCommands", false);
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(mongoURI, dbOptions);

    logger.info(`[MongoDB] Connected to Atlas: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error(`[MongoDB] Connection Error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("[MongoDB] Disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("[MongoDB] Reconnected successfully");
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[MongoDB] Initial Connection Error: ${message}`);
    
    // Retry logic for initial connection
    logger.info("[MongoDB] Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

/**
 * Graceful shutdown of MongoDB connection
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info("[MongoDB] Connection closed through app termination");
  } catch (err) {
    logger.error(`[MongoDB] Error during connection close: ${err}`);
  }
};
