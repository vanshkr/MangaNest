import React, { useState, useCallback } from "react";
import { MangaContentGrid, Pagination } from "@/components";
import { useRecentlyCompletedManga } from "@/hooks/useMangaQueries";
const MemoPagination = React.memo(Pagination);

export const RecentlyCompleted = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useRecentlyCompletedManga(40, currentPage);

  const mangaList = data?.data || [];
  const total = data?.total ? Math.ceil(data.total / 40) : 1;

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400 text-lg">{error.message}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Recently Completed
        </h2>
      </div>
      {isLoading ? (
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
