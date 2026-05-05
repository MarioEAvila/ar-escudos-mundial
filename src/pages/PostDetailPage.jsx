import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import PostCard from "../components/feed/PostCard";
import socialFeedService from "../services/socialFeedService";

function PostDetailPage({ currentUser, onOpenAR }) {
  const { postId, commentId } = useParams();
  const [thread, setThread] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadThread = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await socialFeedService.getPostThread(postId, commentId);
      setThread(response);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [commentId, postId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  const refreshAfterAction = useCallback(
    async (action) => {
      await action();
      await loadThread();
    },
    [loadThread]
  );

  const handleToggleLike = useCallback(
    async (targetPostId) => {
      await refreshAfterAction(() => socialFeedService.toggleLike(targetPostId));
    },
    [refreshAfterAction]
  );

  const handleToggleFavorite = useCallback(
    async (targetPostId) => {
      await refreshAfterAction(() => socialFeedService.toggleFavorite(targetPostId));
    },
    [refreshAfterAction]
  );

  const handleShare = useCallback(
    async (targetPostId) => {
      await refreshAfterAction(() => socialFeedService.toggleRepost(targetPostId));
    },
    [refreshAfterAction]
  );

  const handleAddComment = useCallback(
    async (targetPostId, commentData) => {
      await refreshAfterAction(() =>
        socialFeedService.addComment(targetPostId, commentData)
      );
    },
    [refreshAfterAction]
  );

  const handleReplyToComment = useCallback(
    async (targetCommentId, commentData) => {
      await refreshAfterAction(() =>
        socialFeedService.replyToComment(targetCommentId, commentData)
      );
    },
    [refreshAfterAction]
  );

  const handleToggleCommentLike = useCallback(
    async (targetCommentId) => {
      await refreshAfterAction(() =>
        socialFeedService.toggleCommentLike(targetCommentId)
      );
    },
    [refreshAfterAction]
  );

  return (
    <AppShell user={currentUser} activeSection="home" onOpenAR={onOpenAR}>
      <section className="page-hero">
        <p>Conversacion focalizada</p>
        <h1>Post</h1>
        <span>Vista dedicada para publicaciones y comentarios dentro del hilo.</span>
      </section>

      {isLoading ? (
        <LoadingPanel text="Cargando hilo..." />
      ) : error ? (
        <EmptyPanel text={error} />
      ) : thread?.post ? (
        <PostCard
          post={thread.post}
          currentUser={currentUser}
          onToggleLike={handleToggleLike}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
          onAddComment={handleAddComment}
          onReplyToComment={handleReplyToComment}
          onToggleCommentLike={handleToggleCommentLike}
          highlightedCommentId={commentId || thread.highlightedCommentId}
        />
      ) : (
        <EmptyPanel text="No se encontro la publicacion solicitada." />
      )}
    </AppShell>
  );
}

export default PostDetailPage;
