import "./HomeSidebar.css";

function HomeSidebar({ user, onOpenAR }) {
  return (
    <aside className="home-sidebar">
      <div className="home-sidebar__brand">
        <h1>Mundial FC</h1>
        <p>2026 EXPERIENCE</p>
      </div>

      <nav className="home-sidebar__nav">
        <button className="home-sidebar__nav-item active">Inicio</button>
        <button className="home-sidebar__nav-item">Selecciones</button>
        <button className="home-sidebar__nav-item">Estadísticas</button>
        <button className="home-sidebar__nav-item">Noticias</button>
        <button className="home-sidebar__nav-item">Favoritos</button>
        <button className="home-sidebar__nav-item">Perfil</button>
      </nav>

      <button className="home-sidebar__ar-card" onClick={onOpenAR}>
        <span className="home-sidebar__ar-label">Modo principal</span>
        <strong>MODO AR</strong>
        <small>Escanear escudos</small>
      </button>

      <div className="home-sidebar__profile">
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
      </div>
    </aside>
  );
}

export default HomeSidebar;