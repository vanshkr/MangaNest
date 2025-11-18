import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '@/contexts/RoomContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Users,
  Crown,
  LogOut,
  Send,
  Settings,
  Copy,
  Check,
  UserMinus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Smile,
} from 'lucide-react';
import { toast } from 'sonner';

// Quick emoji reactions
const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😊', '🔥', '👏', '🎉'];

export const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentRoom,
    participants,
    messages,
    reactions,
    isInRoom,
    isHost,
    isLoading,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendReaction,
    kickParticipant,
    updatePage,
    updateSettings,
    closeRoom,
    regenerateInvite,
    transferHostRole,
  } = useRoom();

  const [messageInput, setMessageInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [isHostControlsOpen, setIsHostControlsOpen] = useState(false);
  const [selectedNewHost, setSelectedNewHost] = useState('');
  const [roomSettings, setRoomSettings] = useState({
    syncMode: '',
    allowChat: true,
    maxParticipants: 10,
  });

  // Join room on mount if not already in
  useEffect(() => {
    if (!isInRoom && roomId && !isLoading) {
      joinRoom(roomId).catch((error) => {
        console.error('Failed to join room:', error);
        navigate('/rooms');
      });
    }
  }, [roomId, isInRoom, isLoading]);

  // Sync current page with room state and trigger animation
  useEffect(() => {
    if (currentRoom) {
      const newPage = currentRoom.current_page || 1;
      if (newPage !== currentPage) {
        setIsPageChanging(true);
        setCurrentPage(newPage);
        setPageInput(newPage.toString());

        // Reset animation after 500ms
        setTimeout(() => setIsPageChanging(false), 500);
      }
    }
  }, [currentRoom?.current_page]);

  // Sync room settings
  useEffect(() => {
    if (currentRoom) {
      setRoomSettings({
        syncMode: currentRoom.sync_mode || 'host-controlled',
        allowChat: currentRoom.allow_chat ?? true,
        maxParticipants: currentRoom.max_participants || 10,
      });
    }
  }, [currentRoom]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
      navigate('/rooms');
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleCopyInviteCode = () => {
    if (currentRoom?.invite_code) {
      navigator.clipboard.writeText(currentRoom.invite_code);
      setIsCopied(true);
      toast.success('Invite code copied!');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      updatePage(newPage);
    }
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1) {
      handlePageChange(page);
    }
  };

  const handleKick = async (userId) => {
    if (window.confirm('Are you sure you want to kick this participant?')) {
      await kickParticipant(userId);
    }
  };

  const handleTransferHost = async () => {
    if (!selectedNewHost) {
      toast.error('Please select a new host');
      return;
    }
    if (window.confirm('Are you sure you want to transfer host role?')) {
      try {
        await transferHostRole(selectedNewHost);
        setIsHostControlsOpen(false);
        setSelectedNewHost('');
      } catch (error) {
        console.error('Failed to transfer host:', error);
      }
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateSettings(roomSettings);
      toast.success('Room settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleCloseRoom = async () => {
    if (window.confirm('Are you sure you want to close this room? This will remove all participants.')) {
      try {
        await closeRoom();
        navigate('/rooms');
      } catch (error) {
        console.error('Failed to close room:', error);
      }
    }
  };

  const handleRegenerateInvite = async () => {
    try {
      await regenerateInvite();
    } catch (error) {
      console.error('Failed to regenerate invite:', error);
    }
  };

  const handleSendReaction = (emoji) => {
    sendReaction(emoji);
  };

  if (isLoading || !currentRoom) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row relative">
      {/* Floating Emoji Reactions */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute animate-float-up text-6xl"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: '0s',
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* Main Content - Manga Reader */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Reading Room
              </h1>
              <p className="text-sm text-gray-400">
                Hosted by{' '}
                <span className="text-purple-400">
                  {participants.find((p) => p.is_host)?.username || 'Unknown'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {currentRoom.invite_code && (
                <Button
                  onClick={handleCopyInviteCode}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Invite
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleLeaveRoom}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>
        </div>

        {/* Manga Reader Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="max-w-4xl w-full">
            {/* Page Display */}
            <Card className="bg-gray-900/50 backdrop-blur-md border-purple-500/20 mb-6">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <p className="text-sm">Manga ID: {currentRoom.manga_id}</p>
                  <p className="text-sm">Chapter ID: {currentRoom.chapter_id}</p>
                </div>
                <div
                  className={`text-4xl sm:text-6xl font-bold text-purple-400 mb-2 transition-all duration-300 ${
                    isPageChanging ? 'scale-110 text-pink-400' : 'scale-100'
                  }`}
                >
                  Page {currentPage}
                </div>

                {/* Sync Status Badge */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {currentRoom.sync_mode === 'host-controlled' ? 'Host Controlled' : 'Anyone Can Control'}
                  </Badge>
                </div>

                {currentRoom.last_page_changer && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last changed by: <span className="text-purple-400">{currentRoom.last_page_changer}</span>
                  </p>
                )}

                {currentRoom.sync_mode === 'host-controlled' && !isHost && (
                  <p className="text-yellow-400 text-sm mt-2">
                    Only the host can change pages
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Page Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || (currentRoom.sync_mode === 'host-controlled' && !isHost)}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
                  size="lg"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Previous
                </Button>
                <div className="px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-md">
                  <span className="text-white font-semibold">Page {currentPage}</span>
                </div>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentRoom.sync_mode === 'host-controlled' && !isHost}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
                  size="lg"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>

              {/* Jump to Page */}
              {(currentRoom.sync_mode !== 'host-controlled' || isHost) && (
                <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder="Jump to..."
                    className="w-24 sm:w-32 bg-gray-800/50 border-gray-700 text-white text-center"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Emoji Reactions */}
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Smile className="w-4 h-4" />
                Quick React:
              </span>
              {QUICK_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  variant="ghost"
                  size="sm"
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Participants & Chat */}
      <div className="lg:w-96 bg-gray-900/90 border-l border-purple-500/20 flex flex-col">
        {/* Participants Section */}
        <div className="border-b border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants ({participants.length}/{currentRoom.max_participants})
              </span>
              {isHost && (
                <Dialog open={isHostControlsOpen} onOpenChange={setIsHostControlsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-purple-400">Host Controls</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Manage room settings and participants
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Transfer Host Section */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Transfer Host
                        </h3>
                        <div className="space-y-2">
                          <Select value={selectedNewHost} onValueChange={setSelectedNewHost}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                              <SelectValue placeholder="Select new host..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {participants
                                .filter((p) => p.user_id !== user?.id)
                                .map((participant) => (
                                  <SelectItem key={participant.user_id} value={participant.user_id}>
                                    {participant.username}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={handleTransferHost}
                            disabled={!selectedNewHost}
                            variant="outline"
                            className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Transfer Host Role
                          </Button>
                        </div>
                      </div>

                      <Separator className="bg-gray-700" />

                      {/* Room Settings Section */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Room Settings
                        </h3>

                        {/* Sync Mode */}
                        <div className="space-y-2">
                          <Label htmlFor="syncMode" className="text-gray-300">Sync Mode</Label>
                          <Select
                            value={roomSettings.syncMode}
                            onValueChange={(value) =>
                              setRoomSettings({ ...roomSettings, syncMode: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="host-controlled">Host Controlled</SelectItem>
                              <SelectItem value="anyone-can-control">Anyone Can Control</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Allow Chat */}
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <Label htmlFor="allowChat" className="text-gray-300 cursor-pointer">
                              Allow Chat
                            </Label>
                            <p className="text-xs text-gray-500">
                              Enable or disable chat messages
                            </p>
                          </div>
                          <Switch
                            id="allowChat"
                            checked={roomSettings.allowChat}
                            onCheckedChange={(checked) =>
                              setRoomSettings({ ...roomSettings, allowChat: checked })
                            }
                          />
                        </div>

                        <Button
                          onClick={handleUpdateSettings}
                          className="w-full bg-purple-500 hover:bg-purple-600"
                        >
                          Save Settings
                        </Button>
                      </div>

                      <Separator className="bg-gray-700" />

                      {/* Invite Code Section */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-purple-300">Invite Code</h3>
                        <Button
                          onClick={handleRegenerateInvite}
                          variant="outline"
                          className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate Invite Code
                        </Button>
                      </div>

                      <Separator className="bg-gray-700" />

                      {/* Danger Zone */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
                        <Button
                          onClick={handleCloseRoom}
                          variant="outline"
                          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          Close Room
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.user_id}
                    className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {participant.avatar_url ? (
                        <img
                          src={participant.avatar_url}
                          alt={participant.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-white font-medium">
                          {participant.username}
                          {participant.user_id === user?.id && ' (You)'}
                        </p>
                        {participant.is_host && (
                          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Crown className="w-3 h-3 mr-1" />
                            Host
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isHost && !participant.is_host && participant.user_id !== user?.id && (
                      <Button
                        onClick={() => handleKick(participant.user_id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-0 pb-4 min-h-0">
            {/* Messages */}
            <ScrollArea className="flex-1 mb-4 pr-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  messages.map((message, index) => (
                    <div key={message.id || index} className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-purple-400">
                          {message.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-2 break-words">
                        {message.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            {currentRoom.allow_chat ? (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 min-h-[60px] max-h-[120px] bg-gray-800/50 border-gray-700 text-white resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <p className="text-gray-500 text-sm text-center py-2">Chat is disabled</p>
            )}
          </CardContent>
        </div>
      </div>

      {/* Add global styles for floating animation */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(1.5);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
