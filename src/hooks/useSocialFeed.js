import { useCallback, useState } from "react";
import socialFeedService from "../services/socialFeedService";

export function useSocialFeed(currentUser) {
  const [posts, setPosts] = useState(() => socialFeedService.getPosts());

  const createPost = useCallback(
    (postData) => {
      if (!currentUser) return;
      setPosts(socialFeedService.createPost(currentUser, postData));
    },
    [currentUser]
  );

  const toggleLike = useCallback(
    (postId) => {
      if (!currentUser) return;
      setPosts(socialFeedService.toggleLike(postId, currentUser.id));
    },
    [currentUser]
  );

  const toggleFavorite = useCallback(
    (postId) => {
      if (!currentUser) return;
      setPosts(socialFeedService.toggleFavorite(postId, currentUser.id));
    },
    [currentUser]
  );

  const sharePost = useCallback((postId) => {
    setPosts(socialFeedService.sharePost(postId));
  }, []);

  const addComment = useCallback(
    (postId, commentData) => {
      if (!currentUser) return;
      setPosts(socialFeedService.addComment(postId, currentUser, commentData));
    },
    [currentUser]
  );

  return {
    posts,
    createPost,
    toggleLike,
    toggleFavorite,
    sharePost,
    addComment,
  };
}
