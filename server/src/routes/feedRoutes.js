import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { uploadImage } from "../lib/cloudinary.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import CommentLike from "../models/CommentLike.js";
import Post from "../models/Post.js";
import PostFavorite from "../models/PostFavorite.js";
import PostLike from "../models/PostLike.js";
import Repost from "../models/Repost.js";
import { buildFeed, normalizePost, resolveRootPost } from "../services/feedService.js";

const router = Router();

router.get(
  "/feed",
  requireAuth,
  asyncHandler(async (req, res) => {
    const items = await buildFeed(req.user._id);
    res.json({ items });
  })
);

router.post(
  "/posts",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rawImages = req.body.images;
    const normalizedImages = Array.isArray(rawImages)
      ? rawImages
      : rawImages && typeof rawImages === "object"
      ? Object.values(rawImages)
      : typeof rawImages === "string"
      ? [rawImages]
      : [];

    const imageInputs = normalizedImages.length > 0
      ? normalizedImages.filter(Boolean)
      : req.body.image
      ? [req.body.image]
      : [];
    const imageUrls = await Promise.all(
      imageInputs.map((image) => uploadImage(image, "mundial-fc/posts"))
    );

    await Post.create({
      authorId: req.user._id,
      text: req.body.text || "",
      imageUrl: imageUrls[0] || "",
      imageUrls,
    });

    const items = await buildFeed(req.user._id);
    res.status(201).json({ items });
  })
);

router.post(
  "/posts/:id/like",
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await resolveRootPost(req.params.id);
    if (!post) throw Object.assign(new Error("Publicacion no encontrada."), { statusCode: 404 });

    const existing = await PostLike.findOne({ userId: req.user._id, postId: post._id });
    if (existing) {
      await existing.deleteOne();
    } else {
      await PostLike.create({ userId: req.user._id, postId: post._id });
    }

    res.json({ items: await buildFeed(req.user._id) });
  })
);

router.post(
  "/posts/:id/favorite",
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await resolveRootPost(req.params.id);
    if (!post) throw Object.assign(new Error("Publicacion no encontrada."), { statusCode: 404 });

    const existing = await PostFavorite.findOne({
      userId: req.user._id,
      postId: post._id,
    });

    if (existing) {
      await existing.deleteOne();
    } else {
      await PostFavorite.create({ userId: req.user._id, postId: post._id });
    }

    res.json({ items: await buildFeed(req.user._id) });
  })
);

router.post(
  "/posts/:id/repost",
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await resolveRootPost(req.params.id);
    if (!post) throw Object.assign(new Error("Publicacion no encontrada."), { statusCode: 404 });

    const existing = await Repost.findOne({ userId: req.user._id, postId: post._id });
    if (existing) {
      await existing.deleteOne();
    } else {
      await Repost.create({ userId: req.user._id, postId: post._id });
    }

    res.json({ items: await buildFeed(req.user._id) });
  })
);

router.post(
  "/posts/:id/comments",
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await resolveRootPost(req.params.id);
    if (!post) throw Object.assign(new Error("Publicacion no encontrada."), { statusCode: 404 });

    const imageUrl = await uploadImage(req.body.image, "mundial-fc/comments");

    await Comment.create({
      postId: post._id,
      authorId: req.user._id,
      text: req.body.text || "",
      imageUrl,
    });

    res.json({ items: await buildFeed(req.user._id) });
  })
);

router.post(
  "/comments/:id/reply",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      throw Object.assign(new Error("Comentario no encontrado."), { statusCode: 404 });
    }

    const imageUrl = await uploadImage(req.body.image, "mundial-fc/comments");

    await Comment.create({
      postId: parentComment.postId,
      parentCommentId: parentComment._id,
      authorId: req.user._id,
      text: req.body.text || "",
      imageUrl,
    });

    res.json({ items: await buildFeed(req.user._id) });
  })
);

router.post(
  "/comments/:id/like",
  requireAuth,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw Object.assign(new Error("Comentario no encontrado."), { statusCode: 404 });
    }

    const existing = await CommentLike.findOne({
      userId: req.user._id,
      commentId: comment._id,
    });

    if (existing) {
      await existing.deleteOne();
    } else {
      await CommentLike.create({ userId: req.user._id, commentId: comment._id });
    }

    res.json({ items: await buildFeed(req.user._id) });
  })
);

router.get(
  "/posts/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await resolveRootPost(req.params.id);
    if (!post) throw Object.assign(new Error("Publicacion no encontrada."), { statusCode: 404 });
    const item = await normalizePost(post, req.user._id);
    res.json({ post: item });
  })
);

router.get(
  "/posts/:id/thread",
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await resolveRootPost(req.params.id);
    if (!post) throw Object.assign(new Error("Publicacion no encontrada."), { statusCode: 404 });
    const item = await normalizePost(post, req.user._id);
    res.json({ post: item, highlightedCommentId: req.query.commentId || "" });
  })
);

export default router;
