import { getAccessToken } from '@/utils/tokenStorage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const ROOM_BASE = `${API_BASE}/api/rooms`;

/**
 * Helper to get auth headers
 */
const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Create a new room
 */
export const createRoom = async (roomData) => {
  const response = await fetch(ROOM_BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create room');
  }
  return data.data;
};

/**
 * Get public rooms list
 */
export const getPublicRooms = async (page = 1, limit = 20) => {
  const response = await fetch(`${ROOM_BASE}/public?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch public rooms');
  }
  return data.data;
};

/**
 * Get user's rooms (hosted and joined)
 */
export const getMyRooms = async () => {
  const response = await fetch(`${ROOM_BASE}/my-rooms`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch your rooms');
  }
  return data.data;
};

/**
 * Get room details by ID
 */
export const getRoomDetails = async (roomId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch room details');
  }
  return data.data;
};

/**
 * Join a room by ID
 */
export const joinRoom = async (roomId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/join`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to join room');
  }
  return data.data;
};

/**
 * Join room by invite code
 */
export const joinRoomByInviteCode = async (inviteCode) => {
  const response = await fetch(`${ROOM_BASE}/join/${inviteCode}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to join room with invite code');
  }
  return data.data;
};

/**
 * Leave a room
 */
export const leaveRoom = async (roomId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/leave`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to leave room');
  }
  return data.data;
};

/**
 * Kick a participant from room (host only)
 */
export const kickParticipant = async (roomId, userId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/kick/${userId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to kick participant');
  }
  return data.data;
};

/**
 * Update room settings (host only)
 */
export const updateRoomSettings = async (roomId, settings) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update room settings');
  }
  return data.data;
};

/**
 * Update current page
 */
export const updateCurrentPage = async (roomId, page) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/page`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ page }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update page');
  }
  return data.data;
};

/**
 * Close a room (host only)
 */
export const closeRoom = async (roomId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to close room');
  }
  return data.data;
};

/**
 * Send a chat message
 */
export const sendMessage = async (roomId, content, messageType = 'text') => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, messageType }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send message');
  }
  return data.data;
};

/**
 * Get room messages
 */
export const getRoomMessages = async (roomId, limit = 50, offset = 0) => {
  const response = await fetch(
    `${ROOM_BASE}/${roomId}/messages?limit=${limit}&offset=${offset}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch messages');
  }
  return data.data;
};

/**
 * Regenerate invite code (host only)
 */
export const regenerateInviteCode = async (roomId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/regenerate-invite`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to regenerate invite code');
  }
  return data.data;
};

/**
 * Transfer host to another participant (host only)
 */
export const transferHost = async (roomId, newHostId) => {
  const response = await fetch(`${ROOM_BASE}/${roomId}/transfer-host`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newHostId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to transfer host');
  }
  return data.data;
};
