import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import { useWorldCupData } from "../hooks/useWorldCupData";
import "./WorldCupPage.css";

function StatsPage({ currentUser, onOpenAR }) {
  const { teams, standings, activeTeam, activePlayer, selectTeam, selectPlayer } =
    useWorldCupData();

  return (
    <AppShell user={currentUser} activeSection="stats" onOpenAR={onOpenAR}>
      <section className="page-hero">
        <p>Lectura competitiva</p>
        <h1>Estadisticas</h1>
        <span>Explora datos del equipo y del jugador activo con foco en rendimiento.</span>
      </section>

      <div className="world-cup-page">
        <section className="world-cup-panel">
          <h2>Equipos</h2>
          <div className="world-cup-grid">
            {teams.map((team) => (
              <button
                key={team.id || team.teamId}
                className={`world-cup-team-card ${
                  activeTeam?.id === team.id || activeTeam?.teamId === team.teamId
                    ? "active"
                    : ""
                }`}
                onClick={() => selectTeam(team)}
              >
                <span>{team.flag || "🏳️"}</span>
                <strong>{team.name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="world-cup-panel">
          <h2>Equipo activo</h2>
          {activeTeam ? (
            <>
              <div className="world-cup-meta-grid">
                <div>
                  <span>Posicion</span>
                  <strong>
                    {standings.find(
                      (item) =>
                        item.teamId === (activeTeam.id || activeTeam.teamId) ||
                        item.teamName === activeTeam.name
                    )?.rank || "N/D"}
                  </strong>
                </div>
                <div>
                  <span>Puntos</span>
                  <strong>{activeTeam.stats?.points || "N/D"}</strong>
                </div>
                <div>
                  <span>Goles</span>
                  <strong>{activeTeam.stats?.goals || "N/D"}</strong>
                </div>
                <div>
                  <span>Partidos</span>
                  <strong>{activeTeam.stats?.matches || "N/D"}</strong>
                </div>
              </div>

              <h3>Jugadores</h3>
              <div className="world-cup-player-grid">
                {(activeTeam.players || []).map((player) => (
                  <button
                    key={player.id || player.playerId}
                    className={`world-cup-player-card ${
                      activePlayer?.id === player.id || activePlayer?.playerId === player.playerId
                        ? "active"
                        : ""
                    }`}
                    onClick={() => selectPlayer(player)}
                  >
                    <strong>{player.name}</strong>
                    <p>{player.position || "Posicion"}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <EmptyPanel text="Selecciona un equipo para ver sus estadisticas." />
          )}
        </section>

        <section className="world-cup-panel">
          <h2>Jugador activo</h2>
          {activePlayer ? (
            <div className="world-cup-meta-grid">
              <div>
                <span>Goles</span>
                <strong>{activePlayer.stats?.goals || "N/D"}</strong>
              </div>
              <div>
                <span>Asistencias</span>
                <strong>{activePlayer.stats?.assists || "N/D"}</strong>
              </div>
              <div>
                <span>Minutos</span>
                <strong>{activePlayer.stats?.minutes || "N/D"}</strong>
              </div>
              <div>
                <span>Partidos</span>
                <strong>{activePlayer.stats?.appearances || "N/D"}</strong>
              </div>
            </div>
          ) : (
            <EmptyPanel text="Al cambiar de equipo, el jugador activo se limpia hasta que elijas uno nuevo." />
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default StatsPage;
