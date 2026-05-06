import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import EmptyPanel from "../components/common/EmptyPanel";
import LoadingPanel from "../components/common/LoadingPanel";
import worldCupService from "../services/worldCupService";
import "./WorldCupPage.css";

function FavoriteMetric({ label, value }) {
  return (
    <div className="world-cup-favorite-metric">
      <span>{label}</span>
      <strong>{value ?? "N/D"}</strong>
    </div>
  );
}

function FavoriteTeamCard({ team }) {
  const stats = team.stats || {};

  return (
    <article className="world-cup-favorite-card world-cup-favorite-card--team">
      <div className="world-cup-favorite-card__media">
        {team.logoUrl ? <img src={team.logoUrl} alt={team.name} /> : <span>{team.code || "WC"}</span>}
      </div>

      <div className="world-cup-favorite-card__body">
        <p className="world-cup-favorite-card__eyebrow">Seleccion favorita</p>
        <h3>{team.name}</h3>
        <p>
          {team.groupName || "Mundial Qatar 2022"} - {team.country || "Pais no disponible"}
        </p>

        <div className="world-cup-favorite-card__metrics">
          <FavoriteMetric label="PJ" value={stats.matches || 0} />
          <FavoriteMetric label="Pts" value={stats.points || 0} />
          <FavoriteMetric
            label="Record"
            value={`${stats.wins || 0}-${stats.draws || 0}-${stats.losses || 0}`}
          />
        </div>
      </div>
    </article>
  );
}

function FavoritePlayerCard({ player }) {
  const stats = player.stats || {};

  return (
    <article className="world-cup-favorite-card world-cup-favorite-card--player">
      <div className="world-cup-favorite-card__media">
        {player.photoUrl ? <img src={player.photoUrl} alt={player.name} /> : <span>Jugador</span>}
      </div>

      <div className="world-cup-favorite-card__body">
        <p className="world-cup-favorite-card__eyebrow">Jugador favorito</p>
        <h3>{player.name}</h3>
        <p>
          {player.position || "Posicion"} - {player.club || "Seleccion no disponible"}
        </p>

        <div className="world-cup-favorite-card__metrics">
          <FavoriteMetric label="PJ" value={stats.appearances || 0} />
          <FavoriteMetric label="G" value={stats.goals || 0} />
          <FavoriteMetric label="A" value={stats.assists || 0} />
          <FavoriteMetric label="Min" value={stats.minutes || 0} />
        </div>
      </div>
    </article>
  );
}

function FavoritesPage({ currentUser, onOpenAR }) {
  const favoriteTeams = useMemo(
    () => currentUser?.favoriteTeams || [],
    [currentUser?.favoriteTeams]
  );
  const favoritePlayers = useMemo(
    () => currentUser?.favoritePlayers || [],
    [currentUser?.favoritePlayers]
  );
  const [favoriteTeamItems, setFavoriteTeamItems] = useState([]);
  const [favoritePlayerItems, setFavoritePlayerItems] = useState([]);
  const [areTeamsLoading, setAreTeamsLoading] = useState(false);
  const [arePlayersLoading, setArePlayersLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteTeams() {
      if (favoriteTeams.length === 0) {
        setFavoriteTeamItems([]);
        return;
      }

      setAreTeamsLoading(true);

      try {
        const responses = await Promise.all(
          favoriteTeams.map((teamId) => worldCupService.getTeam(teamId))
        );

        if (!isMounted) return;
        setFavoriteTeamItems(responses.map((response) => response.team).filter(Boolean));
      } finally {
        if (isMounted) setAreTeamsLoading(false);
      }
    }

    loadFavoriteTeams();

    return () => {
      isMounted = false;
    };
  }, [favoriteTeams]);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoritePlayers() {
      if (favoritePlayers.length === 0) {
        setFavoritePlayerItems([]);
        return;
      }

      setArePlayersLoading(true);

      try {
        const responses = await Promise.all(
          favoritePlayers.map((playerId) => worldCupService.getPlayer(playerId))
        );

        if (!isMounted) return;
        setFavoritePlayerItems(responses.map((response) => response.player).filter(Boolean));
      } finally {
        if (isMounted) setArePlayersLoading(false);
      }
    }

    loadFavoritePlayers();

    return () => {
      isMounted = false;
    };
  }, [favoritePlayers]);

  return (
    <AppShell user={currentUser} activeSection="favorites" onOpenAR={onOpenAR}>
      <section className="page-hero">
        <p>Tu radar deportivo</p>
        <h1>Favoritos</h1>
        <span>Equipos y jugadores mundialistas marcados como favoritos.</span>
      </section>

      <section className="world-cup-favorites-summary">
        <div>
          <span>Equipos</span>
          <strong>{favoriteTeams.length}</strong>
        </div>
        <div>
          <span>Jugadores</span>
          <strong>{favoritePlayers.length}</strong>
        </div>
        <Link to="/selections">Explorar selecciones</Link>
      </section>

      <div className="world-cup-page world-cup-page--two-columns">
        <section className="world-cup-panel world-cup-panel--favorites">
          <div className="world-cup-panel__title">
            <h2>Equipos favoritos</h2>
            <span>{favoriteTeamItems.length}</span>
          </div>

          {areTeamsLoading ? (
            <LoadingPanel text="Cargando equipos favoritos..." />
          ) : favoriteTeamItems.length > 0 ? (
            <div className="world-cup-favorite-list">
              {favoriteTeamItems.map((team) => (
                <FavoriteTeamCard key={team.id || team.teamId} team={team} />
              ))}
            </div>
          ) : (
            <EmptyPanel text="Aun no marcas equipos favoritos." />
          )}
        </section>

        <section className="world-cup-panel world-cup-panel--favorites">
          <div className="world-cup-panel__title">
            <h2>Jugadores favoritos</h2>
            <span>{favoritePlayerItems.length}</span>
          </div>

          {arePlayersLoading ? (
            <LoadingPanel text="Cargando jugadores favoritos..." />
          ) : favoritePlayerItems.length > 0 ? (
            <div className="world-cup-favorite-list">
              {favoritePlayerItems.map((player) => (
                <FavoritePlayerCard key={player.id || player.playerId} player={player} />
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
