import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import WorldCupPlayerCard from "../components/worldcup/WorldCupPlayerCard";
import WorldCupStatTile from "../components/worldcup/WorldCupStatTile";
import WorldCupTeamCard from "../components/worldcup/WorldCupTeamCard";
import { useWorldCupData } from "../hooks/useWorldCupData";
import "./WorldCupPage.css";

function StatsPage({ currentUser, onOpenAR }) {
  const {
    teams,
    activeTeam,
    activePlayer,
    isLoading,
    error,
    selectTeam,
    selectPlayer,
  } = useWorldCupData({ loadInitialTeam: true });

  const activeTeamId = activeTeam?.id || activeTeam?.teamId || "";
  const activePlayerId = activePlayer?.id || activePlayer?.playerId || "";
  const teamStats = activeTeam?.stats || {};
  const playerStats = activePlayer?.stats || {};

  return (
    <AppShell user={currentUser} activeSection="stats" onOpenAR={onOpenAR}>
      <section className="page-hero">
        <p>Lectura competitiva 2022</p>
        <h1>Estadisticas</h1>
        <span>Analiza el rendimiento de equipos y jugadores del Mundial Qatar 2022.</span>
      </section>

      {error && <EmptyPanel text={error} />}

      <div className="world-cup-page">
        <section className="world-cup-panel world-cup-panel--wide">
          <div className="world-cup-panel__title">
            <h2>Equipos</h2>
            <span>{teams.length} selecciones</span>
          </div>

          {isLoading && teams.length === 0 ? (
            <LoadingPanel text="Cargando equipos..." />
          ) : (
            <div className="world-cup-grid world-cup-grid--teams">
              {teams.map((team) => (
                <WorldCupTeamCard
                  key={team.id || team.teamId}
                  team={team}
                  isActive={(team.id || team.teamId) === activeTeamId}
                  onClick={() => selectTeam(team)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="world-cup-panel world-cup-panel--feature">
          <div className="world-cup-panel__title">
            <h2>{activeTeam?.name || "Equipo activo"}</h2>
            <span>{activeTeam?.groupName || "Grupo"}</span>
          </div>

          {activeTeam ? (
            <div className="world-cup-team-detail">
              {activeTeam.logoUrl ? <img src={activeTeam.logoUrl} alt={activeTeam.name} /> : null}

              <div>
                <p>{activeTeam.description}</p>
                <div className="world-cup-meta-grid">
                  <WorldCupStatTile label="Posicion" value={teamStats.rank || "N/D"} />
                  <WorldCupStatTile label="Puntos" value={teamStats.points || 0} />
                  <WorldCupStatTile label="Partidos" value={teamStats.matches || 0} />
                  <WorldCupStatTile
                    label="Record"
                    value={`${teamStats.wins || 0}-${teamStats.draws || 0}-${
                      teamStats.losses || 0
                    }`}
                  />
                  <WorldCupStatTile label="Goles a favor" value={teamStats.goalsFor || 0} />
                  <WorldCupStatTile
                    label="Goles contra"
                    value={teamStats.goalsAgainst || 0}
                  />
                  <WorldCupStatTile
                    label="Diferencia"
                    value={teamStats.goalDifference || 0}
                  />
                  <WorldCupStatTile label="Porterias en cero" value={teamStats.cleanSheets || 0} />
                </div>
              </div>
            </div>
          ) : (
            <EmptyPanel text="Selecciona un equipo para ver sus estadisticas." />
          )}
        </section>

        <section className="world-cup-panel">
          <div className="world-cup-panel__title">
            <h2>Jugadores</h2>
            <span>{activeTeam?.players?.length || 0} registros</span>
          </div>

          {isLoading && activeTeam && activeTeam.players?.length === 0 ? (
            <LoadingPanel text="Actualizando jugadores..." />
          ) : activeTeam?.players?.length > 0 ? (
            <div className="world-cup-player-grid world-cup-player-grid--scroll">
              {activeTeam.players.map((player) => (
                <WorldCupPlayerCard
                  key={player.id || player.playerId}
                  player={player}
                  showStats
                  isActive={(player.id || player.playerId) === activePlayerId}
                  onClick={() => selectPlayer(player)}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel text="Elige un equipo para cargar jugadores con estadisticas." />
          )}
        </section>

        <section className="world-cup-panel">
          <div className="world-cup-panel__title">
            <h2>{activePlayer?.name || "Jugador activo"}</h2>
            <span>{activePlayer?.position || "Posicion"}</span>
          </div>

          {activePlayer ? (
            <div className="world-cup-player-detail world-cup-player-detail--stats">
              {activePlayer.photoUrl ? (
                <img
                  className="world-cup-player-detail__photo"
                  src={activePlayer.photoUrl}
                  alt={activePlayer.name}
                />
              ) : null}

              <div className="world-cup-meta-grid">
                <WorldCupStatTile label="Partidos" value={playerStats.appearances || 0} />
                <WorldCupStatTile label="Titularidades" value={playerStats.lineups || 0} />
                <WorldCupStatTile label="Minutos" value={playerStats.minutes || 0} />
                <WorldCupStatTile label="Rating" value={playerStats.rating || "N/D"} />
                <WorldCupStatTile label="Goles" value={playerStats.goals || 0} />
                <WorldCupStatTile label="Asistencias" value={playerStats.assists || 0} />
                <WorldCupStatTile label="Tiros" value={playerStats.shots || 0} />
                <WorldCupStatTile
                  label="Tiros al arco"
                  value={playerStats.shotsOnTarget || 0}
                />
                <WorldCupStatTile label="Pases" value={playerStats.passes || 0} />
                <WorldCupStatTile label="Pases clave" value={playerStats.keyPasses || 0} />
                <WorldCupStatTile label="Duelos" value={playerStats.duels || 0} />
                <WorldCupStatTile label="Duelos ganados" value={playerStats.duelsWon || 0} />
              </div>
            </div>
          ) : (
            <EmptyPanel text="Selecciona un jugador para ver sus numeros del torneo." />
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default StatsPage;
