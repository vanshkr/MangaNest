/**
 * API Configuration
 * Centralized API endpoint configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Manga endpoints
  trending: `${API_BASE_URL}/api/manga/trending`,
  collections: `${API_BASE_URL}/api/manga/collections`,
  topAiring: `${API_BASE_URL}/api/manga/top-airing`,
  mostPopular: `${API_BASE_URL}/api/manga/most-popular`,
  hiddenGems: `${API_BASE_URL}/api/manga/hidden-gems`,
  recentlyCompleted: `${API_BASE_URL}/api/manga/recently-completed`,
  latestReleases: `${API_BASE_URL}/api/manga/latest-releases`,
  mangaDetail: (id) => `${API_BASE_URL}/api/manga/${id}`,
  chapterPanels: (id) => `${API_BASE_URL}/api/manga/chapters/${id}`,
};

/**
 * Fetch wrapper with error handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
