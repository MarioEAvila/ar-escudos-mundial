import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import PostCard from "../components/feed/PostCard";
import { useAuth } from "../hooks/useAuth";
import { useSocialFeed } from "../hooks/useSocialFeed";
import profileService from "../services/profileService";
import socialFeedService from "../services/socialFeedService";
import "./ProfilePage.css";

function ProfilePage({ currentUser, onOpenAR }) {
  const { username } = useParams();
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const {
    posts,
    isLoading,
    refreshFeed,
    toggleLike,
    toggleFavorite,
    sharePost,
    addComment,
    replyToComment,
    toggleCommentLike,
  } = useSocialFeed();

  const loadProfile = useMemo(
    () => async (mountedRef = { current: true }) => {
      setIsProfileLoading(true);
      setProfileError("");

      try {
        const response = await profileService.getProfile(
          username || currentUser?.username
        );
        if (!mountedRef.current) return;
        setProfile(response.profile);
      } catch (error) {
        if (!mountedRef.current) return;
        setProfileError(error.message);
      } finally {
        if (mountedRef.current) {
          setIsProfileLoading(false);
        }
      }
    },
    [currentUser?.username, username]
  );

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  useEffect(() => {
    const mountedRef = { current: true };
    loadProfile(mountedRef);

    return () => {
      mountedRef.current = false;
    };
  }, [loadProfile]);

  useEffect(() => {
    if (activeTab !== "likes" && activeTab !== "comments" && activeTab !== "favorites") {
      return;
    }

    const mountedRef = { current: true };
    loadProfile(mountedRef);

    return () => {
      mountedRef.current = false;
    };
  }, [activeTab, loadProfile]);

  const userPosts = useMemo(
    () => posts.filter((post) => post.author?.username === profile?.username),
    [posts, profile?.username]
  );

  const favoritePosts = useMemo(
    () => posts.filter((post) => post.viewer?.favorited),
    [posts]
  );

  const likedPosts = useMemo(() => posts.filter((post) => post.viewer?.liked), [posts]);

  const profileComments = useMemo(() => profile?.activity?.comments || [], [profile?.activity?.comments]);
  const profileCommentLikes = useMemo(
    () => profile?.activity?.commentLikes || [],
    [profile?.activity?.commentLikes]
  );
  const profilePostLikes = useMemo(
    () => profile?.activity?.postLikes || [],
    [profile?.activity?.postLikes]
  );
  const profilePostFavorites = useMemo(
    () => profile?.activity?.postFavorites || [],
    [profile?.activity?.postFavorites]
  );

  const postLikeOrder = useMemo(
    () =>
      new Map(
        profilePostLikes.map((like, index) => [
          like.postId,
          {
            createdAt: like.createdAt,
            order: index,
          },
        ])
      ),
    [profilePostLikes]
  );

  const favoriteOrder = useMemo(
    () =>
      new Map(
        profilePostFavorites.map((favorite, index) => [
          favorite.postId,
          {
            createdAt: favorite.createdAt,
            order: index,
          },
        ])
      ),
    [profilePostFavorites]
  );

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({
        profilePhoto: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const renderPostList = (items, emptyText) =>
    items.length > 0 ? (
      items.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          onToggleLike={toggleLike}
          onToggleFavorite={toggleFavorite}
          onShare={sharePost}
          onAddComment={addComment}
          onReplyToComment={replyToComment}
          onToggleCommentLike={toggleCommentLike}
        />
      ))
    ) : (
      <EmptyPanel text={emptyText} />
    );

  const orderedFavoritePosts = useMemo(() => {
    return [...favoritePosts].sort((a, b) => {
      const favoriteA = favoriteOrder.get(a.actionPostId || a.rootPostId || a.id);
      const favoriteB = favoriteOrder.get(b.actionPostId || b.rootPostId || b.id);
      return new Date(favoriteB?.createdAt || 0) - new Date(favoriteA?.createdAt || 0);
    });
  }, [favoriteOrder, favoritePosts]);

  const orderedLikedPosts = useMemo(() => {
    return [...likedPosts].sort((a, b) => {
      const likeA = postLikeOrder.get(a.actionPostId || a.rootPostId || a.id);
      const likeB = postLikeOrder.get(b.actionPostId || b.rootPostId || b.id);
      return new Date(likeB?.createdAt || 0) - new Date(likeA?.createdAt || 0);
    });
  }, [likedPosts, postLikeOrder]);

  const likeActivity = useMemo(() => {
    const postItems = orderedLikedPosts.map((post) => ({
      id: `post-${post.id}`,
      type: "post",
      createdAt:
        postLikeOrder.get(post.actionPostId || post.rootPostId || post.id)?.createdAt ||
        post.createdAt,
      post,
    }));

    const commentItems = profileCommentLikes.map((like) => ({
      id: `comment-${like.id}`,
      type: "comment",
      createdAt: like.createdAt,
      like,
    }));

    return [...postItems, ...commentItems].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [orderedLikedPosts, postLikeOrder, profileCommentLikes]);

  const renderTabContent = () => {
    if (activeTab === "posts") {
      return renderPostList(userPosts, "Todavia no hay publicaciones ni reposts.");
    }

    if (activeTab === "favorites") {
      return renderPostList(orderedFavoritePosts, "Todavia no tienes favoritos.");
    }

    if (activeTab === "comments") {
      return profileComments.length > 0 ? (
        profileComments.map((comment) => (
          <article key={comment.id} className="profile-comment-card">
            <p className="profile-comment-card__label">Actividad social</p>
            <h3>{comment.postPreview || "Comentario en una publicacion"}</h3>
            {comment.text && <p>{comment.text}</p>}
            <span>{socialFeedService.formatRelativeTime(comment.createdAt)}</span>
          </article>
        ))
      ) : (
        <EmptyPanel text="Todavia no has comentado nada." />
      );
    }

    if (activeTab === "likes") {
      const hasLikeActivity = likeActivity.length > 0;

      if (!hasLikeActivity) {
        return <EmptyPanel text="Todavia no has dado me gusta a publicaciones." />;
      }

      return (
        <>
          {likeActivity.map((activity) =>
            activity.type === "post" ? (
              <PostCard
                key={activity.id}
                post={activity.post}
                currentUser={currentUser}
                onToggleLike={toggleLike}
                onToggleFavorite={toggleFavorite}
                onShare={sharePost}
                onAddComment={addComment}
                onReplyToComment={replyToComment}
                onToggleCommentLike={toggleCommentLike}
              />
            ) : (
              <article key={activity.id} className="profile-comment-card">
                <p className="profile-comment-card__label">Me gusta en comentario</p>
                {activity.like.postId && activity.like.commentId ? (
                  <Link
                    className="profile-comment-card__link"
                    to={`/post/${activity.like.postId}/comment/${activity.like.commentId}`}
                  >
                    <h3>
                      {activity.like.commentAuthor?.displayName || "Usuario"}{" "}
                      {activity.like.parentCommentId
                        ? "respondio en un hilo"
                        : "comento en una publicacion"}
                    </h3>
                    {activity.like.text ? (
                      <p>{activity.like.text}</p>
                    ) : (
                      <p>Comentario sin texto</p>
                    )}
                    <span>{socialFeedService.formatRelativeTime(activity.like.createdAt)}</span>
                  </Link>
                ) : (
                  <>
                    <h3>Comentario no disponible</h3>
                    <p>Este registro necesita refrescarse para cargar el hilo correcto.</p>
                    <span>{socialFeedService.formatRelativeTime(activity.like.createdAt)}</span>
                  </>
                )}
              </article>
            )
          )}
        </>
      );
    }

    return null;
  };

  const rightContent = (
    <>
      <section className="profile-panel">
        <h2>Estadisticas del usuario</h2>

        <div className="profile-stat-list">
          <div>
            <span>Publicaciones</span>
            <strong>{userPosts.length}</strong>
          </div>
          <div>
            <span>Favoritos sociales</span>
            <strong>{favoritePosts.length}</strong>
          </div>
          <div>
            <span>Comentarios</span>
            <strong>{profileComments.length}</strong>
          </div>
          <div>
            <span>Me gusta dados</span>
            <strong>{likedPosts.length + profileCommentLikes.length}</strong>
          </div>
        </div>
      </section>
    </>
  );

  if (isProfileLoading) {
    return (
      <AppShell
        user={currentUser}
        activeSection="profile"
        onOpenAR={onOpenAR}
        rightContent={rightContent}
      >
        <LoadingPanel text="Cargando perfil..." />
      </AppShell>
    );
  }

  if (profileError) {
    return (
      <AppShell
        user={currentUser}
        activeSection="profile"
        onOpenAR={onOpenAR}
        rightContent={rightContent}
      >
        <EmptyPanel text={profileError} />
      </AppShell>
    );
  }

  return (
    <AppShell
      user={currentUser}
      activeSection="profile"
      onOpenAR={onOpenAR}
      rightContent={rightContent}
    >
      <section className="profile-hero">
        <div className="profile-hero__avatar-wrapper">
          <div className="profile-hero__avatar">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Foto de perfil" />
            ) : (
              <span>
                {profile?.name?.[0]}
                {profile?.lastName?.[0]}
              </span>
            )}
          </div>

          {profile?.username === currentUser?.username && (
            <label className="profile-hero__photo-button">
              📷
              <input type="file" accept="image/*" onChange={handleProfilePhotoChange} />
            </label>
          )}
        </div>

        <div className="profile-hero__info">
          <p className="profile-hero__eyebrow">Perfil de usuario</p>
          <h1>
            {profile?.name} {profile?.lastName}
          </h1>
          <p className="profile-hero__username">@{profile?.username}</p>
          <p className="profile-hero__bio">
            {profile?.bio || "Fanatico del futbol y explorador social dentro de Mundial FC."}
          </p>

          <div className="profile-hero__stats">
            <div>
              <span>Miembro desde</span>
              <strong>{profile?.memberSinceLabel || "2026"}</strong>
            </div>
            <div>
              <span>Favoritos</span>
              <strong>{favoritePosts.length}</strong>
            </div>
            <div>
              <span>Publicaciones</span>
              <strong>{userPosts.length}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Publicaciones
        </button>
        <button
          className={activeTab === "favorites" ? "active" : ""}
          onClick={() => setActiveTab("favorites")}
        >
          Favoritos
        </button>
        <button
          className={activeTab === "comments" ? "active" : ""}
          onClick={() => setActiveTab("comments")}
        >
          Comentarios
        </button>
        <button
          className={activeTab === "likes" ? "active" : ""}
          onClick={() => setActiveTab("likes")}
        >
          Me gusta
        </button>
      </section>

      <section className="profile-feed">
        {isLoading ? <LoadingPanel text="Actualizando actividad..." /> : renderTabContent()}
      </section>
    </AppShell>
  );
}

export default ProfilePage;
