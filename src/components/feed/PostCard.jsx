import { useState } from "react";
import "./PostCard.css";
import socialFeedService from "../../services/socialFeedService";

function PostCard({
  post,
  currentUser,
  onToggleLike,
  onToggleFavorite,
  onShare,
  onAddComment,
}) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState("");

  const liked = currentUser
    ? (post.likesBy || []).includes(currentUser.id)
    : false;
  const favorited = currentUser
    ? (post.favoriteBy || []).includes(currentUser.id)
    : false;
  const likes = post.likesBy?.length || post.likes || 0;
  const comments = post.comments || [];
  const time = post.createdAt
    ? socialFeedService.formatRelativeTime(post.createdAt)
    : post.time;

  const handleCommentImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCommentImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed && !commentImage) return;

    onAddComment?.(post.id, {
      text: trimmed,
      image: commentImage,
    });

    setCommentText("");
    setCommentImage("");
    setShowCommentBox(false);
  };

  return (
    <article className="post-card">
      <div className="post-card__header">
        <div>
          <div className="post-card__author-line">
            <strong>{post.author}</strong>
            {post.verified && <span className="post-card__verified">●</span>}
            <span>{post.username}</span>
            <span>·</span>
            <span>{time}</span>
          </div>
          <p className="post-card__type">
            {post.type === "news" ? "Noticia" : "Publicación"}
          </p>
        </div>
      </div>

      {post.text && <p className="post-card__text">{post.text}</p>}

      {post.image && (
        <div className="post-card__image">
          <img src={post.image} alt="Contenido de publicación" />
        </div>
      )}

      <div className="post-card__actions">
        <button
          className={liked ? "active" : ""}
          onClick={() => onToggleLike?.(post.id)}
        >
          Me gusta {likes}
        </button>

        <button onClick={() => setShowCommentBox((prev) => !prev)}>
          Comentar {comments.length}
        </button>

        <button onClick={() => onShare?.(post.id)}>
          Compartir {post.shares || 0}
        </button>

        <button
          className={favorited ? "active" : ""}
          onClick={() => onToggleFavorite?.(post.id)}
        >
          Favorito
        </button>
      </div>

      {showCommentBox && (
        <div className="post-card__comment-box">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <label className="post-card__comment-image-button">
            Imagen
            <input
              type="file"
              accept="image/*"
              onChange={handleCommentImageChange}
            />
          </label>
          <button onClick={handleComment}>Enviar</button>
        </div>
      )}

      {commentImage && (
        <div className="post-card__comment-preview">
          <img src={commentImage} alt="Vista previa del comentario" />
        </div>
      )}

      {comments.length > 0 && (
        <div className="post-card__comments">
          {comments.slice(-2).map((comment) => (
            <div key={comment.id} className="post-card__comment">
              <div>
                <strong>{comment.author}</strong>
                <span>
                  {socialFeedService.formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              {comment.text && <p>{comment.text}</p>}
              {comment.image && (
                <img src={comment.image} alt="Imagen del comentario" />
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default PostCard;
