import React, { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { MangaContentGrid, Pagination } from "@/components";
import { Button } from "@/components/ui/button";
import { useSearchManga } from "@/hooks/useMangaQueries";

const MemoPagination = React.memo(Pagination);

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(query);

  const { data, isLoading, error } = useSearchManga(query, 20, currentPage);
  const mangaList = data?.data || [];
  const totalPages = data?.total ? Math.ceil(data.total / 20) : 1;

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({});
    setCurrentPage(1);
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-20">
            <SearchIcon className="w-20 h-20 mx-auto text-purple-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Search for Manga
            </h2>
            <p className="text-gray-400 mb-8">
              Enter a manga title to start searching
            </p>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search manga by title..."
                className="w-full px-6 py-4 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!searchInput.trim()}
                className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700"
              >
                <SearchIcon className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <section className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-lg">{error.message || "Failed to search manga"}</div>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search manga by title..."
              className="w-full px-6 py-4 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              {searchInput && (
                <Button
                  type="button"
                  onClick={clearSearch}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
              <Button
                type="submit"
                disabled={!searchInput.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <SearchIcon className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Search Results
              {!isLoading && (
                <span className="text-lg font-normal text-purple-300 ml-3">
                  for "{query}"
                </span>
              )}
            </h2>
            {!isLoading && data?.total && (
              <p className="text-gray-400">
                {data.total.toLocaleString()} results found
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-white">Searching...</p>
            </div>
          ) : mangaList.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-400 mb-6">
                Try different keywords or check your spelling
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <>
              <MangaContentGrid mangaList={mangaList} />
              {totalPages > 1 && (
                <div className="mt-8">
                  <MemoPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
