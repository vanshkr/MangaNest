import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAccessToken } from '@/utils/tokenStorage';
import { toast } from 'sonner';

const SocketContext = createContext(null);

/**
 * Hook to access Socket.IO context
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

/**
 * Socket.IO Provider Component
 * Manages socket connection and authentication
 */
export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !user) {
      // Disconnect if logged out
      if (socketRef.current) {
        console.log('🔌 Disconnecting socket (user logged out)');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get authentication token
    const token = getAccessToken();
    if (!token) {
      console.error('No access token available for socket connection');
      return;
    }

    // Create socket connection
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

    console.log('🔌 Initializing socket connection...');
    const newSocket = io(serverUrl, {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);

      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setConnectionError(error.message);

      // Show toast for authentication errors
      if (error.message.includes('Authentication') || error.message.includes('token')) {
        toast.error('Socket connection failed', {
          description: 'Authentication error. Please try logging in again.',
        });
      }
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      toast.error('Socket error', {
        description: error.message || 'An error occurred with the real-time connection',
      });
    });

    // Reconnection events
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      toast.success('Reconnected', {
        description: 'Real-time connection restored',
      });
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket reconnection attempt:', attemptNumber);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection error:', error.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
      toast.error('Connection lost', {
        description: 'Unable to restore real-time connection. Please refresh the page.',
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount or auth change
    return () => {
      if (socketRef.current) {
        console.log('🔌 Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected,
    connectionError,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
