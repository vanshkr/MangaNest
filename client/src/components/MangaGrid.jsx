import { Book, Calendar, Clapperboard, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function MangaGrid({ title }) {
  const mangaList = [
    {
      id: 1,
      title: "Demon Slayer",
      image:
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      rating: 9.1,
      year: 2023,
      episodes: 24,
      status: "Completed",
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      image:
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      rating: 8.9,
      year: 2023,
      episodes: 12,
      status: "Ongoing",
    },
    {
      id: 3,
      title: "One Piece",
      image:
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      rating: 9.5,
      year: 2023,
      episodes: 1000,
      status: "Ongoing",
    },
    {
      id: 4,
      title: "Naruto Shippuden",
      image:
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      rating: 8.7,
      year: 2023,
      episodes: 500,
      status: "Completed",
    },
    {
      id: 5,
      title: "My Hero Academia",
      image:
        "https://images.pexels.com/photos/1591063/pexels-photo-1591063.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      rating: 8.8,
      year: 2023,
      episodes: 138,
      status: "Ongoing",
    },
  ];

  return (
    <section>
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-2xl font-bold text-amber-300">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mangaList.map((episode) => (
          <div
            key={episode.id}
            className="group bg-inherit border-0 border-b border-gray-500 rounded-none transition-all duration-300"
          >
            <div className="p-1">
              <div className="flex">
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <img
                    src={episode.image}
                    alt={episode.title}
                    className="w-16 h-20 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-md">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Book className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">
                        {episode.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{episode.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="text-white text-md mt-4">
        View All
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </section>
  );
}
