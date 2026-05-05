import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getNewsArticles } from "../services/newsService.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ articles: await getNewsArticles() });
  })
);

export default router;
