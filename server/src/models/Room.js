import { query } from '../config/database.js';
import crypto from 'crypto';

/**
 * Room Repository - Data access layer for rooms
 */
export class RoomRepository {
  /**
   * Create a new room
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} Created room
   */
  static async create(roomData) {
    const {
      hostUserId,
      mangaId,
      chapterId,
      currentPage = 1,
      maxParticipants = 10,
      isPublic = true,
      syncMode = 'host-controlled',
      allowChat = true,
    } = roomData;

    // Generate unique invite code
    const inviteCode = this.generateInviteCode();
    const inviteExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const sql = `
      INSERT INTO rooms (
        host_user_id, manga_id, chapter_id, current_page,
        max_participants, is_public, sync_mode, allow_chat,
        invite_code, invite_expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      hostUserId,
      mangaId,
      chapterId,
      currentPage,
      maxParticipants,
      isPublic,
      syncMode,
      allowChat,
      inviteCode,
      inviteExpiresAt,
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find room by ID
   * @param {string} roomId - Room UUID
   * @returns {Promise<Object|null>} Room or null
   */
  static async findById(roomId) {
    const sql = 'SELECT * FROM rooms WHERE id = $1';
    const result = await query(sql, [roomId]);
    return result.rows[0] || null;
  }

  /**
   * Find room by invite code
   * @param {string} inviteCode - Invite code
   * @returns {Promise<Object|null>} Room or null
   */
  static async findByInviteCode(inviteCode) {
    const sql = `
      SELECT * FROM rooms
      WHERE invite_code = $1
        AND is_active = true
        AND invite_expires_at > NOW()
    `;
    const result = await query(sql, [inviteCode]);
    return result.rows[0] || null;
  }

  /**
   * Get all active public rooms
   * @param {number} limit - Max results
   * @param {number} offset - Pagination offset
   * @returns {Promise<Array>} Array of rooms
   */
  static async findPublicRooms(limit = 20, offset = 0) {
    const sql = `
      SELECT r.*, u.username as host_username, u.avatar_url as host_avatar_url,
             COUNT(rp.id) as participant_count
      FROM rooms r
      LEFT JOIN users u ON r.host_user_id = u.id
      LEFT JOIN room_participants rp ON r.id = rp.room_id AND rp.is_active = true
      WHERE r.is_public = true AND r.is_active = true
      GROUP BY r.id, u.username, u.avatar_url
      ORDER BY r.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);
    return result.rows;
  }

  /**
   * Get rooms by host user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Array of rooms
   */
  static async findByHostUserId(userId) {
    const sql = `
      SELECT r.*, COUNT(rp.id) as participant_count
      FROM rooms r
      LEFT JOIN room_participants rp ON r.id = rp.room_id AND rp.is_active = true
      WHERE r.host_user_id = $1 AND r.is_active = true
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  /**
   * Get rooms where user is a participant
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Array of rooms
   */
  static async findByParticipantUserId(userId) {
    const sql = `
      SELECT r.*, u.username as host_username, u.avatar_url as host_avatar_url,
             COUNT(rp2.id) as participant_count
      FROM rooms r
      INNER JOIN room_participants rp ON r.id = rp.room_id
      LEFT JOIN users u ON r.host_user_id = u.id
      LEFT JOIN room_participants rp2 ON r.id = rp2.room_id AND rp2.is_active = true
      WHERE rp.user_id = $1 AND rp.is_active = true AND r.is_active = true
      GROUP BY r.id, u.username, u.avatar_url
      ORDER BY r.created_at DESC
    `;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  /**
   * Update room
   * @param {string} roomId - Room UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated room
   */
  static async update(roomId, updates) {
    const allowedFields = [
      'current_page',
      'max_participants',
      'is_public',
      'sync_mode',
      'allow_chat',
      'is_active',
    ];

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(roomId);
    const sql = `
      UPDATE rooms
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Update current page
   * @param {string} roomId - Room UUID
   * @param {number} page - Page number
   * @returns {Promise<Object>} Updated room
   */
  static async updateCurrentPage(roomId, page) {
    const sql = `
      UPDATE rooms
      SET current_page = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [page, roomId]);
    return result.rows[0];
  }

  /**
   * Deactivate/close a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<Object>} Updated room
   */
  static async deactivate(roomId) {
    const sql = `
      UPDATE rooms
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [roomId]);
    return result.rows[0];
  }

  /**
   * Delete a room permanently
   * @param {string} roomId - Room UUID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(roomId) {
    const sql = 'DELETE FROM rooms WHERE id = $1';
    const result = await query(sql, [roomId]);
    return result.rowCount > 0;
  }

  /**
   * Regenerate invite code for a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<Object>} Updated room
   */
  static async regenerateInviteCode(roomId) {
    const inviteCode = this.generateInviteCode();
    const inviteExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const sql = `
      UPDATE rooms
      SET invite_code = $1, invite_expires_at = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await query(sql, [inviteCode, inviteExpiresAt, roomId]);
    return result.rows[0];
  }

  /**
   * Generate unique invite code
   * @returns {string} Random invite code
   */
  static generateInviteCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  /**
   * Get participant count for a room
   * @param {string} roomId - Room UUID
   * @returns {Promise<number>} Participant count
   */
  static async getParticipantCount(roomId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM room_participants
      WHERE room_id = $1 AND is_active = true
    `;
    const result = await query(sql, [roomId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Check if room is full
   * @param {string} roomId - Room UUID
   * @returns {Promise<boolean>} True if full
   */
  static async isFull(roomId) {
    const room = await this.findById(roomId);
    if (!room) return true;

    const count = await this.getParticipantCount(roomId);
    return count >= room.max_participants;
  }
}
