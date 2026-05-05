import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import CommentLike from "../models/CommentLike.js";
import User from "../models/User.js";
import { serializeUser } from "../services/serializeUser.js";

const router = Router();

router.get(
  "/:username",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profileUser = await User.findOne({
      username: req.params.username.toLowerCase(),
    });

    if (!profileUser) {
      throw Object.assign(new Error("Perfil no encontrado."), { statusCode: 404 });
    }

    const [comments, commentLikes] = await Promise.all([
      Comment.find({ authorId: profileUser._id }).sort({ createdAt: -1 }).lean(),
      CommentLike.find({ userId: profileUser._id }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      profile: {
        ...serializeUser(profileUser),
        memberSinceLabel: new Date(profileUser.createdAt).toLocaleDateString("es-MX"),
        activity: {
          comments: comments.map((comment) => ({
            id: String(comment._id),
            text: comment.text,
            createdAt: comment.createdAt,
            postPreview: "Comentario en publicacion",
          })),
          commentLikes: commentLikes.map((like) => ({
            id: String(like._id),
            createdAt: like.createdAt,
            commentPreview: "Le gusto un comentario",
          })),
        },
      },
    });
  })
);

export default router;
