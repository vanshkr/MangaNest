import { Book, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function RecentEpisodes() {
  const mangaList = [
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
        <h2 className="text-2xl font-bold text-white">Latest Episodes</h2>
        <Button
          variant="ghost"
          className="text-purple-400 hover:text-purple-300"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mangaList.map((manga) => (
          <Card
            key={manga.id}
            className="group bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                <img
                  src={manga.image}
                  alt={manga.title}
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
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                  <Badge
                    variant="secondary"
                    className="bg-black/70 text-white text-xs sm:text-sm"
                  >
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 fill-yellow-400 text-yellow-400" />
                    {manga.rating}
                  </Badge>
                </div>
              </div>
              <div className="p-2">
                <div className="mb-3">
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">
                    {manga.title}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-1">
                    {manga.episodeTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>{manga.episode}</span>
                  </div>
                  <span>{manga.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
