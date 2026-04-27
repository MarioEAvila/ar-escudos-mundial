import "./HomeTopbar.css";

function HomeTopbar({ onGoHome, onOpenProfile, onOpenEditor }) {
  return (
    <div className="home-topbar">
      <input
        className="home-topbar__search"
        type="text"
        placeholder="Buscar selecciones, jugadores, noticias..."
      />

      <div className="home-topbar__actions">
        <button onClick={onGoHome}>Inicio</button>
        <button>Noticias</button>
        <button onClick={onOpenEditor}>Editor</button>
        <button onClick={onOpenProfile}>Perfil</button>
      </div>
    </div>
  );
}

export default HomeTopbar;