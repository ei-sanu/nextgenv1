import { Server, Socket } from "socket.io";
import http from "http";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import logger from "../backend/utils/logger";

let io: Server;

export const setupSocketIO = async (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Optimize for 5k+ users:
    transports: ["websocket"], // Force WebSockets only, skip HTTP polling
    allowUpgrades: false,
    pingInterval: 25000, // Heartbeat optimization
    pingTimeout: 60000,
    maxHttpBufferSize: 1e6, // 1 MB payload limit
  });

  // Setup Redis Adapter for multi-core scaling (PM2 clustering)
  try {
    const pubClient = createClient({
      url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || "6379"}`
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    logger.info("[Socket.IO] Redis adapter connected and configured.");
  } catch (err) {
    logger.warn("[Socket.IO] Redis adapter failed to connect. Falling back to memory adapter. " + err);
  }

  io.on("connection", (socket: Socket) => {
    logger.info(`[Socket.IO] Client connected: ${socket.id}`);

    // Room cleanup and listener optimization happens automatically on disconnect
    socket.on("disconnect", (reason) => {
      logger.info(`[Socket.IO] Client disconnected: ${socket.id} - Reason: ${reason}`);
    });
    
    socket.on("error", (err) => {
      logger.error(`[Socket.IO] Socket error (${socket.id}): ${err.message}`);
    });
  });

  return io;
};

export const emitEvent = (eventName: string, payload: any) => {
  if (io) {
    io.emit(eventName, payload);
  }
};
