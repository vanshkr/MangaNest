/**
 * Token Storage Utility
 * Manages JWT tokens in localStorage
 */

const ACCESS_TOKEN_KEY = 'manganest_access_token';
const REFRESH_TOKEN_KEY = 'manganest_refresh_token';

/**
 * Store access token
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * Get access token
 * @returns {string|null} JWT access token
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Store refresh token
 * @param {string} token - JWT refresh token
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Get refresh token
 * @returns {string|null} JWT refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store both tokens
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setTokens = (accessToken, refreshToken) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Clear all tokens (logout)
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user is authenticated (has access token)
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};
