import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  updateUserProfile,
  changeUserPassword,
} from '@/api/auth';
import {
  setTokens,
  clearTokens,
  isAuthenticated as checkAuth,
  getAccessToken,
} from '@/utils/tokenStorage';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (checkAuth()) {
        // User has token, fetch profile
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Token might be expired, try to refresh
      try {
        await handleTokenRefresh();
      } catch (refreshError) {
        // Refresh failed, clear tokens
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenRefresh = async () => {
    const data = await refreshAccessToken();
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success(`Welcome to MangaNest, ${data.user.username}!`);
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${data.user.username}!`);
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if API call fails, clear local state
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await updateUserProfile(updates);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await changeUserPassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.message || 'Password change failed');
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
