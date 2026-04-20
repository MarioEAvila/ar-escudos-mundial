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
        <button>Inicio</button>
        <button>Noticias</button>
        <button>Perfil</button>
      </div>
    </div>
  );
}

export default HomeTopbar;