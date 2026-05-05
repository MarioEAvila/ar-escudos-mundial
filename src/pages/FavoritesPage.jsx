import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import "./WorldCupPage.css";

function FavoritesPage({ currentUser, onOpenAR }) {
  const favoriteTeams = currentUser?.favoriteTeams || [];
  const favoritePlayers = currentUser?.favoritePlayers || [];

  return (
    <AppShell user={currentUser} activeSection="favorites" onOpenAR={onOpenAR}>
      <section className="page-hero">
        <p>Tu radar personal</p>
        <h1>Favoritos</h1>
        <span>Aqui viven solo tus equipos y jugadores marcados como favoritos.</span>
      </section>

      <div className="world-cup-page world-cup-page--two-columns">
        <section className="world-cup-panel">
          <h2>Equipos favoritos</h2>
          {favoriteTeams.length > 0 ? (
            <div className="world-cup-list">
              {favoriteTeams.map((teamId, index) => (
                <div key={`${teamId}-${index}`} className="world-cup-list__item">
                  <strong>{teamId}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanel text="Aun no marcas equipos favoritos." />
          )}
        </section>

        <section className="world-cup-panel">
          <h2>Jugadores favoritos</h2>
          {favoritePlayers.length > 0 ? (
            <div className="world-cup-list">
              {favoritePlayers.map((playerId, index) => (
                <div key={`${playerId}-${index}`} className="world-cup-list__item">
                  <strong>{playerId}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanel text="Aun no marcas jugadores favoritos." />
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default FavoritesPage;
