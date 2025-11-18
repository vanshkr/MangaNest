import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, fetchWithErrorHandling } from "@/config/api";

// Query keys for better cache management
export const queryKeys = {
  trending: (limit, monthsAgo) => ["manga", "trending", { limit, monthsAgo }],
  collections: (limit) => ["manga", "collections", { limit }],
  topAiring: (limit, page) => ["manga", "top-airing", { limit, page }],
  mostPopular: (limit, page) => ["manga", "most-popular", { limit, page }],
  hiddenGems: (limit, page) => ["manga", "hidden-gems", { limit, page }],
  recentlyCompleted: (limit, page) => ["manga", "recently-completed", { limit, page }],
  latestReleases: (limit, page) => ["manga", "latest-releases", { limit, page }],
  mangaDetail: (mangaId) => ["manga", "detail", mangaId],
  chapterPanels: (chapterId) => ["manga", "chapter-panels", chapterId],
  search: (query, limit, page) => ["manga", "search", { query, limit, page }],
  browse: (filters, limit, page) => ["manga", "browse", { filters, limit, page }],
};

/**
 * Hook to fetch trending manga
 * @param {number} limit - Number of manga to fetch
 * @param {number} monthsAgo - How many months ago to fetch from
 */
export const useTrendingManga = (limit = 10, monthsAgo = 12) => {
  return useQuery({
    queryKey: queryKeys.trending(limit, monthsAgo),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.trending}?limit=${limit}&monthsAgo=${monthsAgo}`;
      return await fetchWithErrorHandling(url);
    },
  });
};

/**
 * Hook to fetch manga collections (multiple categories)
 * @param {number} limit - Number of manga per collection
 */
export const useMangaCollections = (limit = 10) => {
  return useQuery({
    queryKey: queryKeys.collections(limit),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.collections}?limit=${limit}`;
      return await fetchWithErrorHandling(url);
    },
  });
};

/**
 * Hook to fetch top airing manga with pagination
 * @param {number} limit - Number of manga per page
 * @param {number} page - Current page number
 */
export const useTopAiringManga = (limit = 40, page = 1) => {
  return useQuery({
    queryKey: queryKeys.topAiring(limit, page),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.topAiring}?limit=${limit}&page=${page}`;
      return await fetchWithErrorHandling(url);
    },
    keepPreviousData: true, // Keep previous data while fetching new page
  });
};

/**
 * Hook to fetch most popular manga with pagination
 * @param {number} limit - Number of manga per page
 * @param {number} page - Current page number
 */
export const useMostPopularManga = (limit = 40, page = 1) => {
  return useQuery({
    queryKey: queryKeys.mostPopular(limit, page),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.mostPopular}?limit=${limit}&page=${page}`;
      return await fetchWithErrorHandling(url);
    },
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch hidden gems manga with pagination
 * @param {number} limit - Number of manga per page
 * @param {number} page - Current page number
 */
export const useHiddenGemsManga = (limit = 40, page = 1) => {
  return useQuery({
    queryKey: queryKeys.hiddenGems(limit, page),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.hiddenGems}?limit=${limit}&page=${page}`;
      return await fetchWithErrorHandling(url);
    },
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch recently completed manga with pagination
 * @param {number} limit - Number of manga per page
 * @param {number} page - Current page number
 */
export const useRecentlyCompletedManga = (limit = 40, page = 1) => {
  return useQuery({
    queryKey: queryKeys.recentlyCompleted(limit, page),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.recentlyCompleted}?limit=${limit}&page=${page}`;
      return await fetchWithErrorHandling(url);
    },
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch latest releases with pagination
 * @param {number} limit - Number of manga per page
 * @param {number} page - Current page number
 */
export const useLatestReleasesManga = (limit = 25, page = 1) => {
  return useQuery({
    queryKey: queryKeys.latestReleases(limit, page),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.latestReleases}?limit=${limit}&page=${page}`;
      return await fetchWithErrorHandling(url);
    },
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch manga details with chapters
 * @param {string} mangaId - Manga ID
 */
export const useMangaDetail = (mangaId) => {
  return useQuery({
    queryKey: queryKeys.mangaDetail(mangaId),
    queryFn: async () => {
      return await fetchWithErrorHandling(API_ENDPOINTS.mangaDetail(mangaId));
    },
    enabled: !!mangaId, // Only fetch if mangaId exists
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch chapter panels/pages
 * @param {string} chapterId - Chapter ID
 */
export const useChapterPanels = (chapterId) => {
  return useQuery({
    queryKey: queryKeys.chapterPanels(chapterId),
    queryFn: async () => {
      return await fetchWithErrorHandling(API_ENDPOINTS.chapterPanels(chapterId));
    },
    enabled: !!chapterId, // Only fetch if chapterId exists
    staleTime: 1000 * 60 * 30, // 30 minutes - chapter pages don't change
  });
};

/**
 * Hook to search manga by title
 * @param {string} query - Search query
 * @param {number} limit - Number of results per page
 * @param {number} page - Current page number
 */
export const useSearchManga = (query, limit = 20, page = 1) => {
  return useQuery({
    queryKey: queryKeys.search(query, limit, page),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.search}?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;
      return await fetchWithErrorHandling(url);
    },
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to browse manga with filters
 * @param {object} filters - Filter options (status, contentRating, demographic, year, sortBy)
 * @param {number} limit - Number of results per page
 * @param {number} page - Current page number
 */
export const useBrowseManga = (filters = {}, limit = 20, page = 1) => {
  return useQuery({
    queryKey: queryKeys.browse(filters, limit, page),
    queryFn: async () => {
      // Build query string from filters
      const params = new URLSearchParams();
      params.append("limit", limit);
      params.append("page", page);

      // Add array filters
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach((s) => params.append("status", s));
      }
      if (filters.contentRating && filters.contentRating.length > 0) {
        filters.contentRating.forEach((cr) => params.append("contentRating", cr));
      }
      if (filters.demographic && filters.demographic.length > 0) {
        filters.demographic.forEach((d) => params.append("demographic", d));
      }

      // Add single value filters
      if (filters.year) {
        params.append("year", filters.year);
      }
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
      }

      const url = `${API_ENDPOINTS.browse}?${params.toString()}`;
      return await fetchWithErrorHandling(url);
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
