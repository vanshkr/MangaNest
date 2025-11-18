import { useFavorites } from "@/contexts/FavoritesContext";
import { MangaCard } from "@/components/MangaCard";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();

  // Sort by most recently added
  const sortedFavorites = [...favorites].sort((a, b) =>
    new Date(b.addedAt) - new Date(a.addedAt)
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-400">
            {favorites.length === 0
              ? "You haven't added any favorites yet"
              : `${favorites.length} manga in your favorites`}
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-24 h-24 text-gray-700 mb-6" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Start adding manga to your favorites by clicking the heart icon on any manga detail page.
            </p>
            <Link to="/browse">
              <Button className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Browse Manga
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Favorites Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {sortedFavorites.map((manga) => (
                <div key={manga.id} className="relative group">
                  <MangaCard
                    id={manga.id}
                    title={manga.title}
                    imageUrl={manga.imageUrl}
                  />
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(manga.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  {/* Favorite Indicator */}
                  <div className="absolute top-2 left-2 p-1.5 bg-pink-600/90 rounded-full shadow-lg">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Info Card */}
            <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                About Favorites
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Your favorites are saved locally in your browser</li>
                <li>• They won't sync across different devices or browsers</li>
                <li>• Clearing your browser data will remove your favorites</li>
                <li>• Hover over any manga to quickly remove it from favorites</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
