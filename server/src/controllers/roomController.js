import { RoomService } from '../services/roomService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation middleware for room creation
 */
export const createRoomValidation = [
  body('mangaId')
    .trim()
    .notEmpty()
    .withMessage('Manga ID is required'),
  body('chapterId')
    .trim()
    .notEmpty()
    .withMessage('Chapter ID is required'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage('Max participants must be between 2 and 50'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('syncMode')
    .optional()
    .isIn(['host-controlled', 'anyone-can-control'])
    .withMessage('Invalid sync mode'),
  body('allowChat')
    .optional()
    .isBoolean()
    .withMessage('allowChat must be a boolean'),
];

/**
 * Validation for room settings update
 */
export const updateRoomValidation = [
  param('roomId')
    .isUUID()
    .withMessage('Invalid room ID'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage('Max participants must be between 2 and 50'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('syncMode')
    .optional()
    .isIn(['host-controlled', 'anyone-can-control'])
    .withMessage('Invalid sync mode'),
  body('allowChat')
    .optional()
    .isBoolean()
    .withMessage('allowChat must be a boolean'),
];

/**
 * Validation for page update
 */
export const updatePageValidation = [
  param('roomId')
    .isUUID()
    .withMessage('Invalid room ID'),
  body('page')
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
];

/**
 * Validation for sending messages
 */
export const sendMessageValidation = [
  param('roomId')
    .isUUID()
    .withMessage('Invalid room ID'),
  body('content')
    .trim()
    .notEmpty()
    .isLength({ max: 1000 })
    .withMessage('Message content is required and must be under 1000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'emoji', 'system'])
    .withMessage('Invalid message type'),
];

/**
 * Create a new room
 * POST /api/rooms
 */
export const createRoom = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  try {
    const room = await RoomService.createRoom(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Join a room
 * POST /api/rooms/:roomId/join
 */
export const joinRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await RoomService.joinRoom(roomId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Join room by invite code
 * POST /api/rooms/join/:inviteCode
 */
export const joinByInviteCode = asyncHandler(async (req, res) => {
  const { inviteCode } = req.params;

  try {
    const room = await RoomService.joinByInviteCode(inviteCode, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Leave a room
 * POST /api/rooms/:roomId/leave
 */
export const leaveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  try {
    const result = await RoomService.leaveRoom(roomId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Left room successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Kick a participant from room
 * POST /api/rooms/:roomId/kick/:userId
 */
export const kickParticipant = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.params;

  try {
    const result = await RoomService.kickParticipant(roomId, req.user.id, userId);
    res.status(200).json({
      success: true,
      message: 'Participant kicked successfully',
      data: result,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Get room details
 * GET /api/rooms/:roomId
 */
export const getRoomDetails = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await RoomService.getRoomWithParticipants(roomId);
    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Get public rooms list
 * GET /api/rooms/public
 */
export const getPublicRooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const rooms = await RoomService.getPublicRooms(page, limit);
    res.status(200).json({
      success: true,
      data: {
        rooms,
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Get user's rooms
 * GET /api/rooms/my-rooms
 */
export const getMyRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await RoomService.getUserRooms(req.user.id);
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Update room settings
 * PATCH /api/rooms/:roomId
 */
export const updateRoomSettings = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const { roomId } = req.params;

  try {
    const room = await RoomService.updateRoomSettings(roomId, req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Room settings updated successfully',
      data: room,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Update current page
 * PATCH /api/rooms/:roomId/page
 */
export const updateCurrentPage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const { roomId } = req.params;
  const { page } = req.body;

  try {
    const room = await RoomService.updateCurrentPage(roomId, req.user.id, page);
    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      data: room,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Close a room
 * DELETE /api/rooms/:roomId
 */
export const closeRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  try {
    const result = await RoomService.closeRoom(roomId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Room closed successfully',
      data: result,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Send a chat message
 * POST /api/rooms/:roomId/messages
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const { roomId } = req.params;
  const { content, messageType } = req.body;

  try {
    const message = await RoomService.sendMessage(roomId, req.user.id, content, messageType);
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Get room messages
 * GET /api/rooms/:roomId/messages
 */
export const getRoomMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const messages = await RoomService.getRoomMessages(roomId, limit, offset);
    res.status(200).json({
      success: true,
      data: {
        messages,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Regenerate invite code
 * POST /api/rooms/:roomId/regenerate-invite
 */
export const regenerateInviteCode = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await RoomService.regenerateInviteCode(roomId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Invite code regenerated successfully',
      data: {
        inviteCode: room.invite_code,
        inviteExpiresAt: room.invite_expires_at,
      },
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});
