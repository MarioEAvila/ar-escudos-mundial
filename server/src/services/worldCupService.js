import axios from "axios";
import { env } from "../config/env.js";
import { cache } from "../lib/cache.js";

function ensureFootballKey() {
  if (!env.apiFootballKey) {
    return false;
  }
  return true;
}

async function apiFootballGet(path, params = {}) {
  const response = await axios.get(`${env.apiFootballBaseUrl}${path}`, {
    headers: {
      "x-apisports-key": env.apiFootballKey,
    },
    params,
  });

  return response.data.response || [];
}

export async function getTeams() {
  const cacheKey = "worldcup:teams";
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) return [];

  const response = await apiFootballGet("/teams", { league: 1, season: 2026 });
  const teams = response.map((item) => ({
    id: String(item.team?.id || item.id),
    teamId: String(item.team?.id || item.id),
    name: item.team?.name || item.name,
    flag: item.team?.code ? ` ${item.team.code}` : "🏆",
    rankLabel: item.team?.country || "Seleccion mundialista",
    description: item.venue?.name
      ? `Sede asociada: ${item.venue.name}.`
      : "Informacion del equipo obtenida desde API externa.",
    players: [],
    stats: {},
  }));

  cache.set(cacheKey, teams, 60 * 60 * 12);
  return teams;
}

export async function getTeam(teamId) {
  const cacheKey = `worldcup:team:${teamId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) {
    return {
      id: teamId,
      teamId,
      name: `Equipo ${teamId}`,
      description: "Configura API_FOOTBALL_KEY para cargar informacion real del equipo.",
      players: [],
    };
  }

  const [teamResponse, playerResponse] = await Promise.all([
    apiFootballGet("/teams", { id: teamId }),
    apiFootballGet("/players/squads", { team: teamId }),
  ]);

  const team = teamResponse[0];
  const squad = playerResponse[0]?.players || [];

  const normalized = {
    id: String(team.team?.id || teamId),
    teamId: String(team.team?.id || teamId),
    name: team.team?.name || `Equipo ${teamId}`,
    flag: team.team?.code ? ` ${team.team.code}` : "🏆",
    description: `Plantilla actual. Fuente: ${team.team?.country || "API-FOOTBALL"}.`,
    coachName: team.venue?.name || "",
    groupName: team.team?.country || "",
    players: squad.map((player) => ({
      id: String(player.id),
      playerId: String(player.id),
      name: player.name,
      position: player.position,
      photoUrl: player.photo || "",
      stats: {},
    })),
    stats: {},
  };

  cache.set(cacheKey, normalized, 60 * 60 * 12);
  return normalized;
}

export async function getPlayer(playerId) {
  const cacheKey = `worldcup:player:${playerId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) {
    return {
      id: playerId,
      playerId,
      name: `Jugador ${playerId}`,
      bio: "Configura API_FOOTBALL_KEY para cargar informacion real del jugador.",
      stats: {},
    };
  }

  const response = await apiFootballGet("/players", { id: playerId, season: 2026 });
  const item = response[0];
  const player = item?.player;
  const statistics = item?.statistics?.[0];

  const normalized = {
    id: String(player?.id || playerId),
    playerId: String(player?.id || playerId),
    name: player?.name || `Jugador ${playerId}`,
    position: statistics?.games?.position || "",
    club: statistics?.team?.name || "",
    photoUrl: player?.photo || "",
    bio: `Datos actuales del jugador. Fuente: ${statistics?.league?.name || "API-FOOTBALL"}.`,
    stats: {
      goals: statistics?.goals?.total || 0,
      assists: statistics?.goals?.assists || 0,
      minutes: statistics?.games?.minutes || 0,
      appearances: statistics?.games?.appearences || 0,
    },
  };

  cache.set(cacheKey, normalized, 60 * 60 * 24);
  return normalized;
}

export async function getStandings() {
  const cacheKey = "worldcup:standings";
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) return [];

  const response = await apiFootballGet("/standings", { league: 1, season: 2026 });
  const standings =
    response.flatMap((entry) => entry.league?.standings?.flat() || []).map((item) => ({
      teamId: String(item.team?.id || item.rank),
      teamName: item.team?.name || "Equipo",
      rank: item.rank,
      points: item.points,
      pointsLabel: `${item.points} pts`,
      recordLabel: `${item.all?.win || 0}G ${item.all?.draw || 0}E ${item.all?.lose || 0}P`,
    })) || [];

  cache.set(cacheKey, standings, 60 * 30);
  return standings;
}

export async function getFixtures() {
  const cacheKey = "worldcup:fixtures";
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) return [];

  const response = await apiFootballGet("/fixtures", { league: 1, season: 2026, next: 10 });
  const fixtures = response.map((item) => ({
    id: String(item.fixture?.id || Math.random()),
    homeTeam: item.teams?.home?.name || "Local",
    awayTeam: item.teams?.away?.name || "Visitante",
    homeFlag: item.teams?.home?.winner === null ? "🏳️" : "🏆",
    awayFlag: item.teams?.away?.winner === null ? "🏳️" : "🏆",
    dateLabel: new Date(item.fixture?.date).toLocaleString("es-MX"),
    venue: item.fixture?.venue?.name || "",
    scoreLabel:
      item.goals?.home !== null && item.goals?.away !== null
        ? `${item.goals.home} - ${item.goals.away}`
        : "",
  }));

  cache.set(cacheKey, fixtures, 60 * 15);
  return fixtures;
}
