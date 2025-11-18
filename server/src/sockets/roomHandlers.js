import { RoomService } from '../services/roomService.js';
import { RoomParticipantRepository } from '../models/RoomParticipant.js';

/**
 * Register room-related Socket.IO event handlers
 * @param {Server} io - Socket.IO server instance
 * @param {Socket} socket - Socket instance
 */
export const registerRoomHandlers = (io, socket) => {
  const userId = socket.userId;
  const username = socket.user.username;

  console.log(`📡 Registering room handlers for ${username} (${socket.id})`);

  /**
   * Join a room (Socket.IO room)
   * Client must first join via REST API, this just connects socket to room
   */
  socket.on('room:join', async ({ roomId }, callback) => {
    try {
      // Verify user is actually in the room
      const isInRoom = await RoomParticipantRepository.isUserInRoom(roomId, userId);

      if (!isInRoom) {
        callback({
          success: false,
          message: 'You must join the room via API first',
        });
        return;
      }

      // Join Socket.IO room
      socket.join(roomId);
      console.log(`✅ ${username} joined Socket.IO room: ${roomId}`);

      // Update last_seen
      await RoomParticipantRepository.updateLastSeen(roomId, userId);

      // Get room details
      const room = await RoomService.getRoomWithParticipants(roomId);

      // Notify others in the room
      socket.to(roomId).emit('participant:entered', {
        userId,
        username,
        avatarUrl: socket.user.avatar_url,
      });

      callback({
        success: true,
        data: room,
      });
    } catch (error) {
      console.error('Error in room:join:', error);
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  /**
   * Leave a room (Socket.IO room)
   */
  socket.on('room:leave', ({ roomId }) => {
    socket.leave(roomId);
    console.log(`👋 ${username} left Socket.IO room: ${roomId}`);

    // Notify others
    socket.to(roomId).emit('participant:exited', {
      userId,
      username,
    });
  });

  /**
   * Update current page (real-time sync)
   */
  socket.on('page:change', async ({ roomId, page }, callback) => {
    try {
      // Service will handle permission checks
      const room = await RoomService.updateCurrentPage(roomId, userId, page);

      // Socket event already emitted by service
      callback({
        success: true,
        data: { currentPage: room.current_page },
      });
    } catch (error) {
      console.error('Error in page:change:', error);
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  /**
   * Send chat message
   */
  socket.on('message:send', async ({ roomId, content, messageType }, callback) => {
    try {
      const message = await RoomService.sendMessage(
        roomId,
        userId,
        content,
        messageType || 'text'
      );

      // Socket event already emitted by service with user info
      callback({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error('Error in message:send:', error);
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  /**
   * Send emoji reaction (ephemeral, not stored)
   */
  socket.on('reaction:send', async ({ roomId, emoji }, callback) => {
    try {
      // Verify user is in room
      const isInRoom = await RoomParticipantRepository.isUserInRoom(roomId, userId);

      if (!isInRoom) {
        callback({
          success: false,
          message: 'You are not in this room',
        });
        return;
      }

      // Broadcast emoji reaction to all in room (including sender for animation)
      io.to(roomId).emit('reaction:received', {
        userId,
        username,
        emoji,
        timestamp: new Date(),
      });

      callback({ success: true });
    } catch (error) {
      console.error('Error in reaction:send:', error);
      callback({
        success: false,
        message: error.message,
      });
    }
  });

  /**
   * Update typing status
   */
  socket.on('typing:start', async ({ roomId }) => {
    try {
      // Verify user is in room
      const isInRoom = await RoomParticipantRepository.isUserInRoom(roomId, userId);

      if (!isInRoom) return;

      // Notify others (not self)
      socket.to(roomId).emit('user:typing', {
        userId,
        username,
      });
    } catch (error) {
      console.error('Error in typing:start:', error);
    }
  });

  socket.on('typing:stop', async ({ roomId }) => {
    try {
      socket.to(roomId).emit('user:stopped-typing', {
        userId,
      });
    } catch (error) {
      console.error('Error in typing:stop:', error);
    }
  });

  /**
   * Update presence (active status)
   */
  socket.on('presence:update', async ({ roomId }) => {
    try {
      await RoomParticipantRepository.updateLastSeen(roomId, userId);

      // Notify others of active presence
      socket.to(roomId).emit('user:active', {
        userId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error in presence:update:', error);
    }
  });

  /**
   * Handle disconnection
   */
  socket.on('disconnect', async () => {
    console.log(`🔌 ${username} disconnected (${socket.id})`);

    // Find all rooms this socket was in and notify participants
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);

    for (const roomId of rooms) {
      socket.to(roomId).emit('participant:disconnected', {
        userId,
        username,
      });
    }
  });

  /**
   * Ping/pong for connection monitoring
   */
  socket.on('ping', ({ roomId }, callback) => {
    callback({ pong: true, timestamp: Date.now() });
  });
};
