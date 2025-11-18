import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoom } from '@/contexts/RoomContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Users, Lock, MessageSquare, Settings, Loader2 } from 'lucide-react';

export const RoomCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createRoom, isLoading } = useRoom();

  // Get manga and chapter from location state (if navigated from manga detail page)
  const preselectedManga = location.state?.mangaId || '';
  const preselectedChapter = location.state?.chapterId || '';
  const mangaTitle = location.state?.mangaTitle || '';

  const [formData, setFormData] = useState({
    mangaId: preselectedManga,
    chapterId: preselectedChapter,
    maxParticipants: 10,
    isPublic: true,
    syncMode: 'host-controlled',
    allowChat: true,
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mangaId || !formData.chapterId) {
      return;
    }

    try {
      const room = await createRoom(formData);
      // Navigate to the room
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Create Reading Room
          </h1>
          <p className="text-gray-400">Start a Read2gether session with friends</p>
        </div>

        {/* Form */}
        <Card className="bg-gray-900/50 backdrop-blur-md border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Room Settings</CardTitle>
            <CardDescription>
              Configure your reading room settings. You can change most of these later.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Manga ID Input */}
              <div className="space-y-2">
                <Label htmlFor="mangaId" className="flex items-center text-gray-300">
                  <Book className="w-4 h-4 mr-2" />
                  Manga ID
                </Label>
                <Input
                  id="mangaId"
                  value={formData.mangaId}
                  onChange={(e) => handleChange('mangaId', e.target.value)}
                  placeholder="Enter manga ID from URL"
                  required
                  disabled={isLoading}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
                {mangaTitle && (
                  <p className="text-sm text-purple-400">Selected: {mangaTitle}</p>
                )}
                <p className="text-xs text-gray-500">
                  The manga ID can be found in the manga detail page URL
                </p>
              </div>

              {/* Chapter ID Input */}
              <div className="space-y-2">
                <Label htmlFor="chapterId" className="flex items-center text-gray-300">
                  <Book className="w-4 h-4 mr-2" />
                  Chapter ID
                </Label>
                <Input
                  id="chapterId"
                  value={formData.chapterId}
                  onChange={(e) => handleChange('chapterId', e.target.value)}
                  placeholder="Enter chapter ID to start reading"
                  required
                  disabled={isLoading}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500">
                  The chapter ID can be found when viewing a chapter
                </p>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="flex items-center text-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  Maximum Participants
                </Label>
                <Select
                  value={formData.maxParticipants.toString()}
                  onValueChange={(value) => handleChange('maxParticipants', parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="2">2 participants</SelectItem>
                    <SelectItem value="5">5 participants</SelectItem>
                    <SelectItem value="10">10 participants</SelectItem>
                    <SelectItem value="20">20 participants</SelectItem>
                    <SelectItem value="50">50 participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sync Mode */}
              <div className="space-y-2">
                <Label htmlFor="syncMode" className="flex items-center text-gray-300">
                  <Settings className="w-4 h-4 mr-2" />
                  Sync Mode
                </Label>
                <Select
                  value={formData.syncMode}
                  onValueChange={(value) => handleChange('syncMode', value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="host-controlled">
                      Host Controlled - Only you can change pages
                    </SelectItem>
                    <SelectItem value="anyone-can-control">
                      Anyone Can Control - All participants can change pages
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {formData.syncMode === 'host-controlled'
                    ? 'Only the host can navigate pages. Great for guided reading.'
                    : 'Anyone in the room can navigate pages. Great for casual reading.'}
                </p>
              </div>

              {/* Room Privacy */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  {formData.isPublic ? (
                    <Users className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-purple-400" />
                  )}
                  <div>
                    <Label htmlFor="isPublic" className="text-gray-300 cursor-pointer">
                      {formData.isPublic ? 'Public Room' : 'Private Room'}
                    </Label>
                    <p className="text-xs text-gray-500">
                      {formData.isPublic
                        ? 'Anyone can discover and join this room'
                        : 'Only people with invite link can join'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleChange('isPublic', checked)}
                  disabled={isLoading}
                />
              </div>

              {/* Chat Setting */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <div>
                    <Label htmlFor="allowChat" className="text-gray-300 cursor-pointer">
                      Enable Chat
                    </Label>
                    <p className="text-xs text-gray-500">
                      Allow participants to send messages during reading
                    </p>
                  </div>
                </div>
                <Switch
                  id="allowChat"
                  checked={formData.allowChat}
                  onCheckedChange={(checked) => handleChange('allowChat', checked)}
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={isLoading || !formData.mangaId || !formData.chapterId}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Room'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Visit a manga detail page to easily create a room from there.
          </p>
        </div>
      </div>
    </div>
  );
};
