import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import * as roomAPI from '@/api/room';
import { toast } from 'sonner';

const RoomContext = createContext(null);

/**
 * Hook to access Room context
 */
export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

/**
 * Room Provider Component
 * Manages current room state and Socket.IO events
 */
export const RoomProvider = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  // Room state
  const [currentRoom, setCurrentRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create a new room
   */
  const createRoom = async (roomData) => {
    setIsLoading(true);
    try {
      const room = await roomAPI.createRoom(roomData);
      toast.success('Room created successfully!');
      return room;
    } catch (error) {
      toast.error('Failed to create room', {
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Join a room
   */
  const joinRoom = async (roomId) => {
    setIsLoading(true);
    try {
      // Join via REST API first
      const room = await roomAPI.joinRoom(roomId);
      setCurrentRoom(room);
      setParticipants(room.participants || []);
      setIsInRoom(true);
      setIsHost(room.host_user_id === user?.id);

      // Then join Socket.IO room
      if (socket && isConnected) {
        socket.emit('room:join', { roomId }, (response) => {
          if (response.success) {
            console.log('✅ Joined Socket.IO room');
          } else {
            console.error('Failed to join Socket.IO room:', response.message);
          }
        });
      }

      // Load messages
      const messagesData = await roomAPI.getRoomMessages(roomId);
      setMessages(messagesData.messages || []);

      toast.success('Joined room successfully!');
      return room;
    } catch (error) {
      toast.error('Failed to join room', {
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Join room by invite code
   */
  const joinByInviteCode = async (inviteCode) => {
    setIsLoading(true);
    try {
      const room = await roomAPI.joinRoomByInviteCode(inviteCode);
      setCurrentRoom(room);
      setParticipants(room.participants || []);
      setIsInRoom(true);
      setIsHost(room.host_user_id === user?.id);

      // Join Socket.IO room
      if (socket && isConnected) {
        socket.emit('room:join', { roomId: room.id }, (response) => {
          if (!response.success) {
            console.error('Failed to join Socket.IO room:', response.message);
          }
        });
      }

      // Load messages
      const messagesData = await roomAPI.getRoomMessages(room.id);
      setMessages(messagesData.messages || []);

      toast.success('Joined room successfully!');
      return room;
    } catch (error) {
      toast.error('Failed to join room', {
        description: error.message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Leave the current room
   */
  const leaveRoom = async () => {
    if (!currentRoom) return;

    try {
      // Leave Socket.IO room first
      if (socket && isConnected) {
        socket.emit('room:leave', { roomId: currentRoom.id });
      }

      // Then leave via API
      await roomAPI.leaveRoom(currentRoom.id);

      // Clear state
      setCurrentRoom(null);
      setParticipants([]);
      setMessages([]);
      setIsInRoom(false);
      setIsHost(false);

      toast.success('Left room successfully');
    } catch (error) {
      toast.error('Failed to leave room', {
        description: error.message,
      });
      throw error;
    }
  };

  /**
   * Update current page
   */
  const updatePage = async (page) => {
    if (!currentRoom) return;

    try {
      // Update via Socket.IO for instant sync
      if (socket && isConnected) {
        socket.emit('page:change', { roomId: currentRoom.id, page }, (response) => {
          if (!response.success) {
            toast.error('Failed to change page', {
              description: response.message,
            });
          }
        });
      }
    } catch (error) {
      toast.error('Failed to change page', {
        description: error.message,
      });
    }
  };

  /**
   * Send a chat message
   */
  const sendMessage = async (content, messageType = 'text') => {
    if (!currentRoom) return;

    try {
      if (socket && isConnected) {
        socket.emit(
          'message:send',
          { roomId: currentRoom.id, content, messageType },
          (response) => {
            if (!response.success) {
              toast.error('Failed to send message', {
                description: response.message,
              });
            }
          }
        );
      }
    } catch (error) {
      toast.error('Failed to send message', {
        description: error.message,
      });
    }
  };

  /**
   * Send emoji reaction
   */
  const sendReaction = async (emoji) => {
    if (!currentRoom || !socket || !isConnected) return;

    socket.emit('reaction:send', { roomId: currentRoom.id, emoji }, (response) => {
      if (!response.success) {
        console.error('Failed to send reaction:', response.message);
      }
    });
  };

  /**
   * Kick a participant (host only)
   */
  const kickParticipant = async (userId) => {
    if (!currentRoom || !isHost) return;

    try {
      await roomAPI.kickParticipant(currentRoom.id, userId);
      toast.success('Participant kicked');
    } catch (error) {
      toast.error('Failed to kick participant', {
        description: error.message,
      });
    }
  };

  /**
   * Update room settings (host only)
   */
  const updateSettings = async (settings) => {
    if (!currentRoom || !isHost) return;

    try {
      const updatedRoom = await roomAPI.updateRoomSettings(currentRoom.id, settings);
      setCurrentRoom(updatedRoom);
      toast.success('Room settings updated');
    } catch (error) {
      toast.error('Failed to update settings', {
        description: error.message,
      });
    }
  };

  /**
   * Close the room (host only)
   */
  const closeRoom = async () => {
    if (!currentRoom || !isHost) return;

    try {
      await roomAPI.closeRoom(currentRoom.id);

      // Clear state
      setCurrentRoom(null);
      setParticipants([]);
      setMessages([]);
      setIsInRoom(false);
      setIsHost(false);

      toast.success('Room closed successfully');
    } catch (error) {
      toast.error('Failed to close room', {
        description: error.message,
      });
    }
  };

  /**
   * Regenerate invite code (host only)
   */
  const regenerateInvite = async () => {
    if (!currentRoom || !isHost) return;

    try {
      const data = await roomAPI.regenerateInviteCode(currentRoom.id);
      setCurrentRoom({
        ...currentRoom,
        invite_code: data.inviteCode,
        invite_expires_at: data.inviteExpiresAt,
      });
      toast.success('Invite code regenerated');
      return data.inviteCode;
    } catch (error) {
      toast.error('Failed to regenerate invite', {
        description: error.message,
      });
    }
  };

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket || !isConnected || !isInRoom) return;

    // Page changed
    const handlePageChanged = ({ page, userId }) => {
      setCurrentRoom((prev) => (prev ? { ...prev, current_page: page } : null));
    };

    // New message
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    // User joined
    const handleUserJoined = ({ userId, participantCount }) => {
      if (currentRoom) {
        setCurrentRoom({ ...currentRoom, participant_count: participantCount });
      }
    };

    // User left
    const handleUserLeft = ({ userId, participantCount }) => {
      setParticipants((prev) => prev.filter((p) => p.user_id !== userId));
      if (currentRoom) {
        setCurrentRoom({ ...currentRoom, participant_count: participantCount });
      }
    };

    // User kicked
    const handleUserKicked = ({ userId }) => {
      if (userId === user?.id) {
        toast.error('You were kicked from the room');
        setCurrentRoom(null);
        setParticipants([]);
        setMessages([]);
        setIsInRoom(false);
        setIsHost(false);
      } else {
        setParticipants((prev) => prev.filter((p) => p.user_id !== userId));
      }
    };

    // Host transferred
    const handleHostTransferred = ({ newHostId, newHostUsername }) => {
      setIsHost(newHostId === user?.id);
      if (currentRoom) {
        setCurrentRoom({ ...currentRoom, host_user_id: newHostId });
      }
      toast.info(`Host transferred to ${newHostUsername}`);
    };

    // Room closed
    const handleRoomClosed = () => {
      toast.info('Room has been closed by the host');
      setCurrentRoom(null);
      setParticipants([]);
      setMessages([]);
      setIsInRoom(false);
      setIsHost(false);
    };

    // Room updated
    const handleRoomUpdated = ({ settings }) => {
      setCurrentRoom((prev) => (prev ? { ...prev, ...settings } : null));
    };

    // Participant entered
    const handleParticipantEntered = (participant) => {
      setParticipants((prev) => [...prev, participant]);
      toast.info(`${participant.username} joined the room`);
    };

    // Participant exited
    const handleParticipantExited = ({ username }) => {
      toast.info(`${username} left the room`);
    };

    // Register listeners
    socket.on('page:changed', handlePageChanged);
    socket.on('message:new', handleNewMessage);
    socket.on('user:joined', handleUserJoined);
    socket.on('user:left', handleUserLeft);
    socket.on('user:kicked', handleUserKicked);
    socket.on('host:transferred', handleHostTransferred);
    socket.on('room:closed', handleRoomClosed);
    socket.on('room:updated', handleRoomUpdated);
    socket.on('participant:entered', handleParticipantEntered);
    socket.on('participant:exited', handleParticipantExited);

    // Cleanup
    return () => {
      socket.off('page:changed', handlePageChanged);
      socket.off('message:new', handleNewMessage);
      socket.off('user:joined', handleUserJoined);
      socket.off('user:left', handleUserLeft);
      socket.off('user:kicked', handleUserKicked);
      socket.off('host:transferred', handleHostTransferred);
      socket.off('room:closed', handleRoomClosed);
      socket.off('room:updated', handleRoomUpdated);
      socket.off('participant:entered', handleParticipantEntered);
      socket.off('participant:exited', handleParticipantExited);
    };
  }, [socket, isConnected, isInRoom, currentRoom, user]);

  const value = {
    // State
    currentRoom,
    participants,
    messages,
    isInRoom,
    isHost,
    isLoading,

    // Actions
    createRoom,
    joinRoom,
    joinByInviteCode,
    leaveRoom,
    updatePage,
    sendMessage,
    sendReaction,
    kickParticipant,
    updateSettings,
    closeRoom,
    regenerateInvite,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
