import { useState } from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";
import socialFeedService from "../../services/socialFeedService";
import CommentThread from "./CommentThread";

function PostCard({
  post,
  onToggleLike,
  onToggleFavorite,
  onShare,
  onAddComment,
  onReplyToComment,
  onToggleCommentLike,
  highlightedCommentId = "",
}) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);

  const liked = post.viewer?.liked || false;
  const favorited = post.viewer?.favorited || false;
  const reposted = post.viewer?.reposted || false;
  const time = post.createdAt
    ? socialFeedService.formatRelativeTime(post.createdAt)
    : "";

  const handleCommentImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCommentImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openReplyBox = (comment) => {
    setReplyTarget(comment);
    setShowCommentBox(true);
  };

  const handleComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed && !commentImage) return;

    if (replyTarget) {
      await onReplyToComment?.(replyTarget.id, {
        text: trimmed,
        image: commentImage,
      });
    } else {
      await onAddComment?.(post.actionPostId || post.rootPostId || post.id, {
        text: trimmed,
        image: commentImage,
      });
    }

    setCommentText("");
    setCommentImage("");
    setReplyTarget(null);
    setShowCommentBox(false);
  };

  return (
    <article className="post-card">
      {post.type === "repost" && (
        <p className="post-card__badge">
          {post.author?.displayName || post.authorName} reposteó
        </p>
      )}

      <div className="post-card__header">
        <div>
          <div className="post-card__author-line">
            <strong>{post.originalAuthor?.displayName || post.author?.displayName || post.authorName}</strong>
            <span>@{post.originalAuthor?.username || post.author?.username || post.authorUsername}</span>
            <span>·</span>
            <span>{time}</span>
          </div>
          <p className="post-card__type">
            {post.type === "repost" ? "Publicacion compartida" : "Publicacion"}
          </p>
        </div>
      </div>

      <Link className="post-card__body-link" to={`/post/${post.rootPostId || post.id}`}>
        {post.text && <p className="post-card__text">{post.text}</p>}

        {post.imageUrl && (
          <div className="post-card__image">
            <img src={post.imageUrl} alt="Contenido de publicacion" />
          </div>
        )}
      </Link>

      <div className="post-card__actions">
        <button
          className={liked ? "active" : ""}
          onClick={() =>
            onToggleLike?.(post.actionPostId || post.rootPostId || post.id)
          }
          type="button"
        >
          Me gusta {post.stats?.likeCount || 0}
        </button>

        <button type="button" onClick={() => setShowCommentBox((prev) => !prev)}>
          Comentar {post.stats?.commentCount || 0}
        </button>

        <button
          className={reposted ? "active" : ""}
          type="button"
          onClick={() =>
            onShare?.(post.actionPostId || post.rootPostId || post.id)
          }
        >
          Compartir {post.stats?.repostCount || 0}
        </button>

        <button
          className={favorited ? "active" : ""}
          onClick={() =>
            onToggleFavorite?.(post.actionPostId || post.rootPostId || post.id)
          }
          type="button"
        >
          Favorito {post.stats?.favoriteCount || 0}
        </button>
      </div>

      {showCommentBox && (
        <div className="post-card__comment-box">
          <input
            type="text"
            placeholder={
              replyTarget
                ? `Respondiendo a @${replyTarget.author?.username || replyTarget.authorUsername}`
                : "Escribe un comentario..."
            }
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <label className="post-card__comment-image-button">
            Imagen
            <input type="file" accept="image/*" onChange={handleCommentImageChange} />
          </label>
          <button type="button" onClick={handleComment}>
            Enviar
          </button>
        </div>
      )}

      {commentImage && (
        <div className="post-card__comment-preview">
          <img src={commentImage} alt="Vista previa del comentario" />
        </div>
      )}

      {(post.comments?.length || 0) > 0 && (
        <div className="post-card__comments">
          <CommentThread
            postId={post.rootPostId || post.id}
            comments={post.comments}
            highlightedCommentId={highlightedCommentId}
            onReply={openReplyBox}
            onToggleLike={onToggleCommentLike}
          />
        </div>
      )}
    </article>
  );
}

export default PostCard;
