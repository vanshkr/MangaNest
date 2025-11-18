import { RoomRepository } from '../models/Room.js';
import { RoomParticipantRepository } from '../models/RoomParticipant.js';
import { RoomMessageRepository } from '../models/RoomMessage.js';
import { getSocketInstance } from '../config/socket.js';

/**
 * RoomService - Business logic for room operations
 */
export class RoomService {
  /**
   * Create a new room
   * @param {string} userId - Host user ID
   * @param {Object} roomData - Room configuration
   * @returns {Promise<Object>} Created room with invite code
   */
  static async createRoom(userId, roomData) {
    const { mangaId, chapterId, maxParticipants, isPublic, syncMode, allowChat } = roomData;

    // Validate required fields
    if (!mangaId || !chapterId) {
      throw new Error('Manga ID and Chapter ID are required');
    }

    // Create the room
    const room = await RoomRepository.create({
      hostUserId: userId,
      mangaId,
      chapterId,
      currentPage: 1,
      maxParticipants: maxParticipants || 10,
      isPublic: isPublic !== undefined ? isPublic : true,
      syncMode: syncMode || 'host-controlled',
      allowChat: allowChat !== undefined ? allowChat : true,
    });

    // Add host as first participant
    await RoomParticipantRepository.create(room.id, userId, true);

    return {
      ...room,
      participant_count: 1,
    };
  }

  /**
   * Join a room
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Room with participant info
   */
  static async joinRoom(roomId, userId) {
    // Check if room exists and is active
    const room = await RoomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    if (!room.is_active) {
      throw new Error('Room is no longer active');
    }

    // Check if room is full
    const isFull = await RoomRepository.isFull(roomId);
    if (isFull) {
      throw new Error('Room is full');
    }

    // Check if user is already in room
    const isAlreadyIn = await RoomParticipantRepository.isUserInRoom(roomId, userId);
    if (isAlreadyIn) {
      // Update last_seen
      await RoomParticipantRepository.updateLastSeen(roomId, userId);
      return await this.getRoomWithParticipants(roomId);
    }

    // Add user as participant
    await RoomParticipantRepository.create(roomId, userId, false);

    // Get updated room info
    const roomWithParticipants = await this.getRoomWithParticipants(roomId);

    // Emit socket event to notify other participants
    try {
      const io = getSocketInstance();
      io.to(roomId).emit('user:joined', {
        roomId,
        userId,
        participantCount: roomWithParticipants.participant_count,
      });
    } catch (error) {
      console.error('Failed to emit user:joined event:', error);
    }

    return roomWithParticipants;
  }

  /**
   * Join room by invite code
   * @param {string} inviteCode - Invite code
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Room with participant info
   */
  static async joinByInviteCode(inviteCode, userId) {
    const room = await RoomRepository.findByInviteCode(inviteCode);
    if (!room) {
      throw new Error('Invalid or expired invite code');
    }

    return await this.joinRoom(room.id, userId);
  }

  /**
   * Leave a room
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Result
   */
  static async leaveRoom(roomId, userId) {
    // Check if user is in room
    const isInRoom = await RoomParticipantRepository.isUserInRoom(roomId, userId);
    if (!isInRoom) {
      throw new Error('User is not in this room');
    }

    // Check if user is host
    const isHost = await RoomParticipantRepository.isUserHost(roomId, userId);

    // Remove participant
    await RoomParticipantRepository.deactivate(roomId, userId);

    // If host is leaving, handle host transfer or close room
    if (isHost) {
      const participants = await RoomParticipantRepository.findByRoomId(roomId);

      if (participants.length > 0) {
        // Transfer host to next participant
        const newHost = participants[0];
        await RoomParticipantRepository.transferHost(roomId, userId, newHost.user_id);

        // Emit socket event
        try {
          const io = getSocketInstance();
          io.to(roomId).emit('host:transferred', {
            roomId,
            newHostId: newHost.user_id,
            newHostUsername: newHost.username,
          });
        } catch (error) {
          console.error('Failed to emit host:transferred event:', error);
        }
      } else {
        // No participants left, close room
        await RoomRepository.deactivate(roomId);
      }
    }

    // Emit socket event
    try {
      const io = getSocketInstance();
      const remainingCount = await RoomParticipantRepository.getCount(roomId);
      io.to(roomId).emit('user:left', {
        roomId,
        userId,
        participantCount: remainingCount,
      });
    } catch (error) {
      console.error('Failed to emit user:left event:', error);
    }

    return { success: true, wasHost: isHost };
  }

