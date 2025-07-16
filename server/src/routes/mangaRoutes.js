import { Router } from "express";
import { trending } from "../controllers/mangaController.js";
const router = Router();

router.get("/trending", trending);
export default router;
