import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { serializeUser } from "../services/serializeUser.js";

const router = Router();

function toggleString(list = [], value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [value, ...list];
}

router.use(requireAuth);

router.post(
  "/favorites/team",
  asyncHandler(async (req, res) => {
    const favoriteTeams = toggleString(req.user.favoriteTeams, req.body.teamId);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { favoriteTeams },
      { new: true }
    );
    res.json({ user: serializeUser(user) });
  })
);

router.post(
  "/favorites/player",
  asyncHandler(async (req, res) => {
    const favoritePlayers = toggleString(req.user.favoritePlayers, req.body.playerId);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { favoritePlayers },
      { new: true }
    );
    res.json({ user: serializeUser(user) });
  })
);

export default router;
