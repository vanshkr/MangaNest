import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Plus,
  Star,
  Calendar,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { mangaList } from "@/constants/heroSectionManga";
import { useNavigate } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export const HeroSection = () => {
  const swiperRef = useRef(0);
  const heroSlides = mangaList;
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        loop={true}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              {/* Background Image */}
              <img
                src={slide.backgroundImage}
                alt=""
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 hover:scale-105"
                draggable={false}
              />
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              {/* Content */}
              <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {slide.rating}
                    </Badge>
                    {slide.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <h1
                    className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight cursor-pointer"
                    onClick={() => {
                      navigate(`/manga/${slide.id}`);
                    }}
                  >
                    {slide.title}
                  </h1>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {slide.altTitle}
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-[85%] line-clamp-3">
                    {slide.description}
                  </p>
                  <div className="flex items-center space-x-4 mb-8 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{slide.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{slide.follow}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 cursor-pointer transform transition-transform duration-200 hover:scale-105"
                    >
                      <Book className="w-5 h-5 mr-2" />
                      Read Now
                    </Button>
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 cursor-pointer transform transition-transform duration-200 hover:scale-105"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to List
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Positioned on the right side */}
      <div className="absolute right-6 -bottom-5 transform -translate-y-1/2 z-20 hidden md:flex flex-col space-y-4">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="group w-12 h-12 bg-black/40 hover:bg-purple-600/80 rounded-md flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-purple-400/50 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="group w-12 h-12 bg-black/40 hover:bg-purple-600/80 rounded-md flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-purple-400/50 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" />
        </button>
      </div>

      {/* Custom Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 md:flex-row max-md:bottom-auto max-md:right-6 max-md:top-1/2 max-md:-translate-y-1/2 max-md:left-auto max-md:transform-none max-md:flex-col max-md:space-x-0 max-md:space-y-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              swiperRef.current?.slideToLoop(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              activeIndex === index
                ? "bg-purple-500 shadow-lg shadow-purple-500/50"
                : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
