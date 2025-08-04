import { Router } from "express";
import {
  trending,
  airing,
  recentlyCompleted,
  collections,
  popular,
  hiddenGems,
  latestReleases,
  mangaDetails,
  chapterPanels,
} from "../controllers/mangaController.js";
const router = Router();

router.get("/trending", trending);
router.get("/collections", collections);
router.get("/top-airing", airing);
router.get("/most-popular", popular);
router.get("/hidden-gems", hiddenGems);
router.get("/recently-completed", recentlyCompleted);
router.get("/latest-releases", latestReleases);
router.get("/:mangaId", mangaDetails);
router.get("/chapters/:chapterId", chapterPanels);
export default router;
