import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import {
  User,
  LogOut,
  Settings,
  Heart,
  Users,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export const UserProfileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      toast.success('Logged out successfully', {
        description: 'See you next time!',
      });
      navigate('/');
    } catch (error) {
      toast.error('Logout failed', {
        description: error.message,
      });
    }
  };

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <Link to="/login">
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-purple-500 hover:bg-purple-500/10 rounded-md"
        >
          <LogIn className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Login</span>
        </Button>
      </Link>
    );
  }

  // If authenticated, show user menu
  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-purple-300 hover:text-purple-400 transition-colors focus:outline-none"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-8 h-8 rounded-full border-2 border-purple-500/50 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-purple-500/50">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium">{user?.username}</span>
        <ChevronDown className={`hidden md:inline w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-purple-500/20 rounded-lg shadow-2xl py-2 z-50 animate-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
            >
              <Heart className="w-4 h-4 mr-3" />
              My Favorites
            </Link>
            <Link
              to="/rooms"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
            >
              <Users className="w-4 h-4 mr-3" />
              My Rooms
            </Link>
            <Link
              to="/profile/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-2"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
