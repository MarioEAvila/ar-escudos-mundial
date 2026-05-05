import { Link } from "react-router-dom";
import socialFeedService from "../../services/socialFeedService";

function CommentThread({
  postId,
  comments,
  highlightedCommentId = "",
  depth = 0,
  onReply,
  onToggleLike,
}) {
  if (!comments?.length) return null;

  return (
    <div className={`comment-thread comment-thread--depth-${Math.min(depth, 3)}`}>
      {comments.map((comment) => {
        const hasLongText = (comment.text || "").length > 140;
        const childCount = comment.replies?.length || 0;

        return (
          <article
            key={comment.id}
            className={`post-card__comment ${
              highlightedCommentId === comment.id ? "post-card__comment--highlighted" : ""
            }`}
          >
            <div className="post-card__comment-head">
              <div>
                <strong>{comment.author?.displayName || comment.authorName}</strong>
                <span>@{comment.author?.username || comment.authorUsername}</span>
                <span>{socialFeedService.formatRelativeTime(comment.createdAt)}</span>
              </div>

              <Link
                className="post-card__comment-link"
                to={`/post/${postId}/comment/${comment.id}`}
              >
                Ver hilo
              </Link>
            </div>

            {comment.replyingTo && (
              <p className="post-card__reply-context">
                Responde a @{comment.replyingTo.authorUsername}
              </p>
            )}

            {comment.text && (
              <p className={hasLongText ? "post-card__comment-text post-card__comment-text--clamped" : "post-card__comment-text"}>
                {comment.text}
              </p>
            )}

            {comment.imageUrl && (
              <img src={comment.imageUrl} alt="Comentario" />
            )}

            <div className="post-card__comment-actions">
              <button type="button" onClick={() => onToggleLike?.(comment.id)}>
                Me gusta {comment.likeCount || 0}
              </button>
              <button type="button" onClick={() => onReply?.(comment)}>
                Responder
              </button>
              {childCount > 0 && <span>{childCount} respuestas</span>}
            </div>

            {childCount > 0 && (
              <CommentThread
                postId={postId}
                comments={comment.replies}
                highlightedCommentId={highlightedCommentId}
                depth={depth + 1}
                onReply={onReply}
                onToggleLike={onToggleLike}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}

export default CommentThread;
