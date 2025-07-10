import React from "react";
import { Badge } from "@/components/ui/badge";
import { Book, Plus, Star, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
export const HeroSection = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/*Background Image*/}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/*Content*/}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <Badge
              variant="secondary"
              className="bg-purple-600/20 text-purple-300 border-purple-500/30"
            >
              <Star className="w-3 h-3 mr-1" />
              9.2
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Action
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Adventure
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Attack on Titan
          </h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Humanity fights for survival against giant humanoid Titans. Eren
            Yeager joins the fight to reclaim the world and discover the truth
            behind the Titans' existence.
          </p>
          <div className="flex items-center space-x-4 mb-8 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>2023</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>24 min</span>
            </div>
            <span>87 Episodes</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 cursor-pointer"
            >
              <Book className="w-5 h-5 mr-2" />
              Watch Now
            </Button>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to List
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
