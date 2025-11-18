import { query } from '../config/database.js';

/**
 * RoomMessage Repository - Data access layer for room messages
 */
export class RoomMessageRepository {
  /**
   * Create a new message in a room
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message
   */
  static async create(messageData) {
    const { roomId, userId, messageType = 'text', content } = messageData;

    const sql = `
      INSERT INTO room_messages (room_id, user_id, message_type, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await query(sql, [roomId, userId, messageType, content]);
    return result.rows[0];
  }

  /**
   * Get messages for a room with pagination
   * @param {string} roomId - Room UUID
   * @param {number} limit - Max messages to return
   * @param {number} offset - Pagination offset
   * @returns {Promise<Array>} Array of messages with user info
   */
  static async findByRoomId(roomId, limit = 50, offset = 0) {
    const sql = `
      SELECT rm.*, u.username, u.avatar_url
      FROM room_messages rm
      LEFT JOIN users u ON rm.user_id = u.id
      WHERE rm.room_id = $1
      ORDER BY rm.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [roomId, limit, offset]);
    // Reverse to show oldest first
    return result.rows.reverse();
  }

  /**
   * Get recent messages for a room
   * @param {string} roomId - Room UUID
   * @param {number} count - Number of recent messages
   * @returns {Promise<Array>} Array of recent messages
   */
  static async findRecentByRoomId(roomId, count = 50) {
    const sql = `
      SELECT rm.*, u.username, u.avatar_url
      FROM room_messages rm
      LEFT JOIN users u ON rm.user_id = u.id
      WHERE rm.room_id = $1
      ORDER BY rm.created_at DESC
      LIMIT $2
    `;
    const result = await query(sql, [roomId, count]);
    return result.rows.reverse();
  }

  /**
   * Get messages after a specific timestamp
   * @param {string} roomId - Room UUID
   * @param {Date} afterTimestamp - Get messages after this time
   * @returns {Promise<Array>} Array of messages
   */
  static async findAfterTimestamp(roomId, afterTimestamp) {
    const sql = `
      SELECT rm.*, u.username, u.avatar_url
      FROM room_messages rm
      LEFT JOIN users u ON rm.user_id = u.id
      WHERE rm.room_id = $1 AND rm.created_at > $2
      ORDER BY rm.created_at ASC
    `;
    const result = await query(sql, [roomId, afterTimestamp]);
    return result.rows;
  }

  /**
   * Get message count for a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<number>} Message count
   */
  static async getCount(roomId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM room_messages
      WHERE room_id = $1
    `;
    const result = await query(sql, [roomId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete all messages in a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<number>} Number of deleted messages
   */
  static async deleteByRoomId(roomId) {
    const sql = 'DELETE FROM room_messages WHERE room_id = $1';
    const result = await query(sql, [roomId]);
    return result.rowCount;
  }

  /**
   * Delete a specific message
   * @param {string} messageId - Message UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(messageId) {
    const sql = 'DELETE FROM room_messages WHERE id = $1';
    const result = await query(sql, [messageId]);
    return result.rowCount > 0;
  }

  /**
   * Delete messages older than specified date
   * @param {string} roomId - Room UUID
   * @param {Date} beforeDate - Delete messages before this date
   * @returns {Promise<number>} Number of deleted messages
   */
  static async deleteOldMessages(roomId, beforeDate) {
    const sql = `
      DELETE FROM room_messages
      WHERE room_id = $1 AND created_at < $2
    `;
    const result = await query(sql, [roomId, beforeDate]);
    return result.rowCount;
  }
}
