import React, { useState, useEffect } from "react";
import { MangaGrid } from "./MangaGrid";

export const MangaSection = () => {
  const [mangaData, setMangaData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangaCollection = async () => {
      const response = await fetch(
        "http://localhost:3000/api/manga/collections"
      );
      const data = await response.json();
      setMangaData(data);
      setLoading(false);
    };
    fetchMangaCollection();
  }, []);

  if (loading) return <div>Loading...</div>;

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
