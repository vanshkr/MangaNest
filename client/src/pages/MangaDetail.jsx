import React, { useState, useEffect } from "react";
import {
  Star,
  BookOpen,
  Calendar,
  User,
  Globe,
  Heart,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Play,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";

export const MangaDetail = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mangaDetails, setMangaDetails] = useState({});
  const [chaptersData, setChaptersData] = useState([]);
  const params = useParams();
  useEffect(() => {
    const fetchMangaDetails = async () => {
      const response = await fetch(
        `http://localhost:3000/api/manga/${params.mangaId}`
      );
      const data = await response.json();
      console.log(params.mangaId, data);
      setMangaDetails(data.details);
      setChaptersData(data.chapters);
    };
    fetchMangaDetails();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${mangaDetails.coverImageUrl}?auto=compress&cs=tinysrgb&w=800)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-purple-900/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end h-full pb-8 gap-6">
            {/* Cover Image */}
            <div className="flex-shrink-0 relative">
              <img
                src={mangaDetails.coverImageUrl}
                alt={mangaDetails.title}
                className="w-48 h-72 md:w-56 md:h-80 object-cover rounded-xl shadow-2xl border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
              />
              {/* Read2gether Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg">
                <Users className="w-3 h-3" />
                <span>Read2gether</span>
              </div>
            </div>

            {/* Title and Quick Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                {mangaDetails.title}
              </h1>
              <p className="text-lg md:text-xl text-purple-200/80 mb-4">
                {mangaDetails.altTitle}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">
                    {mangaDetails.rating}
                  </span>
                  <span className="text-purple-200">/10</span>
                </div>
                <div className="flex items-center gap-1 text-purple-200">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {mangaDetails.follows}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`bg-purple-600 hover:bg-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
                    size="sm"
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isFavorited ? "fill-current" : ""
                      }`}
                    />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                  </Button>

                  <Button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    size="sm"
                    className={`bg-purple-600 hover:bg-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    <Bookmark
                      className={`w-4 h-4 mr-2 ${
                        isBookmarked ? "fill-current" : ""
                      }`}
                    />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>

                  <Button
                    className="bg-purple-600 hover:bg-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                    size="sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Reading
              </Button>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Continue Reading
              </Button>
            </div>

            {/* Synopsis */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 border-purple-500/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Synopsis
                  </h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">
                  {isExpanded
                    ? mangaDetails.desc
                    : mangaDetails?.desc?.slice(0, 300) + "..."}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 p-0 h-auto text-purple-300 hover:text-purple-200 hover:bg-transparent"
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="chapters" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-purple-500/20">
                <TabsTrigger
                  value="chapters"
                  className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  Chapters
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chapters" className="space-y-4">
                <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chaptersData?.map((chapter) => (
                    <Card
                      key={chapter.chapterId}
                      className="bg-slate-800/50 border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className="font-mono border-purple-400/50 text-purple-300"
                              >
                                #{chapter.chapter}
                              </Badge>
                              <div>
                                <h4 className="font-medium text-white">
                                  Chapter {chapter.chapter}
                                </h4>
                                <p className="text-sm text-purple-300">
                                  {chapter.pages} pages • {chapter.date}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-300 hover:text-white hover:bg-purple-600/20"
                            >
                              Read
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white">
                    Reviews Coming Soon
                  </h3>
                  <p className="text-purple-300">
                    User reviews will be available in the next update.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Manga Information */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 border-purple-500/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-base text-white">
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-300">Status</span>
                    <p className="font-medium text-white">
                      {mangaDetails?.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-300">Year</span>
                    <p className="font-medium text-white">
                      {mangaDetails.year}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-300">Chapters</span>
                    <p className="font-medium text-white">
                      {chaptersData?.[0]?.chapter}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-300">Content Rating</span>
                    <p className="font-medium text-white">
                      {mangaDetails?.contentRating}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-300">Content</span>
                    <p className="font-medium text-white">
                      {mangaDetails?.tags?.content?.[0]}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-300">Format</span>
                    <p className="font-medium text-white">
                      {mangaDetails?.tags?.format?.[0]}
                    </p>
                  </div>
                </div>

                <Separator className="bg-purple-500/20" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <div className="text-sm">
                      <span className="text-purple-300">Author: </span>
                      <span className="font-medium text-white">
                        {mangaDetails?.author}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <div className="text-sm">
                      <span className="text-purple-300">Demographic: </span>
                      <span className="font-medium text-white">
                        {mangaDetails?.demographic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div className="text-sm">
                      <span className="text-purple-300">Last Updated: </span>
                      <span className="font-medium text-white">
                        {new Date(
                          mangaDetails.lastUpdated
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 border-purple-500/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-base text-white">Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mangaDetails.tags?.genre?.map((genre) => (
                    <Badge
                      key={genre}
                      className="text-xs bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border-0 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 border-purple-500/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-base text-white">Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mangaDetails.tags?.theme?.map((t) => (
                    <Badge
                      key={t}
                      className="text-xs bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border-0 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
