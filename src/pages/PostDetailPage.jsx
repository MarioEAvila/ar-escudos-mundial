import { useEffect, useState } from "react";
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

  useEffect(() => {
    let mounted = true;

    const loadThread = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await socialFeedService.getPostThread(postId, commentId);
        if (!mounted) return;
        setThread(response);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadThread();

    return () => {
      mounted = false;
    };
  }, [commentId, postId]);

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
          highlightedCommentId={commentId || thread.highlightedCommentId}
        />
      ) : (
        <EmptyPanel text="No se encontro la publicacion solicitada." />
      )}
    </AppShell>
  );
}

export default PostDetailPage;
