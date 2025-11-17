import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getTrendingManga,
  getTopAiringManga,
  getPopularManga,
  getHiddenGemsManga,
  getRecentlyCompletedManga,
  getLatestReleases,
  getMangaDetails,
  getChapterPanels,
  searchManga,
  browseManga,
} from "../services/mangaService.js";
import { getPaginationParams } from "../utils/pagination.js";

export const trending = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 10, 10);
  const monthsAgo = Math.max(Number(req.query.monthsAgo) || 12, 12); // optional query param
  const data = await getTrendingManga(limit, monthsAgo);
  res.json(data);
});

export const airing = asyncHandler(async (req, res) => {
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;
  const data = await getTopAiringManga(limit, offset, "full");
  res.json(data);
});

export const recentlyCompleted = asyncHandler(async (req, res) => {
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;
  const data = await getRecentlyCompletedManga(limit, offset, "full");
  res.json(data);
});

export const popular = asyncHandler(async (req, res) => {
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;
  const data = await getPopularManga(limit, offset, "full");
  res.json(data);
});

export const hiddenGems = asyncHandler(async (req, res) => {
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;
  const data = await getHiddenGemsManga(limit, offset, "full");
  res.json(data);
});

export const collections = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 5, 5);

  const [airingData, popularData, recentlyCompletedData, hiddenGemsData] =
    await Promise.all([
      getTopAiringManga(limit, 0, "collection"),
      getPopularManga(limit, 0, "collection"),
      getRecentlyCompletedManga(limit, 0, "collection"),
      getHiddenGemsManga(limit, 0, "collection"),
    ]);

  res.json({ airingData, popularData, recentlyCompletedData, hiddenGemsData });
});

export const latestReleases = asyncHandler(async (req, res) => {
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;
  const data = await getLatestReleases(limit, offset);
  res.json(data);
});

export const mangaDetails = asyncHandler(async (req, res) => {
  const mangaId = req.params.mangaId;
  const data = await getMangaDetails(mangaId);
  res.json(data);
});

export const chapterPanels = asyncHandler(async (req, res) => {
  const chapterId = req.params.chapterId;
  const data = await getChapterPanels(chapterId);
  res.json(data);
});

export const search = asyncHandler(async (req, res) => {
  const query = req.query.query;
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;
  const data = await searchManga(query, limit, offset);
  res.json(data);
});

export const browse = asyncHandler(async (req, res) => {
  const { limit, page } = getPaginationParams(req.query.limit, req.query.page);
  const offset = (page - 1) * limit;

  // Parse filters from query params
  const filters = {};

  // Status filter (can be multiple)
  if (req.query.status) {
    filters.status = Array.isArray(req.query.status)
      ? req.query.status
      : [req.query.status];
  }

  // Content rating filter (can be multiple)
  if (req.query.contentRating) {
    filters.contentRating = Array.isArray(req.query.contentRating)
      ? req.query.contentRating
      : [req.query.contentRating];
  }

  // Demographic filter (can be multiple)
  if (req.query.demographic) {
    filters.demographic = Array.isArray(req.query.demographic)
      ? req.query.demographic
      : [req.query.demographic];
  }

  // Year filter (single value)
  if (req.query.year) {
    filters.year = req.query.year;
  }

  // Sort by filter (single value)
  if (req.query.sortBy) {
    filters.sortBy = req.query.sortBy;
  }

  const data = await browseManga(filters, limit, offset);
  res.json(data);
});
