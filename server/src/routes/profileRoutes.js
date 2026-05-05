import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import CommentLike from "../models/CommentLike.js";
import PostFavorite from "../models/PostFavorite.js";
import PostLike from "../models/PostLike.js";
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

    const [comments, commentLikes, postLikes, postFavorites, users] = await Promise.all([
      Comment.find({ authorId: profileUser._id }).sort({ createdAt: -1 }).lean(),
      CommentLike.find({ userId: profileUser._id }).sort({ createdAt: -1 }).lean(),
      PostLike.find({ userId: profileUser._id }).sort({ createdAt: -1 }).lean(),
      PostFavorite.find({ userId: profileUser._id }).sort({ createdAt: -1 }).lean(),
      User.find().lean(),
    ]);

    const commentIds = commentLikes.map((like) => like.commentId);
    const likedComments = commentIds.length
      ? await Comment.find({ _id: { $in: commentIds } }).lean()
      : [];

    const commentById = new Map(likedComments.map((comment) => [String(comment._id), comment]));
    const userById = new Map(users.map((user) => [String(user._id), user]));

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
            commentId: String(like.commentId),
            ...(commentById.get(String(like.commentId))
              ? {
                  postId: String(commentById.get(String(like.commentId)).postId),
                  text: commentById.get(String(like.commentId)).text,
                  parentCommentId: commentById.get(String(like.commentId)).parentCommentId
                    ? String(commentById.get(String(like.commentId)).parentCommentId)
                    : "",
                  commentAuthor:
                    userById.get(String(commentById.get(String(like.commentId)).authorId))
                      ? {
                          username:
                            userById.get(
                              String(commentById.get(String(like.commentId)).authorId)
                            ).username,
                          displayName: `${userById.get(
                            String(commentById.get(String(like.commentId)).authorId)
                          ).name} ${userById.get(
                            String(commentById.get(String(like.commentId)).authorId)
                          ).lastName}`.trim(),
                        }
                      : null,
                }
              : {
                  postId: "",
                  text: "",
                  parentCommentId: "",
                  commentAuthor: null,
                }),
          })),
          postLikes: postLikes.map((like) => ({
            id: String(like._id),
            postId: String(like.postId),
            createdAt: like.createdAt,
          })),
          postFavorites: postFavorites.map((favorite) => ({
            id: String(favorite._id),
            postId: String(favorite.postId),
            createdAt: favorite.createdAt,
          })),
        },
      },
    });
  })
);

export default router;
