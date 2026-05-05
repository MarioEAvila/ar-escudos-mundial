import { useCallback, useState } from "react";
import socialFeedService from "../services/socialFeedService";

export function useSocialFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await socialFeedService.getFeed();
      setPosts(response.items || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postData) => {
      const response = await socialFeedService.createPost(postData);
      setPosts(response.items || []);
    },
    []
  );

  const toggleLike = useCallback(
    async (postId) => {
      const response = await socialFeedService.toggleLike(postId);
      setPosts(response.items || []);
    },
    []
  );

  const toggleFavorite = useCallback(
    async (postId) => {
      const response = await socialFeedService.toggleFavorite(postId);
      setPosts(response.items || []);
    },
    []
  );

  const sharePost = useCallback(async (postId) => {
    const response = await socialFeedService.toggleRepost(postId);
    setPosts(response.items || []);
  }, []);

  const addComment = useCallback(
    async (postId, commentData) => {
      const response = await socialFeedService.addComment(postId, commentData);
      setPosts(response.items || []);
    },
    []
  );

  const replyToComment = useCallback(
    async (commentId, commentData) => {
      const response = await socialFeedService.replyToComment(commentId, commentData);
      setPosts(response.items || []);
    },
    []
  );

  const toggleCommentLike = useCallback(
    async (commentId) => {
      const response = await socialFeedService.toggleCommentLike(commentId);
      setPosts(response.items || []);
    },
    []
  );

  return {
    posts,
    isLoading,
    refreshFeed,
    createPost,
    toggleLike,
    toggleFavorite,
    sharePost,
    addComment,
    replyToComment,
    toggleCommentLike,
  };
}
