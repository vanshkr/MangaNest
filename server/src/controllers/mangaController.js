import { asyncHandler } from "../middleware/asyncHandler.js";
import { getTrendingManga } from "../services/mangaService.js";

export const trending = asyncHandler(async (req, res) => {
  const limit = Math.max(Number(req.query.limit) || 10, 10);
  const monthsAgo = Math.max(Number(req.query.monthsAgo) || 12, 12); // optional query param
  const data = await getTrendingManga(limit, monthsAgo);
  res.json(data);
});
