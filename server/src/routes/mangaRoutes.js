import { Router } from "express";
import { trending, airing } from "../controllers/mangaController.js";
const router = Router();

router.get("/trending", trending);
router.get("/top-airing", airing);
export default router;
