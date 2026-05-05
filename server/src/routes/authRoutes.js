import bcrypt from "bcryptjs";
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { signToken } from "../lib/auth.js";
import { uploadImage } from "../lib/cloudinary.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { serializeUser } from "../services/serializeUser.js";

const router = Router();

function setSessionCookie(res, userId) {
  res.cookie("token", signToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, username, name, lastName, password, birthday, profilePhoto } =
      req.body;

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existing) {
      const error = new Error("El email o nombre de usuario ya esta en uso.");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uploadedProfilePhoto = await uploadImage(profilePhoto, "mundial-fc/profiles");

    const user = await User.create({
      email,
      username,
      name,
      lastName,
      birthday,
      passwordHash,
      profilePhoto: uploadedProfilePhoto,
    });

    setSessionCookie(res, user._id);
    res.status(201).json({ user: serializeUser(user) });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const error = new Error("Usuario o contraseña incorrectos.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error("Usuario o contraseña incorrectos.");
      error.statusCode = 401;
      throw error;
    }

    setSessionCookie(res, user._id);
    res.json({ user: serializeUser(user) });
  })
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ user: null });
    }

    try {
      await requireAuth(req, res, () => {});
      return res.json({ user: serializeUser(req.user) });
    } catch {
      return res.json({ user: null });
    }
  })
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const updates = {};

    if (typeof req.body.bio === "string") updates.bio = req.body.bio;
    if (typeof req.body.name === "string") updates.name = req.body.name;
    if (typeof req.body.lastName === "string") updates.lastName = req.body.lastName;
    if (typeof req.body.profilePhoto === "string") {
      updates.profilePhoto = await uploadImage(
        req.body.profilePhoto,
        "mundial-fc/profiles"
      );
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    res.json({ user: serializeUser(user) });
  })
);

router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default router;
