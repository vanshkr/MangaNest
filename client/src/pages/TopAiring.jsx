import React, { useState, useEffect, useCallback } from "react";
import { MangaContentGrid, Pagination } from "@/components";
import { API_ENDPOINTS, fetchWithErrorHandling } from "@/config/api";
const MemoPagination = React.memo(Pagination);

export const TopAiring = () => {
  const [mangaList, setMangaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopAiring = async (limit, page) => {
      try {
        setLoading(true);
        const data = await fetchWithErrorHandling(
          `${API_ENDPOINTS.topAiring}?limit=${limit}&page=${page}`
        );
        setMangaList(data.data);
        if (total === 1) {
          setTotal(Math.ceil(data.total / limit));
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top airing manga:", err);
        setError("Failed to load manga. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopAiring(40, currentPage);
  }, [currentPage]);

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Top Airing
        </h2>
      </div>
      {loading ? (
        <div className="text-white text-center py-12">Loading...</div>
      ) : (
        <>
          <MangaContentGrid mangaList={mangaList} />
          <MemoPagination
            currentPage={currentPage}
            totalPages={total}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
};
