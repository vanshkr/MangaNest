import { Book, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function RecentEpisodes() {
  const animeList = [
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba",
      episode: "Episode 12",
      episodeTitle: "The Final Battle",
      image:
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      episode: "Episode 8",
      episodeTitle: "Cursed Technique Reversal",
      image:
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "23 min",
      timeAgo: "5 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 3,
      title: "One Piece",
      episode: "Episode 1095",
      episodeTitle: "The Revolutionary Army Strikes",
      image:
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "1 day ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 4,
      title: "My Hero Academia",
      episode: "Episode 25",
      episodeTitle: "Plus Ultra",
      image:
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 days ago",
      isNew: false,
      rating: 8.9,
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Latest Episodes</h2>
        <Button
          variant="ghost"
          className="text-purple-400 hover:text-purple-300 text-sm sm:text-base"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {animeList.map((anime) => (
          <Card
            key={anime.id}
            className="group bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Book className="w-4 h-4 mr-1" />
                    Read
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-black/70 text-white text-xs"
                  >
                    <Star className="w-2.5 h-2.5 mr-0.5 fill-yellow-400 text-yellow-400" />
                    {anime.rating}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <div className="mb-3">
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                    {anime.title}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-1">
                    {anime.episodeTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{anime.episode}</span>
                  </div>
                  <span className="whitespace-nowrap">{anime.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
