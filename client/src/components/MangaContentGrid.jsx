import { Book, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function MangaContentGrid({ mangaList }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mangaList.map((manga, index) => (
        <Card
          key={index}
          className="group bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-0 sm:h-[80%] md:h-[65%] lg:h-[50%]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
              <img
                src={manga.image}
                alt={manga.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:blur-sm"
              />
              <div className="absolute inset-0 group-hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                >
                  <Book className="w-4 h-4 mr-1" />
                  Read
                </Button>
              </div>
            </div>
            <div className="p-2">
              <div className="mb-3">
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                  {manga.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-1">
                  {manga.episodeTitle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
