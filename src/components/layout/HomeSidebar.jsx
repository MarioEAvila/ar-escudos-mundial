import "./HomeSidebar.css";

function HomeSidebar({
  user,
  onOpenAR,
  onGoHome,
  onOpenProfile,
  onOpenEditor,
  onOpenMinigame,
  activeSection = "home",
}) {
  return (
    <aside className="home-sidebar">
      <div className="home-sidebar__brand">
        <h1>Mundial FC</h1>
        <p>2026 EXPERIENCE</p>
      </div>

      <nav className="home-sidebar__nav">
        <button
          className={`home-sidebar__nav-item ${
            activeSection === "home" ? "active" : ""
          }`}
          onClick={onGoHome}
        >
          Inicio
        </button>

        <button className="home-sidebar__nav-item">Selecciones</button>

        <button className="home-sidebar__nav-item">Estadísticas</button>

        <button className="home-sidebar__nav-item">Noticias</button>

        <button className="home-sidebar__nav-item">Favoritos</button>

        <button
          className={`home-sidebar__nav-item ${
            activeSection === "profile" ? "active" : ""
          }`}
          onClick={onOpenProfile}
        >
          Perfil
        </button>

        <button
          className={`home-sidebar__nav-item ${
            activeSection === "editor" ? "active" : ""
          }`}
          onClick={onOpenEditor}
        >
          Editor Multimedia
        </button>

        <button
          className={`home-sidebar__nav-item ${
            activeSection === "minigame" ? "active" : ""
          }`}
          onClick={onOpenMinigame}
        >
          Minijuego
        </button>
      </nav>

      <button className="home-sidebar__ar-card" onClick={onOpenAR}>
        <span className="home-sidebar__ar-label">Modo principal</span>
        <strong>MODO AR</strong>
        <small>Escanear escudos</small>
      </button>

      <button className="home-sidebar__profile" onClick={onOpenProfile}>
        <div className="home-sidebar__avatar">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="Foto de perfil" />
          ) : (
            <span>
              {user?.name?.[0]}
              {user?.lastName?.[0]}
            </span>
          )}
        </div>

        <div>
          <h3>
            {user?.name} {user?.lastName}
          </h3>
          <p>@{user?.username}</p>
        </div>
      </button>
    </aside>
  );
}

export default HomeSidebar;