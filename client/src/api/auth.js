import { API_BASE_URL } from '@/config/api';
import { getAccessToken, getRefreshToken } from '@/utils/tokenStorage';

const AUTH_BASE = `${API_BASE_URL}/api/auth`;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response with user and tokens
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data.data;
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with user and tokens
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data.data;
};

/**
 * Refresh access token
 * @returns {Promise<Object>} Response with new tokens
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${AUTH_BASE}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Token refresh failed');
  }

  return data.data;
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile
 */
export const getCurrentUser = async () => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${AUTH_BASE}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get user profile');
  }

  return data.data.user;
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated user
 */
export const updateUserProfile = async (updates) => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${AUTH_BASE}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Profile update failed');
  }

  return data.data.user;
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changeUserPassword = async (currentPassword, newPassword) => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${AUTH_BASE}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Password change failed');
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  const token = getAccessToken();

  if (!token) {
    return; // Already logged out
  }

  const response = await fetch(`${AUTH_BASE}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed');
  }
};
