import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getTrendingManga,
  getTopAiringManga,
  getPopularManga,
  getHiddenGemsManga,
  getRecentlyCompletedManga,
} from "../services/mangaService.js";

export const trending = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 10, 10);
  const monthsAgo = Math.max(Number(req.query.monthsAgo) || 12, 12); // optional query param
  const data = await getTrendingManga(limit, monthsAgo);
  res.json(data);
});

export const airing = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 5, 5);
  const data = await getTopAiringManga(limit);
  res.json(data);
});

export const recentlyCompleted = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 5, 5);
  const data = await getRecentlyCompletedManga(limit);
  res.json(data);
});

export const popular = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 5, 5);
  const data = await getPopularManga(limit);
  res.json(data);
});

export const hiddenGems = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 5, 5);
  const data = await getHiddenGemsManga(limit);
  res.json(data);
});
export const collections = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 5, 5);

  const [airingData, popularData, recentlyCompletedData, hiddenGemsData] =
    await Promise.all([
      getTopAiringManga(limit),
      getPopularManga(limit),
      getRecentlyCompletedManga(limit),
      getHiddenGemsManga(limit),
    ]);

  res.json({ airingData, popularData, recentlyCompletedData, hiddenGemsData });
});
