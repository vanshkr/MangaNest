import { UserRepository } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { validatePasswordStrength } from '../utils/password.js';

/**
 * Auth Service - Business logic for authentication
 */
export class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User and tokens
   */
  static async register({ username, email, password, avatarUrl }) {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Check if email already exists
    const emailExists = await UserRepository.emailExists(email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const usernameExists = await UserRepository.usernameExists(username);
    if (usernameExists) {
      throw new Error('Username already taken');
    }

    // Create user
    const user = await UserRepository.create({
      username,
      email,
      password,
      avatarUrl,
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User and tokens
   */
  static async login(email, password) {
    // Verify credentials
    const user = await UserRepository.verifyPassword(email, password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  static async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Get user
      const user = await UserRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
      const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      return {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Get current user info
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User info
   */
  static async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user
   */
  static async updateProfile(userId, updates) {
    const { username, email, avatarUrl } = updates;

    // Check if new email is already taken by another user
    if (email) {
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use');
      }
    }

    // Check if new username is already taken by another user
    if (username) {
      const existingUser = await UserRepository.findByUsername(username);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username already taken');
      }
    }

    const user = await UserRepository.update(userId, {
      username,
      email,
      avatarUrl,
    });

    return user;
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const userWithPassword = await UserRepository.findByEmail(user.email);
    const isValid = await UserRepository.verifyPassword(user.email, currentPassword);

    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Update password
    await UserRepository.updatePassword(userId, newPassword);

    return true;
  }
}
