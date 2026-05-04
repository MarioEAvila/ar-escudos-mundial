import { useMemo, useState } from "react";
import "./ProfilePage.css";
import HomeSidebar from "../components/layout/HomeSidebar";
import HomeTopbar from "../components/home/HomeTopbar";
import PostCard from "../components/feed/PostCard";
import { useAuth } from "../hooks/useAuth";
import { useSocialFeed } from "../hooks/useSocialFeed";
import socialFeedService from "../services/socialFeedService";

function ProfilePage({
  currentUser,
  onOpenAR,
  onGoHome,
  onOpenProfile,
  onOpenEditor,
  onOpenMinigame,
}) {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const {
    posts,
    toggleLike,
    toggleFavorite,
    sharePost,
    addComment,
  } = useSocialFeed(currentUser);

  const userPosts = useMemo(
    () => posts.filter((post) => post.authorId === currentUser?.id),
    [currentUser?.id, posts]
  );

  const favoritePosts = useMemo(
    () =>
      posts.filter((post) => (post.favoriteBy || []).includes(currentUser?.id)),
    [currentUser?.id, posts]
  );

  const likedPosts = useMemo(
    () => posts.filter((post) => (post.likesBy || []).includes(currentUser?.id)),
    [currentUser?.id, posts]
  );

  const userComments = useMemo(() => {
    return posts.flatMap((post) =>
      (post.comments || [])
        .filter((comment) => comment.authorId === currentUser?.id)
        .map((comment) => ({
          ...comment,
          originalPost: post.text || "Publicación con imagen",
        }))
    );
  }, [currentUser?.id, posts]);

  const postCardProps = {
    currentUser,
    onToggleLike: toggleLike,
    onToggleFavorite: toggleFavorite,
    onShare: sharePost,
    onAddComment: addComment,
  };

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

  const renderPostList = (items, emptyText) => {
    return items.length > 0 ? (
      items.map((post) => (
        <PostCard key={post.id} post={post} {...postCardProps} />
      ))
    ) : (
      <div className="profile-empty">{emptyText}</div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "posts") {
      return renderPostList(userPosts, "Todavía no has publicado nada.");
    }

    if (activeTab === "favorites") {
      return renderPostList(favoritePosts, "Todavía no tienes favoritos.");
    }

    if (activeTab === "comments") {
      return userComments.length > 0 ? (
        userComments.map((comment) => (
          <article key={comment.id} className="profile-comment-card">
            <p className="profile-comment-card__label">Comentaste en:</p>
            <h3>{comment.originalPost}</h3>
            {comment.text && <p>{comment.text}</p>}
            {comment.image && (
              <img src={comment.image} alt="Imagen del comentario" />
            )}
            <span>{socialFeedService.formatRelativeTime(comment.createdAt)}</span>
          </article>
        ))
      ) : (
        <div className="profile-empty">Todavía no has comentado nada.</div>
      );
    }

    if (activeTab === "likes") {
      return renderPostList(likedPosts, "Todavía no has dado me gusta.");
    }

    return null;
  };

  return (
    <main className="profile-page">
      <div className="profile-page__grid">
        <div className="profile-page__left">
          <HomeSidebar
            user={currentUser}
            onOpenAR={onOpenAR}
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
            onOpenMinigame={onOpenMinigame}
            activeSection="profile"
          />
        </div>

        <div className="profile-page__center">
          <HomeTopbar
            onGoHome={onGoHome}
            onOpenProfile={onOpenProfile}
            onOpenEditor={onOpenEditor}
          />

          <section className="profile-hero">
            <div className="profile-hero__avatar-wrapper">
              <div className="profile-hero__avatar">
                {currentUser?.profilePhoto ? (
                  <img src={currentUser.profilePhoto} alt="Foto de perfil" />
                ) : (
                  <span>
                    {currentUser?.name?.[0]}
                    {currentUser?.lastName?.[0]}
                  </span>
                )}
              </div>

              <label className="profile-hero__photo-button">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                />
              </label>
            </div>

            <div className="profile-hero__info">
              <p className="profile-hero__eyebrow">Perfil de usuario</p>

              <h1>
                {currentUser?.name} {currentUser?.lastName}
              </h1>

              <p className="profile-hero__username">@{currentUser?.username}</p>

              <p className="profile-hero__bio">
                Fanático del fútbol y explorador AR dentro de Mundial FC.
                Viviendo la experiencia del Mundial 2026 al máximo.
              </p>

              <div className="profile-hero__stats">
                <div>
                  <span>Miembro desde</span>
                  <strong>Abril 2026</strong>
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

          <section className="profile-feed">{renderTabContent()}</section>
        </div>

        <aside className="profile-page__right">
          <section className="profile-panel">
            <h2>Estadísticas del usuario</h2>

            <div className="profile-stat-list">
              <div>
                <span>Publicaciones</span>
                <strong>{userPosts.length}</strong>
              </div>

              <div>
                <span>Favoritos guardados</span>
                <strong>{favoritePosts.length}</strong>
              </div>

              <div>
                <span>Comentarios hechos</span>
                <strong>{userComments.length}</strong>
              </div>

              <div>
                <span>Me gusta dados</span>
                <strong>{likedPosts.length}</strong>
              </div>

              <div>
                <span>Publicaciones disponibles</span>
                <strong>{posts.length}</strong>
              </div>
            </div>
          </section>

          <section className="profile-panel">
            <h2>Logros recientes</h2>

            <div className="profile-achievements">
              <div>
                <strong>Explorador en Ascenso</strong>
                <span>Realiza 5 escaneos AR</span>
              </div>

              <div>
                <strong>Trivia Inicial</strong>
                <span>Completa tu primera trivia</span>
              </div>

              <div>
                <strong>Fan Activo</strong>
                <span>Dale 10 me gusta a publicaciones</span>
              </div>
            </div>
          </section>

          <section className="profile-panel">
            <h2>Selecciones desbloqueadas</h2>

            <div className="profile-unlocked">
              <div>
                <span>🇲🇽</span>
                <p>México</p>
              </div>

              <div>
                <span>🇦🇷</span>
                <p>Argentina</p>
              </div>

              <div>
                <span>🇧🇷</span>
                <p>Brasil</p>
              </div>

              <div className="locked">
                <span>🔒</span>
                <p>Próximamente</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default ProfilePage;
