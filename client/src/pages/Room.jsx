import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '@/contexts/RoomContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import { toast } from 'sonner';

export const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentRoom,
    participants,
    messages,
    isInRoom,
    isHost,
    isLoading,
    joinRoom,
    leaveRoom,
    sendMessage,
    kickParticipant,
    updatePage,
  } = useRoom();

  const [messageInput, setMessageInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Join room on mount if not already in
  useEffect(() => {
    if (!isInRoom && roomId && !isLoading) {
      joinRoom(roomId).catch((error) => {
        console.error('Failed to join room:', error);
        navigate('/rooms');
      });
    }
  }, [roomId, isInRoom, isLoading]);

  // Sync current page with room state
  useEffect(() => {
    if (currentRoom) {
      setCurrentPage(currentRoom.current_page || 1);
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

  const handleKick = async (userId) => {
    if (window.confirm('Are you sure you want to kick this participant?')) {
      await kickParticipant(userId);
    }
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
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">
      {/* Main Content - Manga Reader */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2">
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
                      Invite Code
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
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="max-w-4xl w-full">
            {/* Page Display */}
            <Card className="bg-gray-900/50 backdrop-blur-md border-purple-500/20 mb-6">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <p className="text-sm">Manga ID: {currentRoom.manga_id}</p>
                  <p className="text-sm">Chapter ID: {currentRoom.chapter_id}</p>
                </div>
                <div className="text-6xl font-bold text-purple-400 mb-2">
                  Page {currentPage}
                </div>
                <p className="text-gray-500 text-sm">
                  Sync Mode: {currentRoom.sync_mode === 'host-controlled' ? 'Host Controlled' : 'Anyone Can Control'}
                </p>
                {currentRoom.sync_mode === 'host-controlled' && !isHost && (
                  <p className="text-yellow-400 text-sm mt-2">
                    Only the host can change pages
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Page Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || (currentRoom.sync_mode === 'host-controlled' && !isHost)}
                className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </Button>
              <div className="px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-md">
                <span className="text-white font-semibold">Page {currentPage}</span>
              </div>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentRoom.sync_mode === 'host-controlled' && !isHost}
                className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </Button>
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
              {isHost && <Settings className="w-4 h-4 text-purple-400" />}
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
        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-0 pb-4">
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
                      <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-2">
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
    </div>
  );
};
