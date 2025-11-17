import { query } from '../config/database.js';

/**
 * RoomParticipant Repository - Data access layer for room participants
 */
export class RoomParticipantRepository {
  /**
   * Add a participant to a room
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @param {boolean} isHost - Is user the host
   * @returns {Promise<Object>} Created participant
   */
  static async create(roomId, userId, isHost = false) {
    const sql = `
      INSERT INTO room_participants (room_id, user_id, is_host)
      VALUES ($1, $2, $3)
      ON CONFLICT (room_id, user_id)
      DO UPDATE SET is_active = true, joined_at = NOW()
      RETURNING *
    `;
    const result = await query(sql, [roomId, userId, isHost]);
    return result.rows[0];
  }

  /**
   * Find participant by room and user ID
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>} Participant or null
   */
  static async findByRoomAndUser(roomId, userId) {
    const sql = `
      SELECT * FROM room_participants
      WHERE room_id = $1 AND user_id = $2
    `;
    const result = await query(sql, [roomId, userId]);
    return result.rows[0] || null;
  }

  /**
   * Get all active participants in a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<Array>} Array of participants with user info
   */
  static async findByRoomId(roomId) {
    const sql = `
      SELECT rp.*, u.username, u.email, u.avatar_url
      FROM room_participants rp
      INNER JOIN users u ON rp.user_id = u.id
      WHERE rp.room_id = $1 AND rp.is_active = true
      ORDER BY rp.is_host DESC, rp.joined_at ASC
    `;
    const result = await query(sql, [roomId]);
    return result.rows;
  }

  /**
   * Get all rooms for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Array of participant records
   */
  static async findByUserId(userId) {
    const sql = `
      SELECT rp.*, r.manga_id, r.chapter_id, r.is_public
      FROM room_participants rp
      INNER JOIN rooms r ON rp.room_id = r.id
      WHERE rp.user_id = $1 AND rp.is_active = true AND r.is_active = true
      ORDER BY rp.last_seen DESC
    `;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  /**
   * Update participant's last_seen timestamp
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Updated participant
   */
  static async updateLastSeen(roomId, userId) {
    const sql = `
      UPDATE room_participants
      SET last_seen = NOW()
      WHERE room_id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await query(sql, [roomId, userId]);
    return result.rows[0];
  }

  /**
   * Remove participant from room (soft delete)
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Updated participant
   */
  static async deactivate(roomId, userId) {
    const sql = `
      UPDATE room_participants
      SET is_active = false
      WHERE room_id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await query(sql, [roomId, userId]);
    return result.rows[0];
  }

  /**
   * Permanently delete participant
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(roomId, userId) {
    const sql = `
      DELETE FROM room_participants
      WHERE room_id = $1 AND user_id = $2
    `;
    const result = await query(sql, [roomId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Transfer host role to another participant
   * @param {string} roomId - Room UUID
   * @param {string} currentHostId - Current host user ID
   * @param {string} newHostId - New host user ID
   * @returns {Promise<Object>} Transaction result
   */
  static async transferHost(roomId, currentHostId, newHostId) {
    const client = await query('BEGIN');

    try {
      // Remove host role from current host
      await query(
        'UPDATE room_participants SET is_host = false WHERE room_id = $1 AND user_id = $2',
        [roomId, currentHostId]
      );

      // Grant host role to new host
      await query(
        'UPDATE room_participants SET is_host = true WHERE room_id = $1 AND user_id = $2',
        [roomId, newHostId]
      );

      // Update room's host_user_id
      await query('UPDATE rooms SET host_user_id = $1 WHERE id = $2', [newHostId, roomId]);

      await query('COMMIT');

      return { success: true };
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }

  /**
   * Check if user is in room
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} True if participant exists
   */
  static async isUserInRoom(roomId, userId) {
    const sql = `
      SELECT 1 FROM room_participants
      WHERE room_id = $1 AND user_id = $2 AND is_active = true
    `;
    const result = await query(sql, [roomId, userId]);
    return result.rows.length > 0;
  }

  /**
   * Check if user is host of room
   * @param {string} roomId - Room UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} True if user is host
   */
  static async isUserHost(roomId, userId) {
    const sql = `
      SELECT 1 FROM room_participants
      WHERE room_id = $1 AND user_id = $2 AND is_host = true AND is_active = true
    `;
    const result = await query(sql, [roomId, userId]);
    return result.rows.length > 0;
  }

  /**
   * Get participant count for a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<number>} Number of active participants
   */
  static async getCount(roomId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM room_participants
      WHERE room_id = $1 AND is_active = true
    `;
    const result = await query(sql, [roomId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Deactivate all participants in a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<number>} Number of deactivated participants
   */
  static async deactivateAll(roomId) {
    const sql = `
      UPDATE room_participants
      SET is_active = false
      WHERE room_id = $1
    `;
    const result = await query(sql, [roomId]);
    return result.rowCount;
  }
}