  /**
   * Kick a participant from room (host only)
   * @param {string} roomId - Room UUID
   * @param {string} hostId - Host user ID
   * @param {string} targetUserId - User to kick
   * @returns {Promise<Object>} Result
   */
  static async kickParticipant(roomId, hostId, targetUserId) {
    // Verify host
    const isHost = await RoomParticipantRepository.isUserHost(roomId, hostId);
    if (!isHost) {
      throw new Error('Only the host can kick participants');
    }

    // Cannot kick yourself
    if (hostId === targetUserId) {
      throw new Error('Host cannot kick themselves');
    }

    // Remove participant
    await RoomParticipantRepository.deactivate(roomId, targetUserId);

    // Emit socket event
    try {
      const io = getSocketInstance();
      io.to(roomId).emit('user:kicked', {
        roomId,
        userId: targetUserId,
      });
    } catch (error) {
      console.error('Failed to emit user:kicked event:', error);
    }

    return { success: true };
  }

  /**
   * Update room settings (host only)
   * @param {string} roomId - Room UUID
   * @param {string} userId - User ID (must be host)
   * @param {Object} updates - Settings to update
   * @returns {Promise<Object>} Updated room
   */
  static async updateRoomSettings(roomId, userId, updates) {
    // Verify host
    const isHost = await RoomParticipantRepository.isUserHost(roomId, userId);
    if (!isHost) {
      throw new Error('Only the host can update room settings');
    }

    const updatedRoom = await RoomRepository.update(roomId, updates);

    // Emit socket event
    try {
      const io = getSocketInstance();
      io.to(roomId).emit('room:updated', {
        roomId,
        settings: updates,
      });
    } catch (error) {
      console.error('Failed to emit room:updated event:', error);
    }

    return updatedRoom;
  }

  /**
   * Update current page (respects sync mode)
   * @param {string} roomId - Room UUID
   * @param {string} userId - User ID
   * @param {number} page - New page number
   * @returns {Promise<Object>} Updated room
   */
  static async updateCurrentPage(roomId, userId, page) {
    const room = await RoomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Check sync mode permissions
    if (room.sync_mode === 'host-controlled') {
      const isHost = await RoomParticipantRepository.isUserHost(roomId, userId);
      if (!isHost) {
        throw new Error('Only the host can change pages in host-controlled mode');
      }
    } else {
      // anyone-can-control mode - just verify user is in room
      const isInRoom = await RoomParticipantRepository.isUserInRoom(roomId, userId);
      if (!isInRoom) {
        throw new Error('User is not in this room');
      }
    }

    const updatedRoom = await RoomRepository.updateCurrentPage(roomId, page);

    // Emit socket event for real-time sync
    try {
      const io = getSocketInstance();
      io.to(roomId).emit('page:changed', {
        roomId,
        page,
        userId,
      });
    } catch (error) {
      console.error('Failed to emit page:changed event:', error);
    }

    return updatedRoom;
  }

  /**
   * Get room details with participants
   * @param {string} roomId - Room UUID
   * @returns {Promise<Object>} Room with participants
   */
  static async getRoomWithParticipants(roomId) {
    const room = await RoomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const participants = await RoomParticipantRepository.findByRoomId(roomId);
    const participantCount = participants.length;

    return {
      ...room,
      participants,
      participant_count: participantCount,
    };
  }

  /**
   * Get public rooms list
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Array>} List of public rooms
   */
  static async getPublicRooms(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await RoomRepository.findPublicRooms(limit, offset);
  }

  /**
   * Get user's rooms (as host or participant)
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Hosted and joined rooms
   */
  static async getUserRooms(userId) {
    const hostedRooms = await RoomRepository.findByHostUserId(userId);
    const joinedRooms = await RoomRepository.findByParticipantUserId(userId);

    return {
      hosted: hostedRooms,
      joined: joinedRooms,
    };
  }

