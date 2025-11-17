import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const FavoritesContext = createContext({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("manga_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("manga_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (manga) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === manga.id)) {
        return prev;
      }
      toast.success(`Added "${manga.title}" to favorites`);
      return [...prev, { ...manga, addedAt: new Date().toISOString() }];
    });
  };

  const removeFavorite = (mangaId) => {
    setFavorites((prev) => {
      const manga = prev.find((fav) => fav.id === mangaId);
      if (manga) {
        toast.success(`Removed "${manga.title}" from favorites`);
      }
      return prev.filter((fav) => fav.id !== mangaId);
    });
  };

  const isFavorite = (mangaId) => {
    return favorites.some((fav) => fav.id === mangaId);
  };

  const toggleFavorite = (manga) => {
    if (isFavorite(manga.id)) {
      removeFavorite(manga.id);
    } else {
      addFavorite(manga);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
