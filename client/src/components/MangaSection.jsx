import React from "react";
import { MangaGrid } from "./MangaGrid";
import { useMangaCollections } from "@/hooks/useMangaQueries";

export const MangaSection = () => {
  const { data: mangaData, isLoading, error } = useMangaCollections();

  if (isLoading) return <div className="text-white text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-400 text-center py-12">{error.message}</div>;

  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MangaGrid
        title="Top Airing"
        mangaList={mangaData.airingData.data}
        link="/top-airing"
      />
      <MangaGrid
        title="Most Popular"
        mangaList={mangaData.popularData.data}
        link="/most-popular"
      />
      <MangaGrid
        title="Hidden Gems"
        mangaList={mangaData.hiddenGemsData.data}
        link="/hidden-gems"
      />
      <MangaGrid
        title="Recently Completed"
        mangaList={mangaData.recentlyCompletedData.data}
        link="/recently-completed"
      />
    </div>
  );
};
