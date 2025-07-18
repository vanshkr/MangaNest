import { Book, Calendar, Clapperboard, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function MangaGrid({ title, mangaList }) {
  return (
    <section>
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-2xl font-bold text-amber-300">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mangaList.map((manga) => (
          <div
            key={manga.id}
            className="group bg-inherit border-0 border-b border-gray-500 rounded-none transition-all duration-300"
          >
            <div className="p-1">
              <div className="flex">
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <img
                    src={manga.imageUrl}
                    alt={manga.title}
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
                      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                        {manga.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{manga.year}</span>
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
