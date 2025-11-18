import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrowseManga } from "@/hooks/useMangaQueries";
import { MangaCard } from "@/components/MangaCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export const MangaBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    status: [],
    contentRating: ["safe", "suggestive"], // Default to safe content
    demographic: [],
    year: "",
    sortBy: "rating", // Default sort by rating
  });

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters = {
      status: searchParams.getAll("status"),
      contentRating: searchParams.getAll("contentRating"),
      demographic: searchParams.getAll("demographic"),
      year: searchParams.get("year") || "",
      sortBy: searchParams.get("sortBy") || "rating",
    };

    // Only update if there are URL params
    if (
      urlFilters.status.length > 0 ||
      urlFilters.contentRating.length > 0 ||
      urlFilters.demographic.length > 0 ||
      urlFilters.year ||
      urlFilters.sortBy !== "rating"
    ) {
      setFilters(urlFilters);
    }

    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  // Fetch manga with filters
  const { data, isLoading, error } = useBrowseManga(filters, 20, currentPage);
  const mangaList = data?.data || [];
  const totalPages = data?.total ? Math.ceil(data.total / 20) : 1;

  // Update URL when filters change
  const updateURL = (newFilters, page = 1) => {
    const params = new URLSearchParams();

    newFilters.status.forEach((s) => params.append("status", s));
    newFilters.contentRating.forEach((cr) => params.append("contentRating", cr));
    newFilters.demographic.forEach((d) => params.append("demographic", d));

    if (newFilters.year) params.append("year", newFilters.year);
    if (newFilters.sortBy) params.append("sortBy", newFilters.sortBy);
    if (page > 1) params.append("page", page);

    setSearchParams(params);
  };

  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => {
      let newFilters;
      if (filterType === "status" || filterType === "contentRating" || filterType === "demographic") {
        // Array filters
        newFilters = {
          ...prev,
          [filterType]: checked
            ? [...prev[filterType], value]
            : prev[filterType].filter((v) => v !== value),
        };
      } else {
        // Single value filters
        newFilters = {
          ...prev,
          [filterType]: value,
        };
      }
      updateURL(newFilters, 1);
      setCurrentPage(1);
      return newFilters;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL(filters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: [],
      contentRating: ["safe", "suggestive"],
      demographic: [],
      year: "",
      sortBy: "rating",
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    updateURL(defaultFilters, 1);
  };

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-purple-400 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const CheckboxFilter = ({ id, label, checked, onChange }) => (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm text-gray-300 cursor-pointer">
        {label}
      </Label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Browse Manga
            </h1>
            <p className="text-gray-400 text-sm">
              {data?.total ? `${data.total.toLocaleString()} manga found` : "Loading..."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`w-full lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Clear All
                </Button>
              </div>

              {/* Sort By */}
              <FilterSection title="Sort By">
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="follows">Most Popular</SelectItem>
                    <SelectItem value="year">Latest Year</SelectItem>
                    <SelectItem value="updated">Recently Updated</SelectItem>
                    <SelectItem value="created">Newly Added</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </FilterSection>

              {/* Publication Status */}
              <FilterSection title="Publication Status">
                <CheckboxFilter
                  id="status-ongoing"
                  label="Ongoing"
                  checked={filters.status.includes("ongoing")}
                  onChange={(checked) => handleFilterChange("status", "ongoing", checked)}
                />
                <CheckboxFilter
                  id="status-completed"
                  label="Completed"
                  checked={filters.status.includes("completed")}
                  onChange={(checked) => handleFilterChange("status", "completed", checked)}
                />
                <CheckboxFilter
                  id="status-hiatus"
                  label="Hiatus"
                  checked={filters.status.includes("hiatus")}
                  onChange={(checked) => handleFilterChange("status", "hiatus", checked)}
                />
                <CheckboxFilter
                  id="status-cancelled"
                  label="Cancelled"
                  checked={filters.status.includes("cancelled")}
                  onChange={(checked) => handleFilterChange("status", "cancelled", checked)}
                />
              </FilterSection>

              {/* Content Rating */}
              <FilterSection title="Content Rating">
                <CheckboxFilter
                  id="rating-safe"
                  label="Safe"
                  checked={filters.contentRating.includes("safe")}
                  onChange={(checked) => handleFilterChange("contentRating", "safe", checked)}
                />
                <CheckboxFilter
                  id="rating-suggestive"
                  label="Suggestive"
                  checked={filters.contentRating.includes("suggestive")}
                  onChange={(checked) => handleFilterChange("contentRating", "suggestive", checked)}
                />
                <CheckboxFilter
                  id="rating-erotica"
                  label="Erotica"
                  checked={filters.contentRating.includes("erotica")}
                  onChange={(checked) => handleFilterChange("contentRating", "erotica", checked)}
                />
                <CheckboxFilter
                  id="rating-pornographic"
                  label="Pornographic"
                  checked={filters.contentRating.includes("pornographic")}
                  onChange={(checked) => handleFilterChange("contentRating", "pornographic", checked)}
                />
              </FilterSection>

              {/* Demographic */}
              <FilterSection title="Demographic">
                <CheckboxFilter
                  id="demo-shounen"
                  label="Shounen"
                  checked={filters.demographic.includes("shounen")}
                  onChange={(checked) => handleFilterChange("demographic", "shounen", checked)}
                />
                <CheckboxFilter
                  id="demo-shoujo"
                  label="Shoujo"
                  checked={filters.demographic.includes("shoujo")}
                  onChange={(checked) => handleFilterChange("demographic", "shoujo", checked)}
                />
                <CheckboxFilter
                  id="demo-seinen"
                  label="Seinen"
                  checked={filters.demographic.includes("seinen")}
                  onChange={(checked) => handleFilterChange("demographic", "seinen", checked)}
                />
                <CheckboxFilter
                  id="demo-josei"
                  label="Josei"
                  checked={filters.demographic.includes("josei")}
                  onChange={(checked) => handleFilterChange("demographic", "josei", checked)}
                />
              </FilterSection>

              {/* Year Filter */}
              <FilterSection title="Publication Year">
                <Input
                  type="number"
                  placeholder="e.g. 2024"
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading manga...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold mb-2">Failed to load manga</h2>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !error && (
              <>
                {mangaList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Filter className="w-16 h-16 text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No manga found</h2>
                    <p className="text-gray-400 mb-4">Try adjusting your filters</p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {mangaList.map((manga) => (
                        <MangaCard
                          key={manga.id}
                          id={manga.id}
                          title={manga.title}
                          imageUrl={manga.imageUrl}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-12">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-2">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
