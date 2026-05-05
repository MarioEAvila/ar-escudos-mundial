import { NavLink } from "react-router-dom";
import "./HomeSidebar.css";

function HomeSidebar({ user, onOpenAR, activeSection = "home" }) {
  const links = [
    { id: "home", to: "/", label: "Inicio" },
    { id: "selections", to: "/selections", label: "Selecciones" },
    { id: "stats", to: "/stats", label: "Estadisticas" },
    { id: "news", to: "/news", label: "Noticias" },
    { id: "favorites", to: "/favorites", label: "Favoritos" },
    { id: "profile", to: `/u/${user?.username || ""}`, label: "Perfil" },
    { id: "editor", to: "/editor", label: "Editor Multimedia" },
    { id: "minigame", to: "/minigame", label: "Minijuego" },
  ];

  return (
    <aside className="home-sidebar">
      <div className="home-sidebar__brand">
        <h1>Mundial FC</h1>
        <p>2026 EXPERIENCE</p>
      </div>

      <nav className="home-sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.id}
            to={link.to}
            className={`home-sidebar__nav-item ${
              activeSection === link.id ? "active" : ""
            }`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button className="home-sidebar__ar-card" onClick={onOpenAR}>
        <span className="home-sidebar__ar-label">Modo principal</span>
        <strong>MODO AR</strong>
        <small>Escanear escudos</small>
      </button>

      <NavLink className="home-sidebar__profile" to={`/u/${user?.username || ""}`}>
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
      </NavLink>
    </aside>
  );
}

export default HomeSidebar;
