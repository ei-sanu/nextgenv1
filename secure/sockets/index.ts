import { Server, Socket } from 'socket.io';
import http from 'http';

let io: Server;

export const setupSocketIO = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, restrict to frontend dashboard URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const emitEvent = (eventName: string, payload: any) => {
  if (io) {
    io.emit(eventName, payload);
  }
};
