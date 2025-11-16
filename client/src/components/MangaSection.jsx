import React, { useState, useEffect } from "react";
import { MangaGrid } from "./MangaGrid";
import { API_ENDPOINTS, fetchWithErrorHandling } from "@/config/api";

export const MangaSection = () => {
  const [mangaData, setMangaData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangaCollection = async () => {
      try {
        const data = await fetchWithErrorHandling(API_ENDPOINTS.collections);
        setMangaData(data);
      } catch (err) {
        console.error("Failed to fetch manga collections:", err);
        setError("Failed to load manga collections");
      } finally {
        setLoading(false);
      }
    };
    fetchMangaCollection();
  }, []);

  if (loading) return <div className="text-white text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-400 text-center py-12">{error}</div>;

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
