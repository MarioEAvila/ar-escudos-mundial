import "./HomeTopbar.css";

function HomeTopbar() {
  return (
    <div className="home-topbar">
      <input
        className="home-topbar__search"
        type="text"
        placeholder="Buscar selecciones, jugadores, noticias..."
      />
    </div>
  );
}

export default HomeTopbar;
