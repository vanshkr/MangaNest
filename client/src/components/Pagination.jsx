import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./ui/button";

export function Pagination({
  currentPage = 1,
  totalPages = 30,
  onPageChange,
  maxVisiblePages = 5,
}) {
  // Calculate the range of pages to display
  const getPageRange = () => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return { pages, startPage, endPage };
  };

  const { pages, startPage, endPage } = getPageRange();

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange && onPageChange(page);
    }
  };
  return (
    <nav className="flex gap-2 items-center justify-center flex-wrap">
      {/* First Page Button */}
      <Button
        variant="ghost"
        className="rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 disabled:opacity-30"
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
        title="First page"
      >
        <ChevronsLeft size={20} />
      </Button>

      {/* Previous Page Button */}
      <Button
        variant="ghost"
        className="rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 disabled:opacity-30"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <ChevronLeft size={20} />
      </Button>

      {/* Show ellipsis if there are pages before the current range */}
      {startPage > 1 && (
        <>
          <Button
            variant="ghost"
            className="rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 text-sm font-bold hover:bg-slate-700/60"
            onClick={() => handlePageClick(1)}
          >
            1
          </Button>
          {startPage > 2 && <span className="text-slate-400 px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "ghost"}
          className={
            page === currentPage
              ? "rounded-full w-12 h-12 bg-pink-300 text-black text-sm font-bold shadow-md hover:bg-pink-400 cursor-default"
              : "rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 text-sm font-bold hover:bg-slate-700/60 transition-colors"
          }
          onClick={() => handlePageClick(page)}
          disabled={page === currentPage}
        >
          {page}
        </Button>
      ))}

      {/* Show ellipsis if there are pages after the current range */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-slate-400 px-2">...</span>
          )}
          <Button
            variant="ghost"
            className="rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 text-sm font-bold hover:bg-slate-700/60"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Page Button */}
      <Button
        variant="ghost"
        className="rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 disabled:opacity-30"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <ChevronRight size={20} />
      </Button>

      {/* Last Page Button */}
      <Button
        variant="ghost"
        className="rounded-full w-12 h-12 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 disabled:opacity-30"
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
        title="Last page"
      >
        <ChevronsRight size={20} />
      </Button>
    </nav>
  );
}