  /**
   * Close a room (host only)
   * @param {string} roomId - Room UUID
   * @param {string} userId - User ID (must be host)
   * @returns {Promise<Object>} Result
   */
  static async closeRoom(roomId, userId) {
    // Verify host
    const isHost = await RoomParticipantRepository.isUserHost(roomId, userId);
    if (!isHost) {
      throw new Error('Only the host can close the room');
    }

    // Deactivate all participants
    await RoomParticipantRepository.deactivateAll(roomId);

    // Deactivate room
    await RoomRepository.deactivate(roomId);

    // Emit socket event
    try {
      const io = getSocketInstance();
      io.to(roomId).emit('room:closed', {
        roomId,
      });
    } catch (error) {
      console.error('Failed to emit room:closed event:', error);
    }

    return { success: true };
  }

  /**
   * Send a chat message
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @param {string} content - Message content
   * @param {string} messageType - Message type (text, emoji, system)
   * @returns {Promise<Object>} Created message
   */
  static async sendMessage(roomId, userId, content, messageType = 'text') {
    // Verify user is in room
    const isInRoom = await RoomParticipantRepository.isUserInRoom(roomId, userId);
    if (!isInRoom) {
      throw new Error('User is not in this room');
    }

    // Check if chat is allowed
    const room = await RoomRepository.findById(roomId);
    if (!room.allow_chat) {
      throw new Error('Chat is disabled in this room');
    }

    // Create message
    const message = await RoomMessageRepository.create({
      roomId,
      userId,
      content,
      messageType,
    });

    // Emit socket event
    try {
      const io = getSocketInstance();
      const participant = await RoomParticipantRepository.findByRoomAndUser(roomId, userId);
      io.to(roomId).emit('message:new', {
        ...message,
        username: participant.username,
        avatar_url: participant.avatar_url,
      });
    } catch (error) {
      console.error('Failed to emit message:new event:', error);
    }

    return message;
  }

  /**
   * Get room chat history
   * @param {string} roomId - Room UUID
   * @param {number} limit - Max messages
   * @param {number} offset - Pagination offset
   * @returns {Promise<Array>} Message history
   */
  static async getRoomMessages(roomId, limit = 50, offset = 0) {
    return await RoomMessageRepository.findByRoomId(roomId, limit, offset);
  }

  /**
   * Regenerate room invite code (host only)
   * @param {string} roomId - Room UUID
   * @param {string} userId - User ID (must be host)
   * @returns {Promise<Object>} Updated room with new code
   */
  static async regenerateInviteCode(roomId, userId) {
    // Verify host
    const isHost = await RoomParticipantRepository.isUserHost(roomId, userId);
    if (!isHost) {
      throw new Error('Only the host can regenerate invite code');
    }

    return await RoomRepository.regenerateInviteCode(roomId);
  }

  /**
   * Transfer host to another participant (host only)
   * @param {string} roomId - Room UUID
   * @param {string} currentHostId - Current host user ID
   * @param {string} newHostId - New host user ID
   * @returns {Promise<Object>} Result with new host info
   */
  static async transferHost(roomId, currentHostId, newHostId) {
    // Verify current host
    const isHost = await RoomParticipantRepository.isUserHost(roomId, currentHostId);
    if (!isHost) {
      throw new Error('Only the host can transfer host role');
    }

    // Verify new host is in room
    const isNewHostInRoom = await RoomParticipantRepository.isUserInRoom(roomId, newHostId);
    if (!isNewHostInRoom) {
      throw new Error('Target user is not in this room');
    }

    // Cannot transfer to self
    if (currentHostId === newHostId) {
      throw new Error('Cannot transfer host to yourself');
    }

    // Get new host details for the event
    const newHost = await RoomParticipantRepository.findByRoomAndUser(roomId, newHostId);

    // Transfer host role
    await RoomParticipantRepository.transferHost(roomId, currentHostId, newHostId);

    // Emit socket event
    try {
      const io = getSocketInstance();
      io.to(roomId).emit('host:transferred', {
        roomId,
        newHostId,
        newHostUsername: newHost.username,
      });
    } catch (error) {
      console.error('Failed to emit host:transferred event:', error);
    }

    return {
      success: true,
      newHostId,
      newHostUsername: newHost.username,
    };
  }
}
