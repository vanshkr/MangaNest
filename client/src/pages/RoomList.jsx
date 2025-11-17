import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/contexts/RoomContext';
import { getPublicRooms } from '@/api/room';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Book,
  Lock,
  Globe,
  Crown,
  UserPlus,
  Loader2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export const RoomList = () => {
  const navigate = useNavigate();
  const { joinRoom, isLoading: roomLoading } = useRoom();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [joiningRoomId, setJoiningRoomId] = useState(null);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const data = await getPublicRooms(page, 20);
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error('Failed to load rooms', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [page]);

  const handleJoinRoom = async (roomId) => {
    setJoiningRoomId(roomId);
    try {
      await joinRoom(roomId);
      navigate(`/rooms/${roomId}`);
    } catch (error) {
      // Error already handled by RoomContext
      setJoiningRoomId(null);
    }
  };

  const handleRefresh = () => {
    loadRooms();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Public Reading Rooms
            </h1>
            <p className="text-gray-400">Join others in Read2gether sessions</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => navigate('/rooms/create')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </div>
        </div>

        {/* Room Grid */}
        {rooms.length === 0 ? (
          <Card className="bg-gray-900/50 backdrop-blur-md border-purple-500/20">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No active rooms</h3>
              <p className="text-gray-500 mb-6">
                Be the first to create a reading room!
              </p>
              <Button
                onClick={() => navigate('/rooms/create')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-gray-900/50 backdrop-blur-md border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Book className="w-5 h-5 text-purple-400" />
                        Manga Room
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm mt-1">
                        Hosted by{' '}
                        <span className="text-purple-400 font-medium">
                          {room.host_username || 'Unknown'}
                        </span>
                      </CardDescription>
                    </div>
                    {room.is_public ? (
                      <Globe className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {room.participant_count || 0}/{room.max_participants}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-800 text-gray-300 border-gray-700"
                    >
                      {room.sync_mode === 'host-controlled' ? (
                        <>
                          <Crown className="w-3 h-3 mr-1" />
                          Host Control
                        </>
                      ) : (
                        <>Anyone</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        Manga ID: <span className="text-gray-300 font-mono">{room.manga_id}</span>
                      </p>
                      <p className="flex items-center gap-2 mt-1">
                        <span className="text-purple-400">Page {room.current_page || 1}</span>
                      </p>
                    </div>

                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={
                        joiningRoomId === room.id ||
                        roomLoading ||
                        room.participant_count >= room.max_participants
                      }
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                    >
                      {joiningRoomId === room.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : room.participant_count >= room.max_participants ? (
                        'Room Full'
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Join Room
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {rooms.length > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 disabled:opacity-50"
            >
              Previous
            </Button>
            <div className="flex items-center px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-md">
              <span className="text-gray-300">Page {page}</span>
            </div>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={rooms.length < 20}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
