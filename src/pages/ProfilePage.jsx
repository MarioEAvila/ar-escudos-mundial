import { useMemo, useState } from "react";
import "./ProfilePage.css";
import HomeSidebar from "../components/layout/HomeSidebar";
import HomeTopbar from "../components/home/HomeTopbar";
import PostCard from "../components/feed/PostCard";
import { initialFeedPosts } from "../data/homeData";
import { useAuth } from "../hooks/useAuth";

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

  const userPosts = useMemo(() => {
    return [
      {
        id: "user-post-1",
        type: "post",
        author: `${currentUser?.name} ${currentUser?.lastName}`,
        username: `@${currentUser?.username}`,
        verified: false,
        time: "Ahora mismo",
        text: "Listo para vivir una nueva aventura en Mundial FC. ¡Vamos con todo! 🇲🇽💚",
        image:
          "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
        likes: 28,
        comments: 5,
        shares: 3,
        favorite: false,
      },
      {
        id: "user-post-2",
        type: "post",
        author: `${currentUser?.name} ${currentUser?.lastName}`,
        username: `@${currentUser?.username}`,
        verified: false,
        time: "Hace 2 h",
        text: "Nuevo escudo detectado en el Modo AR. Esta función se ve increíble.",
        image:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
        likes: 18,
        comments: 2,
        shares: 1,
        favorite: true,
      },
    ];
  }, [currentUser]);

  const favoritePosts = initialFeedPosts.filter((post) => post.favorite);
  const likedPosts = initialFeedPosts.slice(0, 2);

  const userComments = [
    {
      id: "comment-1",
      originalPost: "México vs Estados Unidos",
      text: "México llega fuerte este año. Ese partido va a estar buenísimo.",
      time: "Hace 20 min",
    },
    {
      id: "comment-2",
      originalPost: "Trivia Mundial 2026",
      text: "La trivia por selección debería desbloquear recompensas.",
      time: "Hace 1 h",
    },
    {
      id: "comment-3",
      originalPost: "Brasil rumbo al Mundial",
      text: "Brasil siempre llega como favorito, pero Argentina también se ve fuerte.",
      time: "Ayer",
    },
  ];

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

  const renderTabContent = () => {
    if (activeTab === "posts") {
      return userPosts.map((post) => <PostCard key={post.id} post={post} />);
    }

    if (activeTab === "favorites") {
      return favoritePosts.length > 0 ? (
        favoritePosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="profile-empty">Todavía no tienes favoritos.</div>
      );
    }

    if (activeTab === "comments") {
      return userComments.map((comment) => (
        <article key={comment.id} className="profile-comment-card">
          <p className="profile-comment-card__label">Comentaste en:</p>
          <h3>{comment.originalPost}</h3>
          <p>{comment.text}</p>
          <span>{comment.time}</span>
        </article>
      ));
    }

    if (activeTab === "likes") {
      return likedPosts.map((post) => <PostCard key={post.id} post={post} />);
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
                  <span>Selecciones desbloqueadas</span>
                  <strong>3 / 12</strong>
                </div>

                <div>
                  <span>Escaneos AR</span>
                  <strong>7 realizados</strong>
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
                <span>Selecciones desbloqueadas</span>
                <strong>3 / 12</strong>
              </div>

              <div>
                <span>Escaneos AR realizados</span>
                <strong>7</strong>
              </div>

              <div>
                <span>Trivias completadas</span>
                <strong>4</strong>
              </div>

              <div>
                <span>Precisión promedio</span>
                <strong>82%</strong>
              </div>

              <div>
                <span>Comentarios hechos</span>
                <strong>12</strong>
              </div>

              <div>
                <span>Publicaciones</span>
                <strong>5</strong>
              </div>

              <div>
                <span>Me gusta dados</span>
                <strong>18</strong>
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