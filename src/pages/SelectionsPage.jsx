import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import { useAuth } from "../hooks/useAuth";
import { useWorldCupData } from "../hooks/useWorldCupData";
import "./WorldCupPage.css";

function SelectionsPage({ currentUser, onOpenAR }) {
  const { updateUser } = useAuth();
  const {
    teams,
    standings,
    fixtures,
    activeTeam,
    activePlayer,
    isLoading,
    error,
    selectTeam,
    selectPlayer,
    toggleTeamFavorite,
    togglePlayerFavorite,
  } = useWorldCupData();

  const rightContent = (
    <section className="world-cup-panel">
      <h2>Tabla de posiciones</h2>
      <div className="world-cup-list">
        {standings.map((item) => (
          <div key={item.teamId || item.teamName} className="world-cup-list__item">
            <strong>#{item.rank || "-"} {item.teamName}</strong>
            <p>{item.pointsLabel || `${item.points || 0} pts`}</p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <AppShell
      user={currentUser}
      activeSection="selections"
      onOpenAR={onOpenAR}
      rightContent={rightContent}
    >
      <section className="page-hero">
        <p>Ruta mundialista</p>
        <h1>Selecciones</h1>
        <span>Consulta equipos, plantilla actual, calendario y favoritos deportivos.</span>
      </section>

      {error && <EmptyPanel text={error} />}

      <div className="world-cup-page">
        <section className="world-cup-panel">
          <h2>Equipos clasificados</h2>
          {isLoading && teams.length === 0 ? (
            <LoadingPanel text="Cargando selecciones..." />
          ) : (
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
                  <p>{team.rankLabel || "Seleccion mundialista"}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="world-cup-panel">
          <div className="world-cup-panel__title">
            <h2>{activeTeam?.name || "Equipo"}</h2>
            {activeTeam && (
              <button
                onClick={async () => {
                  const user = await toggleTeamFavorite(
                    activeTeam.id || activeTeam.teamId
                  );
                  if (user) {
                    await updateUser(user);
                  }
                }}
              >
                Favorito
              </button>
            )}
          </div>

          {activeTeam ? (
            <>
              <p>{activeTeam.description || "Informacion basica del equipo no disponible."}</p>
              <div className="world-cup-meta-grid">
                <div>
                  <span>Entrenador</span>
                  <strong>{activeTeam.coachName || "Por confirmar"}</strong>
                </div>
                <div>
                  <span>Grupo / zona</span>
                  <strong>{activeTeam.groupName || "Por definir"}</strong>
                </div>
              </div>

              <h3>Plantilla actual</h3>
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
                    {player.photoUrl ? (
                      <img src={player.photoUrl} alt={player.name} />
                    ) : (
                      <div className="world-cup-player-card__placeholder">Jugador</div>
                    )}
                    <strong>{player.name}</strong>
                    <p>{player.position || "Posicion por confirmar"}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <EmptyPanel text="Selecciona un equipo para ver su informacion." />
          )}
        </section>

        <section className="world-cup-panel">
          <div className="world-cup-panel__title">
            <h2>{activePlayer?.name || "Jugador"}</h2>
            {activePlayer && (
              <button
                onClick={async () => {
                  const user = await togglePlayerFavorite(
                    activePlayer.id || activePlayer.playerId
                  );
                  if (user) {
                    await updateUser(user);
                  }
                }}
              >
                Favorito
              </button>
            )}
          </div>

          {activePlayer ? (
            <>
              {activePlayer.photoUrl && (
                <img
                  className="world-cup-player-detail__photo"
                  src={activePlayer.photoUrl}
                  alt={activePlayer.name}
                />
              )}
              <p>{activePlayer.bio || "Informacion del jugador no disponible."}</p>
              <div className="world-cup-meta-grid">
                <div>
                  <span>Posicion</span>
                  <strong>{activePlayer.position || "N/D"}</strong>
                </div>
                <div>
                  <span>Club</span>
                  <strong>{activePlayer.club || "N/D"}</strong>
                </div>
              </div>
            </>
          ) : (
            <EmptyPanel text="Elige un jugador de la seleccion activa." />
          )}
        </section>

        <section className="world-cup-panel">
          <h2>Calendario</h2>
          <div className="world-cup-list">
            {fixtures.slice(0, 8).map((match) => (
              <div key={match.id} className="world-cup-list__item">
                <strong>
                  {match.homeFlag || "🏳️"} {match.homeTeam} vs {match.awayFlag || "🏳️"} {match.awayTeam}
                </strong>
                <p>{match.dateLabel}</p>
                <p>{match.venue || "Sede por confirmar"}</p>
                {match.scoreLabel && <p>{match.scoreLabel}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default SelectionsPage;
