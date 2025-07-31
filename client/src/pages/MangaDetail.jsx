import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Book,
  Plus,
  Star,
  Calendar,
  Clock,
  Users,
  Play,
  Share2,
  Bookmark,
  Heart,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        // Mock data for now - replace with actual API call
        const mockManga = {
          id: id,
          title: "One Piece",
          altTitle: "ワンピース",
          japanese: "ONE PIECE",
          synonyms: "OP",
          aired: "Oct 20, 1999 to ?",
          premiered: "Fall 1999",
          duration: "24m",
          status: "Currently Airing",
          malScore: 8.62,
          rating: "PG-13",
          episodes: 1137,
          chapters: 1122,
          type: "TV",
          genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Shounen", "Super Power"],
          studios: "Toei Animation",
          producers: ["Fuji TV", "TAP", "Shueisha", "Toei Animation", "Funimation", "4Kids Entertainment"],
          description: `Gold Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.

Enter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy's reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.`,
          imageUrl: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400",
          backgroundImage: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200",
          shareCount: 299,
        };
        
        setManga(mockManga);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch manga details:", error);
        setLoading(false);
      }
    };

    fetchMangaDetail();
  }, [id]);

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: manga?.title,
        text: `Check out ${manga?.title} on MangaNest`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading manga details...</div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Manga not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={manga.backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <nav className="flex items-center space-x-2 text-sm text-gray-300">
            <span className="hover:text-purple-400 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-purple-400 cursor-pointer">Manga</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{manga.title}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={manga.imageUrl}
                    alt={manga.title}
                    className="w-48 md:w-64 h-64 md:h-80 object-cover rounded-xl shadow-2xl border-2 border-purple-500/20"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16"
                    >
                      <Eye className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  {/* Watch2gether Badge */}
                  <div className="absolute -bottom-2 -left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Watch2gether</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {manga.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-4">
                    {manga.altTitle}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                    {manga.rating}
                  </Badge>
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                    HD
                  </Badge>
                  <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30 flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{manga.episodes}</span>
                  </Badge>
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 flex items-center space-x-1">
                    <Book className="w-3 h-3" />
                    <span>{manga.chapters}</span>
                  </Badge>
                  <Badge className="bg-gray-600/20 text-gray-300 border-gray-500/30">
                    {manga.type}
                  </Badge>
                  <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/30 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{manga.duration}</span>
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Read now</span>
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWatchlistToggle}
                    className={`border-purple-500/50 hover:bg-purple-600/20 flex items-center space-x-2 ${
                      isInWatchlist ? 'bg-purple-600/20 text-purple-300' : 'text-white'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span>{isInWatchlist ? 'In List' : 'Add to List'}</span>
                  </Button>

                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={handleLikeToggle}
                    className={`hover:bg-red-600/20 flex items-center space-x-2 ${
                      isLiked ? 'text-red-400' : 'text-gray-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>

                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={handleShare}
                    className="text-gray-300 hover:bg-gray-600/20 flex items-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">{manga.shareCount}</span>
                  </Button>
                </div>

                {/* Description Preview */}
                <div className="hidden md:block">
                  <p className="text-gray-300 text-base leading-relaxed line-clamp-3 max-w-3xl">
                    {manga.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {manga.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20 cursor-pointer transition-colors"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">Japanese:</span>
                    <span className="text-white text-right">{manga.japanese}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">Synonyms:</span>
                    <span className="text-white text-right">{manga.synonyms}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">Aired:</span>
                    <span className="text-white text-right">{manga.aired}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">Premiered:</span>
                    <span className="text-white text-right">{manga.premiered}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">Duration:</span>
                    <span className="text-white text-right">{manga.duration}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">Status:</span>
                    <span className="text-green-400 text-right">{manga.status}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 font-medium">MAL Score:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{manga.malScore}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Production</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 font-medium block mb-1">Studios:</span>
                    <span className="text-white">{manga.studios}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block mb-1">Producers:</span>
                    <div className="flex flex-wrap gap-1">
                      {manga.producers.map((producer, index) => (
                        <span key={producer} className="text-white">
                          {producer}
                          {index < manga.producers.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">Share Manga</h3>
                    <p className="text-gray-400 text-sm">to your friends</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{manga.shareCount}</span>
                    <Button
                      size="sm"
                      onClick={handleShare}
                      className="bg-green-600 hover:bg-green-700 rounded-full px-4"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};