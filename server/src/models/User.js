import { query } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';

/**
 * User Repository - Database operations for users
 */
export class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async create({ username, email, password, avatarUrl = null }) {
    const passwordHash = await hashPassword(password);

    const sql = `
      INSERT INTO users (username, email, password_hash, avatar_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, avatar_url, created_at, updated_at
    `;

    const result = await query(sql, [username, email, passwordHash, avatarUrl]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User or null
   */
  static async findById(id) {
    const sql = `
      SELECT id, username, email, avatar_url, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find user by email (includes password for authentication)
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  static async findByEmail(email) {
    const sql = `
      SELECT id, username, email, password_hash, avatar_url, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await query(sql, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User or null
   */
  static async findByUsername(username) {
    const sql = `
      SELECT id, username, email, avatar_url, created_at, updated_at
      FROM users
      WHERE username = $1
    `;

    const result = await query(sql, [username]);
    return result.rows[0] || null;
  }

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   */
  static async update(id, updates) {
    const { username, email, avatarUrl } = updates;
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (username !== undefined) {
      fields.push(`username = $${paramCount++}`);
      values.push(username);
    }

    if (email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramCount++}`);
      values.push(avatarUrl);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, avatar_url, created_at, updated_at
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Update user password
   * @param {string} id - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success
   */
  static async updatePassword(id, newPassword) {
    const passwordHash = await hashPassword(newPassword);

    const sql = `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
    `;

    await query(sql, [passwordHash, id]);
    return true;
  }

  /**
   * Verify user password
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object|null>} User if password is correct, null otherwise
   */
  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success
   */
  static async delete(id) {
    const sql = `DELETE FROM users WHERE id = $1`;
    await query(sql, [id]);
    return true;
  }

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if exists
   */
  static async usernameExists(username) {
    const sql = `SELECT 1 FROM users WHERE username = $1 LIMIT 1`;
    const result = await query(sql, [username]);
    return result.rows.length > 0;
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if exists
   */
  static async emailExists(email) {
    const sql = `SELECT 1 FROM users WHERE email = $1 LIMIT 1`;
    const result = await query(sql, [email]);
    return result.rows.length > 0;
  }
}
