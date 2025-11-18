import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createRoom,
  joinRoom,
  joinByInviteCode,
  leaveRoom,
  kickParticipant,
  getRoomDetails,
  getPublicRooms,
  getMyRooms,
  updateRoomSettings,
  updateCurrentPage,
  closeRoom,
  sendMessage,
  getRoomMessages,
  regenerateInviteCode,
  transferHost,
  createRoomValidation,
  updateRoomValidation,
  updatePageValidation,
  sendMessageValidation,
  transferHostValidation,
} from '../controllers/roomController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Room CRUD operations
router.post('/', createRoomValidation, createRoom);
router.get('/public', getPublicRooms);
router.get('/my-rooms', getMyRooms);
router.get('/:roomId', getRoomDetails);
router.patch('/:roomId', updateRoomValidation, updateRoomSettings);
router.delete('/:roomId', closeRoom);

// Room participation
router.post('/:roomId/join', joinRoom);
router.post('/join/:inviteCode', joinByInviteCode);
router.post('/:roomId/leave', leaveRoom);
router.post('/:roomId/kick/:userId', kickParticipant);
router.post('/:roomId/transfer-host', transferHostValidation, transferHost);

// Page synchronization
router.patch('/:roomId/page', updatePageValidation, updateCurrentPage);

// Chat
router.post('/:roomId/messages', sendMessageValidation, sendMessage);
router.get('/:roomId/messages', getRoomMessages);

// Invite management
router.post('/:roomId/regenerate-invite', regenerateInviteCode);

export default router;
