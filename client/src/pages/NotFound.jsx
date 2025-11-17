import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            404
          </h1>
          <div className="flex justify-center mt-4">
            <div className="text-6xl">📚❌</div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Looks like this manga page got lost in another dimension.
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="flex items-center gap-2 px-6">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" className="flex items-center gap-2 px-6">
              <Search className="w-4 h-4" />
              Browse Manga
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <Link to="/top-airing" className="text-purple-400 hover:text-purple-300 transition-colors">
              Top Airing
            </Link>
            <Link to="/most-popular" className="text-purple-400 hover:text-purple-300 transition-colors">
              Most Popular
            </Link>
            <Link to="/latest-release" className="text-purple-400 hover:text-purple-300 transition-colors">
              Latest Releases
            </Link>
            <Link to="/hidden-gems" className="text-purple-400 hover:text-purple-300 transition-colors">
              Hidden Gems
            </Link>
            <Link to="/recently-completed" className="text-purple-400 hover:text-purple-300 transition-colors">
              Recently Completed
            </Link>
            <Link to="/search" className="text-purple-400 hover:text-purple-300 transition-colors">
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
