import apiClient from "../lib/apiClient";

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (Number.isNaN(date.getTime())) return "Ahora mismo";
  if (diff < minute) return "Ahora mismo";
  if (diff < hour) return `Hace ${Math.floor(diff / minute)} min`;
  if (diff < day) return `Hace ${Math.floor(diff / hour)} h`;
  return `Hace ${Math.floor(diff / day)} d`;
}

async function getFeed() {
  const response = await apiClient.get("/feed");
  return response.data;
}

async function createPost(postData) {
  const response = await apiClient.post("/posts", postData);
  return response.data;
}

async function toggleLike(postId) {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
}

async function toggleFavorite(postId) {
  const response = await apiClient.post(`/posts/${postId}/favorite`);
  return response.data;
}

async function toggleRepost(postId) {
  const response = await apiClient.post(`/posts/${postId}/repost`);
  return response.data;
}

async function addComment(postId, commentData) {
  const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
  return response.data;
}

async function replyToComment(commentId, commentData) {
  const response = await apiClient.post(`/comments/${commentId}/reply`, commentData);
  return response.data;
}

async function toggleCommentLike(commentId) {
  const response = await apiClient.post(`/comments/${commentId}/like`);
  return response.data;
}

async function getPostThread(postId, commentId = "") {
  const url = commentId
    ? `/posts/${postId}/thread?commentId=${commentId}`
    : `/posts/${postId}/thread`;

  const response = await apiClient.get(url);
  return response.data;
}

const socialFeedService = {
  getFeed,
  createPost,
  toggleLike,
  toggleFavorite,
  toggleRepost,
  addComment,
  replyToComment,
  toggleCommentLike,
  getPostThread,
  formatRelativeTime,
};

export default socialFeedService;
