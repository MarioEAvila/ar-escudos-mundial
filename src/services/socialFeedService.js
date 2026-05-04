const POSTS_KEY = "scanner_app_social_posts";

function readPosts() {
  const data = localStorage.getItem(POSTS_KEY);
  return data ? JSON.parse(data) : [];
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function getDisplayName(user) {
  return `${user?.name || ""} ${user?.lastName || ""}`.trim() || "Usuario";
}

function getUsername(user) {
  return user?.username ? `@${user.username}` : "@usuario";
}

function getPosts() {
  return readPosts();
}

function createPost(user, postData) {
  const post = {
    id: crypto.randomUUID(),
    type: "post",
    authorId: user.id,
    author: getDisplayName(user),
    username: getUsername(user),
    authorPhoto: user.profilePhoto || "",
    verified: false,
    createdAt: new Date().toISOString(),
    text: postData.text || "",
    image: postData.image || "",
    likesBy: [],
    favoriteBy: [],
    comments: [],
    shares: 0,
  };

  const posts = [post, ...readPosts()];
  savePosts(posts);
  return posts;
}

function toggleId(list, id) {
  return list.includes(id)
    ? list.filter((itemId) => itemId !== id)
    : [...list, id];
}

function updatePost(postId, updater) {
  const posts = readPosts().map((post) =>
    post.id === postId ? updater(post) : post
  );

  savePosts(posts);
  return posts;
}

function toggleLike(postId, userId) {
  return updatePost(postId, (post) => ({
    ...post,
    likesBy: toggleId(post.likesBy || [], userId),
  }));
}

function toggleFavorite(postId, userId) {
  return updatePost(postId, (post) => ({
    ...post,
    favoriteBy: toggleId(post.favoriteBy || [], userId),
  }));
}

function sharePost(postId) {
  return updatePost(postId, (post) => ({
    ...post,
    shares: (post.shares || 0) + 1,
  }));
}

function addComment(postId, user, commentData) {
  const comment = {
    id: crypto.randomUUID(),
    postId,
    authorId: user.id,
    author: getDisplayName(user),
    username: getUsername(user),
    authorPhoto: user.profilePhoto || "",
    text: commentData.text || "",
    image: commentData.image || "",
    createdAt: new Date().toISOString(),
  };

  return updatePost(postId, (post) => ({
    ...post,
    comments: [...(post.comments || []), comment],
  }));
}

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

const socialFeedService = {
  getPosts,
  createPost,
  toggleLike,
  toggleFavorite,
  sharePost,
  addComment,
  formatRelativeTime,
};

export default socialFeedService;
