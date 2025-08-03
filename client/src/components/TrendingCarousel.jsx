import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Mousewheel, Autoplay } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Star,
  TrendingUp,
  Crown,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/free-mode";
import { useNavigate } from "react-router-dom";

export function TrendingCarousel() {
  const [trendingManga, setTrendingManga] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingManga = async () => {
      const response = await fetch("http://localhost:3000/api/manga/trending");
      const data = await response.json();
      setTrendingManga(data);
    };
    fetchTrendingManga();
  }, []);

  const handlePrevSlide = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  if (!trendingManga.length) {
    return (
      <section className="relative">
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-lg">Loading trending manga...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl backdrop-blur-sm border border-purple-500/30">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Trending Now
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevSlide}
            className="text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 p-1.5 sm:p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextSlide}
            className="text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 p-1.5 sm:p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel, Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          freeMode={true}
          mousewheel={{
            forceToAxis: true,
          }}
          speed={500}
          onSwiper={setSwiperRef}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
            1536: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
            1920: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
          className="w-full"
        >
          {trendingManga.map((manga, index) => (
            <SwiperSlide key={manga.id}>
              <Card className="group bg-gradient-to-br from-gray-900/60 to-gray-800/40 border-gray-700/50 hover:border-purple-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden h-full backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-0 relative h-full">
                  <div className="relative aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] overflow-hidden">
                    <img
                      loading="lazy"
                      src={manga.imageUrl}
                      alt={manga.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-70"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Rank number - responsive sizing */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4">
                      <div className="relative">
                        <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-br from-purple-200 to-purple-400 bg-clip-text text-transparent leading-none drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">
                          #{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Rating badge - responsive sizing */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-white text-xs sm:text-sm backdrop-blur-md border border-yellow-400/30 font-bold"
                      >
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 fill-yellow-400 text-yellow-400 animate-pulse" />
                        {manga.rating}
                      </Badge>
                    </div>

                    {/* Book button overlay - responsive sizing */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300"
                      >
                        <Book className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 drop-shadow-lg" />
                      </Button>
                    </div>

                    {/* Title at bottom - responsive sizing */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4">
                      <h3
                        className="text-white font-bold text-sm sm:text-base lg:text-lg leading-tight group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 drop-shadow-lg cursor-pointer"
                        onClick={() => {
                          navigate(`/manga/${manga.id}`);
                        }}
                      >
                        {manga.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
