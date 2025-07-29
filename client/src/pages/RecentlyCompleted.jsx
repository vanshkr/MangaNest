import React, { useEffect, useState, useCallback } from "react";
import { MangaContentGrid, Pagination } from "@/components";
const MemoPagination = React.memo(Pagination);

export const RecentlyCompleted = () => {
  const [mangaList, setMangaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  useEffect(() => {
    const fetchRecentlyCompleted = async (limit, page) => {
      const response = await fetch(
        `http://localhost:3000/api/manga/recently-completed?limit=${limit}&page=${page}`
      );
      const data = await response.json();
      setMangaList(data.data);
      if (total === 1) {
        setTotal(Math.ceil(data.total / limit));
      }
    };
    fetchRecentlyCompleted(40, currentPage);
  }, [currentPage]);

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  return (
    <section className="container mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Recently Completed
        </h2>
      </div>
      <MangaContentGrid mangaList={mangaList} />
      <MemoPagination
        currentPage={currentPage}
        totalPages={total}
        onPageChange={onPageChange}
      />
    </section>
  );
};
