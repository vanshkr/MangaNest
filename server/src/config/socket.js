import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { UserRepository } from '../models/User.js';
import { registerRoomHandlers } from '../sockets/roomHandlers.js';

/**
 * Initialize Socket.IO server with configuration
 * @param {Object} httpServer - HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Connection timeout
    connectTimeout: 10000,
    // Ping timeout
    pingTimeout: 5000,
    // Ping interval
    pingInterval: 25000,
  });

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      // Get token from handshake auth or query
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Verify token
      const decoded = verifyAccessToken(token);

      // Get user from database
      const user = await UserRepository.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user to socket
      socket.user = user;
      socket.userId = user.id;

      console.log(`✅ Socket authenticated: ${user.username} (${socket.id})`);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      return next(new Error('Invalid or expired token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);

    // Register room event handlers
    registerRoomHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${socket.user.username} (${socket.id}) - Reason: ${reason}`);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.user.username}:`, error);
    });
  });

  return io;
};

/**
 * Get Socket.IO instance
 * (Will be set by the main server after initialization)
 */
let ioInstance = null;

export const setSocketInstance = (io) => {
  ioInstance = io;
};

export const getSocketInstance = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO has not been initialized yet');
  }
  return ioInstance;
};
