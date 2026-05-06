import { Router } from "express";
import axios from "axios";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getFixtures,
  getPlayer,
  getStandings,
  getTeam,
  getTeams,
} from "../services/worldCupService.js";

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

    res.setHeader("Content-Type", response.headers["content-type"] || "image/png");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(response.data);
  })
);

router.get(
  "/teams",
  asyncHandler(async (_req, res) => {
    res.json({ teams: await getTeams() });
  })
);

router.get(
  "/teams/:teamId",
  asyncHandler(async (req, res) => {
    res.json({ team: await getTeam(req.params.teamId) });
  })
);

router.get(
  "/players/:playerId",
  asyncHandler(async (req, res) => {
    res.json({ player: await getPlayer(req.params.playerId) });
  })
);

router.get(
  "/standings",
  asyncHandler(async (_req, res) => {
    res.json({ standings: await getStandings() });
  })
);

router.get(
  "/fixtures",
  asyncHandler(async (_req, res) => {
    res.json({ fixtures: await getFixtures() });
  })
);

export default router;
