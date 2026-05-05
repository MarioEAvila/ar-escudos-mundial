import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setIsProfileLoading(true);
      setProfileError("");

      try {
        const response = await profileService.getProfile(
          username || currentUser?.username
        );
        if (!mounted) return;
        setProfile(response.profile);
      } catch (error) {
        if (!mounted) return;
        setProfileError(error.message);
      } finally {
        if (mounted) {
          setIsProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [currentUser?.username, username]);

  const userPosts = useMemo(
    () => posts.filter((post) => post.author?.username === profile?.username),
    [posts, profile?.username]
  );

  const favoritePosts = useMemo(
    () => posts.filter((post) => post.viewer?.favorited),
    [posts]
  );

  const likedPosts = useMemo(() => posts.filter((post) => post.viewer?.liked), [posts]);

  const profileComments = profile?.activity?.comments || [];
  const profileCommentLikes = profile?.activity?.commentLikes || [];

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

  const renderTabContent = () => {
    if (activeTab === "posts") {
      return renderPostList(userPosts, "Todavia no hay publicaciones ni reposts.");
    }

    if (activeTab === "favorites") {
      return renderPostList(favoritePosts, "Todavia no tienes favoritos.");
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
      return (
        <>
          {renderPostList(likedPosts, "Todavia no has dado me gusta a publicaciones.")}
          {profileCommentLikes.length > 0 &&
            profileCommentLikes.map((like) => (
              <article key={like.id} className="profile-comment-card">
                <p className="profile-comment-card__label">Me gusta en comentario</p>
                <h3>{like.commentPreview || "Comentario con me gusta"}</h3>
                <span>{socialFeedService.formatRelativeTime(like.createdAt)}</span>
              </article>
            ))}
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
