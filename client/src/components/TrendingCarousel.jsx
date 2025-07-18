import { ChevronLeft, ChevronRight, Book, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function TrendingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [trendingManga, setTrendingManga] = useState([]);
  useEffect(() => {
    const fetchTrendingManga = async () => {
      const response = await fetch("http://localhost:3000/api/manga/trending");
      const data = await response.json();
      setTrendingManga(data);
    };
    fetchTrendingManga();
  }, []);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setItemsPerView(1); // Mobile phones (portrait)
      } else if (width < 640) {
        setItemsPerView(1.5); // Mobile phones (landscape) / Small phones
      } else if (width < 768) {
        setItemsPerView(2); // Large mobile / Small tablets
      } else if (width < 1024) {
        setItemsPerView(2.5); // Tablets
      } else if (width < 1280) {
        setItemsPerView(3); // Small laptops
      } else if (width < 1536) {
        setItemsPerView(4); // Laptops / Desktop
      } else if (width < 1920) {
        setItemsPerView(5); // Large desktop
      } else {
        setItemsPerView(6); // TV / Ultra-wide screens
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(
    0,
    trendingManga?.length - Math.floor(itemsPerView)
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          Trending Now
        </h2>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-2 sm:gap-3 lg:gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(trendingManga?.length / itemsPerView) * 100}%`,
          }}
        >
          {trendingManga?.map((manga, index) => (
            <div
              key={manga.id}
              className="flex-shrink-0"
              style={{ width: `${100 / trendingManga?.length}%` }}
            >
              <Card className="group bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden h-full">
                <CardContent className="p-0 relative h-full">
                  <div className="relative aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] overflow-hidden">
                    <img
                      loading="lazy"
                      src={manga.imageUrl}
                      alt={manga.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Rank number - responsive sizing */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4">
                      <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/20 leading-none">
                        {index + 1}
                      </div>
                    </div>

                    {/* Rating badge - responsive sizing */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                      <Badge
                        variant="secondary"
                        className="bg-black/70 text-white text-xs sm:text-sm"
                      >
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 fill-yellow-400 text-yellow-400" />
                        {manga.rating}
                      </Badge>
                    </div>

                    {/* Book button overlay - responsive sizing */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 rounded-full w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                      >
                        <Book className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      </Button>
                    </div>

                    {/* Title at bottom - responsive sizing */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4">
                      <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                        {manga.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Touch/swipe indicators for mobile */}
      <div className="block sm:hidden text-center mt-2">
        <p className="text-xs text-gray-500">Swipe to see more</p>
      </div>
    </section>
  );
}
