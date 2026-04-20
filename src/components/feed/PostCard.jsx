import { useState } from "react";
import "./PostCard.css";

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(post.favorite || false);
  const [shared, setShared] = useState(false);
  const [comments, setComments] = useState(post.comments || 0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setComments((prev) => prev + 1);
    setCommentText("");
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
            <span>{post.time}</span>
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
          onClick={() => setLiked((prev) => !prev)}
        >
          Me gusta {post.likes + (liked ? 1 : 0)}
        </button>

        <button onClick={() => setShowCommentBox((prev) => !prev)}>
          Comentar {comments}
        </button>

        <button
          className={shared ? "active" : ""}
          onClick={() => setShared((prev) => !prev)}
        >
          Compartir {post.shares + (shared ? 1 : 0)}
        </button>

        <button
          className={favorited ? "active" : ""}
          onClick={() => setFavorited((prev) => !prev)}
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
          <button onClick={handleComment}>Enviar</button>
        </div>
      )}
    </article>
  );
}

export default PostCard;