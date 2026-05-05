import Comment from "../models/Comment.js";
import CommentLike from "../models/CommentLike.js";
import Post from "../models/Post.js";
import PostFavorite from "../models/PostFavorite.js";
import PostLike from "../models/PostLike.js";
import Repost from "../models/Repost.js";
import User from "../models/User.js";

function idsMatch(a, b) {
  return String(a) === String(b);
}

function indexById(items) {
  return new Map(items.map((item) => [String(item._id), item]));
}

async function buildCommentTree(postId, viewerId) {
  const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).lean();
  const authorIds = [...new Set(comments.map((comment) => String(comment.authorId)))];
  const authors = await User.find({ _id: { $in: authorIds } }).lean();
  const authorsById = indexById(authors);
  const likes = await CommentLike.find({
    commentId: { $in: comments.map((comment) => comment._id) },
  }).lean();

  const likesByComment = likes.reduce((map, like) => {
    const key = String(like.commentId);
    const current = map.get(key) || [];
    current.push(like);
    map.set(key, current);
    return map;
  }, new Map());

  const commentsById = new Map();
  const roots = [];

  comments.forEach((comment) => {
    const commentLikes = likesByComment.get(String(comment._id)) || [];
    const author = authorsById.get(String(comment.authorId));

    commentsById.set(String(comment._id), {
      id: String(comment._id),
      postId: String(comment.postId),
      parentCommentId: comment.parentCommentId ? String(comment.parentCommentId) : "",
      author: author
        ? {
            id: String(author._id),
            username: author.username,
            displayName: `${author.name} ${author.lastName}`.trim(),
          }
        : null,
      authorUsername: author?.username || "usuario",
      authorName: author ? `${author.name} ${author.lastName}`.trim() : "Usuario",
      text: comment.text,
      imageUrl: comment.imageUrl,
      createdAt: comment.createdAt,
      likeCount: commentLikes.length,
      viewerLiked: viewerId
        ? commentLikes.some((like) => idsMatch(like.userId, viewerId))
        : false,
      replies: [],
      replyingTo: null,
    });
  });

  comments.forEach((comment) => {
    const current = commentsById.get(String(comment._id));

    if (comment.parentCommentId) {
      const parent = commentsById.get(String(comment.parentCommentId));
      if (parent) {
        current.replyingTo = {
          authorUsername: parent.authorUsername,
        };
        parent.replies.push(current);
        return;
      }
    }

    roots.push(current);
  });

  return roots;
}

function buildViewerState({
  postId,
  viewerId,
  likes,
  favorites,
  reposts,
}) {
  if (!viewerId) {
    return { liked: false, favorited: false, reposted: false };
  }

  return {
    liked: likes.some((like) => idsMatch(like.postId, postId) && idsMatch(like.userId, viewerId)),
    favorited: favorites.some(
      (favorite) => idsMatch(favorite.postId, postId) && idsMatch(favorite.userId, viewerId)
    ),
    reposted: reposts.some(
      (repost) => idsMatch(repost.postId, postId) && idsMatch(repost.userId, viewerId)
    ),
  };
}

export async function normalizePost(post, viewerId, options = {}) {
  const [author, likes, favorites, reposts, comments] = await Promise.all([
    User.findById(post.authorId).lean(),
    PostLike.find({ postId: post._id }).lean(),
    PostFavorite.find({ postId: post._id }).lean(),
    Repost.find({ postId: post._id }).lean(),
    buildCommentTree(post._id, viewerId),
  ]);

  const viewer = buildViewerState({
    postId: post._id,
    viewerId,
    likes,
    favorites,
    reposts,
  });

  const base = {
    id: options.itemId || String(post._id),
    actionPostId: String(post._id),
    rootPostId: String(post._id),
    type: options.type || "original",
    author: options.author || {
      id: String(author?._id),
      username: author?.username || "usuario",
      displayName: `${author?.name || ""} ${author?.lastName || ""}`.trim() || "Usuario",
    },
    originalAuthor: {
      id: String(author?._id),
      username: author?.username || "usuario",
      displayName: `${author?.name || ""} ${author?.lastName || ""}`.trim() || "Usuario",
    },
    authorName: `${author?.name || ""} ${author?.lastName || ""}`.trim() || "Usuario",
    authorUsername: author?.username || "usuario",
    text: post.text,
    imageUrl: post.imageUrl,
    imageUrls:
      post.imageUrls && post.imageUrls.length > 0
        ? post.imageUrls
        : post.imageUrl
        ? [post.imageUrl]
        : [],
    createdAt: options.createdAt || post.createdAt,
    comments,
    stats: {
      likeCount: likes.length,
      favoriteCount: favorites.length,
      repostCount: reposts.length,
      commentCount: countComments(comments),
    },
    viewer,
  };

  return base;
}

function countComments(comments) {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies || []), 0);
}

export async function buildFeed(viewerId) {
  const [posts, reposts, users] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).lean(),
    Repost.find().sort({ createdAt: -1 }).lean(),
    User.find().lean(),
  ]);

  const usersById = indexById(users);
  const feedItems = await Promise.all([
    ...posts.map((post) => normalizePost(post, viewerId)),
    ...reposts.map(async (repost) => {
      const post = posts.find((item) => idsMatch(item._id, repost.postId)) ||
        (await Post.findById(repost.postId).lean());
      const reposter = usersById.get(String(repost.userId)) ||
        (await User.findById(repost.userId).lean());

      return normalizePost(post, viewerId, {
        itemId: String(repost._id),
        type: "repost",
        createdAt: repost.createdAt,
        author: {
          id: String(reposter?._id),
          username: reposter?.username || "usuario",
          displayName:
            `${reposter?.name || ""} ${reposter?.lastName || ""}`.trim() || "Usuario",
        },
      });
    }),
  ]);

  return feedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function resolveRootPost(id) {
  const post = await Post.findById(id);
  if (post) return post;

  const repost = await Repost.findById(id);
  if (!repost) return null;

  return Post.findById(repost.postId);
}
