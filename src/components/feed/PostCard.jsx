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
  const [activeImageIndex, setActiveImageIndex] = useState(-1);

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
    setShowCommentBox(false);
  };

  const toggleCommentBox = () => {
    setReplyTarget(null);
    setCommentText("");
    setCommentImage("");
    setShowCommentBox((prev) => !prev);
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

  const closeReplyBox = () => {
    setReplyTarget(null);
    setCommentText("");
    setCommentImage("");
  };

  const openImageViewer = (index) => {
    setActiveImageIndex(index);
  };

  const closeImageViewer = () => {
    setActiveImageIndex(-1);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex <= 0 ? imageUrls.length - 1 : currentIndex - 1
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex >= imageUrls.length - 1 ? 0 : currentIndex + 1
    );
  };

  const imageUrls =
    post.imageUrls && post.imageUrls.length > 0
      ? post.imageUrls
      : post.imageUrl
      ? [post.imageUrl]
      : [];

  const visibleImages = imageUrls.slice(0, 4);
  const extraImages = Math.max(imageUrls.length - 3, 0);

  const postImageLayoutClass =
    visibleImages.length <= 1
      ? "post-card__media-grid--single"
      : visibleImages.length === 2
      ? "post-card__media-grid--two"
      : visibleImages.length === 3
      ? "post-card__media-grid--three"
      : "post-card__media-grid--four";

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
      </Link>

      {imageUrls.length > 0 && (
        <div className={`post-card__media-grid ${postImageLayoutClass}`}>
            {visibleImages.slice(0, imageUrls.length >= 4 ? 3 : 4).map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                className="post-card__image"
                type="button"
                onClick={() => openImageViewer(index)}
              >
                <img src={imageUrl} alt={`Contenido de publicacion ${index + 1}`} />
              </button>
            ))}

            {imageUrls.length > 4 ? (
              <button
                className="post-card__image post-card__image--extra"
                type="button"
                onClick={() => openImageViewer(3)}
              >
                <span>+{extraImages}</span>
              </button>
            ) : (
              imageUrls.length === 4 && (
                <button
                  className="post-card__image"
                  type="button"
                  onClick={() => openImageViewer(3)}
                >
                  <img src={visibleImages[3]} alt="Contenido de publicacion 4" />
                </button>
              )
            )}
        </div>
      )}

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

        <button type="button" onClick={toggleCommentBox}>
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

      {showCommentBox && !replyTarget && (
        <div className="post-card__comment-box">
          <input
            type="text"
            placeholder="Escribe un comentario..."
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

      {showCommentBox && !replyTarget && commentImage && (
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
            activeReplyId={replyTarget?.id || ""}
            replyText={commentText}
            replyImage={commentImage}
            onReplyTextChange={setCommentText}
            onReplyImageChange={handleCommentImageChange}
            onSubmitReply={handleComment}
            onCancelReply={closeReplyBox}
          />
        </div>
      )}

      {activeImageIndex >= 0 && imageUrls[activeImageIndex] && (
        <div className="post-card__viewer" onClick={closeImageViewer}>
          <div className="post-card__viewer-dialog" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="post-card__viewer-close"
              onClick={closeImageViewer}
            >
              Cerrar
            </button>

            <div className="post-card__viewer-stage">
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  className="post-card__viewer-nav"
                  onClick={showPreviousImage}
                >
                  Anterior
                </button>
              )}

              <img
                src={imageUrls[activeImageIndex]}
                alt={`Vista completa ${activeImageIndex + 1}`}
              />

              {imageUrls.length > 1 && (
                <button
                  type="button"
                  className="post-card__viewer-nav"
                  onClick={showNextImage}
                >
                  Siguiente
                </button>
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="post-card__viewer-strip">
                {imageUrls.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}-thumb`}
                    type="button"
                    className={`post-card__viewer-thumb ${
                      activeImageIndex === index ? "active" : ""
                    }`}
                    onClick={() => openImageViewer(index)}
                  >
                    <img src={imageUrl} alt={`Miniatura ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default PostCard;
