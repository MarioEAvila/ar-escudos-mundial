import { NavLink } from "react-router-dom";
import "./HomeTopbar.css";

function HomeTopbar() {
  return (
    <div className="home-topbar">
      <input
        className="home-topbar__search"
        type="text"
        placeholder="Buscar selecciones, jugadores, noticias..."
      />

      <div className="home-topbar__actions">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/news">Noticias</NavLink>
        <NavLink to="/editor">Editor</NavLink>
        <NavLink to="/favorites">Favoritos</NavLink>
      </div>
    </div>
  );
}

export default HomeTopbar;
