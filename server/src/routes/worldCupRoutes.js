import { Router } from "express";
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
