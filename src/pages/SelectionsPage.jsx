import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import WorldCupFixtureList from "../components/worldcup/WorldCupFixtureList";
import WorldCupPlayerCard from "../components/worldcup/WorldCupPlayerCard";
import WorldCupStandingsTable from "../components/worldcup/WorldCupStandingsTable";
import WorldCupStatTile from "../components/worldcup/WorldCupStatTile";
import WorldCupTeamCard from "../components/worldcup/WorldCupTeamCard";
import { useAuth } from "../hooks/useAuth";
import { useWorldCupData } from "../hooks/useWorldCupData";
import "./WorldCupPage.css";

function SelectionsPage({ currentUser, onOpenAR }) {
  const { updateUser } = useAuth();
  const {
    teams,
    standings,
    activeTeam,
    activePlayer,
    isLoading,
    error,
    selectTeam,
    selectPlayer,
    toggleTeamFavorite,
    togglePlayerFavorite,
  } = useWorldCupData({ loadInitialTeam: true });

  const activeTeamId = activeTeam?.id || activeTeam?.teamId || "";
  const activePlayerId = activePlayer?.id || activePlayer?.playerId || "";
  const favoriteTeams = currentUser?.favoriteTeams || [];
  const favoritePlayers = currentUser?.favoritePlayers || [];
  const isTeamFavorite = activeTeamId && favoriteTeams.includes(activeTeamId);
  const isPlayerFavorite = activePlayerId && favoritePlayers.includes(activePlayerId);

  const rightContent = (
    <section className="world-cup-panel world-cup-panel--standings">
      <h2>Tabla de posiciones</h2>
      <WorldCupStandingsTable standings={standings} activeTeamId={activeTeamId} />
    </section>
  );

  const handleToggleTeamFavorite = async () => {
    if (!activeTeamId) return;
    const user = await toggleTeamFavorite(activeTeamId);
    if (user) await updateUser(user);
  };

  const handleTogglePlayerFavorite = async () => {
    if (!activePlayerId) return;
    const user = await togglePlayerFavorite(activePlayerId);
    if (user) await updateUser(user);
  };

  return (
    <AppShell
      user={currentUser}
      activeSection="selections"
      onOpenAR={onOpenAR}
      rightContent={rightContent}
    >
      <section className="page-hero">
        <p>Ruta mundialista 2022</p>
        <h1>Selecciones</h1>
        <span>Explora equipos, plantillas, partidos y favoritos deportivos.</span>
      </section>

      {error && <EmptyPanel text={error} />}

      <div className="world-cup-page">
        <section className="world-cup-panel world-cup-panel--wide">
          <div className="world-cup-panel__title">
            <h2>Equipos participantes</h2>
            <span>{teams.length} selecciones</span>
          </div>

          {isLoading && teams.length === 0 ? (
            <LoadingPanel text="Cargando selecciones..." />
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
            <h2>{activeTeam?.name || "Seleccion"}</h2>
            {activeTeam ? (
              <button
                className={isTeamFavorite ? "world-cup-favorite active" : "world-cup-favorite"}
                onClick={handleToggleTeamFavorite}
                type="button"
              >
                {isTeamFavorite ? "Favorito" : "Marcar favorito"}
              </button>
            ) : null}
          </div>

          {activeTeam ? (
            <>
              <div className="world-cup-team-detail">
                {activeTeam.logoUrl ? (
                  <img src={activeTeam.logoUrl} alt={activeTeam.name} />
                ) : null}
                <div>
                  <p>{activeTeam.description}</p>
                  <div className="world-cup-meta-grid">
                    <WorldCupStatTile label="Pais" value={activeTeam.country || "N/D"} />
                    <WorldCupStatTile label="Grupo" value={activeTeam.groupName || "N/D"} />
                    <WorldCupStatTile
                      label="Partidos"
                      value={activeTeam.stats?.matches || 0}
                      hint={`${activeTeam.stats?.wins || 0}G ${
                        activeTeam.stats?.draws || 0
                      }E ${activeTeam.stats?.losses || 0}P`}
                    />
                    <WorldCupStatTile
                      label="Puntos"
                      value={activeTeam.stats?.points || 0}
                      hint={`DG ${activeTeam.stats?.goalDifference || 0}`}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyPanel text="Selecciona un equipo para ver su informacion." />
          )}
        </section>

        <section className="world-cup-panel">
          <div className="world-cup-panel__title">
            <h2>Plantilla</h2>
            <span>{activeTeam?.players?.length || 0} jugadores</span>
          </div>

          {isLoading && activeTeam && activeTeam.players?.length === 0 ? (
            <LoadingPanel text="Actualizando plantilla..." />
          ) : activeTeam?.players?.length > 0 ? (
            <div className="world-cup-player-grid world-cup-player-grid--scroll">
              {activeTeam.players.map((player) => (
                <WorldCupPlayerCard
                  key={player.id || player.playerId}
                  player={player}
                  isActive={(player.id || player.playerId) === activePlayerId}
                  onClick={() => selectPlayer(player)}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel text="La plantilla aparecera al seleccionar una seleccion con datos." />
          )}
        </section>

        <section className="world-cup-panel">
          <div className="world-cup-panel__title">
            <h2>{activePlayer?.name || "Jugador"}</h2>
            {activePlayer ? (
              <button
                className={
                  isPlayerFavorite ? "world-cup-favorite active" : "world-cup-favorite"
                }
                onClick={handleTogglePlayerFavorite}
                type="button"
              >
                {isPlayerFavorite ? "Favorito" : "Marcar favorito"}
              </button>
            ) : null}
          </div>

          {activePlayer ? (
            <div className="world-cup-player-detail">
              {activePlayer.photoUrl ? (
                <img
                  className="world-cup-player-detail__photo"
                  src={activePlayer.photoUrl}
                  alt={activePlayer.name}
                />
              ) : null}

              <div>
                <p>{activePlayer.bio || "Informacion del jugador no disponible."}</p>
                <div className="world-cup-meta-grid">
                  <WorldCupStatTile label="Posicion" value={activePlayer.position || "N/D"} />
                  <WorldCupStatTile label="Seleccion" value={activePlayer.club || "N/D"} />
                  <WorldCupStatTile label="Edad" value={activePlayer.age || "N/D"} />
                  <WorldCupStatTile
                    label="Nacionalidad"
                    value={activePlayer.nationality || "N/D"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <EmptyPanel text="Elige un jugador de la seleccion activa." />
          )}
        </section>

        <section className="world-cup-panel world-cup-panel--wide">
          <div className="world-cup-panel__title">
            <h2>Partidos de {activeTeam?.name || "la seleccion"}</h2>
            <span>{activeTeam?.fixtures?.length || 0} encuentros</span>
          </div>
          <WorldCupFixtureList
            fixtures={activeTeam?.fixtures || []}
            emptyText="Selecciona un equipo para ver su calendario y resultados."
          />
        </section>
      </div>
    </AppShell>
  );
}

export default SelectionsPage;
