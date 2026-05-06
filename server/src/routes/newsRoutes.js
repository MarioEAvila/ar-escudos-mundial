import { Router } from "express";
import axios from "axios";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getNewsArticles } from "../services/newsService.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/image",
  asyncHandler(async (req, res) => {
    const imageUrl = String(req.query.url || "");
    const parsedUrl = new URL(imageUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      const error = new Error("URL de imagen no valida.");
      error.statusCode = 400;
      throw error;
    }

    const response = await axios.get(parsedUrl.toString(), {
      responseType: "arraybuffer",
      timeout: 8000,
    });

    res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Cache-Control", "public, max-age=1800");
    res.send(response.data);
  })
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ articles: await getNewsArticles() });
  })
);

export default router;
