import axios from "axios";
import { env } from "../config/env.js";
import { cache } from "../lib/cache.js";

const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2022;
const CACHE_PREFIX = `worldcup:${WORLD_CUP_SEASON}`;
const MAX_PLAYER_PAGES_PER_TEAM = 3;

function ensureFootballKey() {
  return Boolean(env.apiFootballKey);
}

async function apiFootballRequest(path, params = {}) {
  const response = await axios.get(`${env.apiFootballBaseUrl}${path}`, {
    headers: {
      "x-apisports-key": env.apiFootballKey,
    },
    params,
  });

  return response.data || {};
}

async function apiFootballGet(path, params = {}) {
  const data = await apiFootballRequest(path, params);
  return data.response || [];
}

function proxiedImageUrl(url) {
  return url ? `/api/worldcup/image?url=${encodeURIComponent(url)}` : "";
}

function formatDateLabel(value) {
  if (!value) return "Fecha por confirmar";
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatNullable(value, fallback = "N/D") {
  return value === null || value === undefined || value === "" ? fallback : value;
}

function getScoreLabel(goals = {}) {
  if (goals.home === null || goals.away === null) return "";
  if (goals.home === undefined || goals.away === undefined) return "";
  return `${goals.home} - ${goals.away}`;
}

function normalizeTeamItem(item = {}) {
  const team = item.team || item;

  return {
    id: String(team.id || ""),
    teamId: String(team.id || ""),
    name: team.name || "Seleccion",
    code: team.code || "",
    country: team.country || "",
    founded: team.founded || "",
    national: Boolean(team.national),
    logoUrl: proxiedImageUrl(team.logo),
    rankLabel: team.country || "Mundial Qatar 2022",
    description: `Seleccion participante del Mundial Qatar 2022. Pais registrado: ${
      team.country || team.name || "N/D"
    }.`,
    players: [],
    fixtures: [],
    stats: {},
  };
}

function normalizeStanding(item = {}) {
  return {
    teamId: String(item.team?.id || item.rank || ""),
    teamName: item.team?.name || "Seleccion",
    logoUrl: proxiedImageUrl(item.team?.logo),
    groupName: item.group || "Grupo",
    rank: item.rank,
    points: item.points,
    pointsLabel: `${item.points || 0} pts`,
    recordLabel: `${item.all?.win || 0}G ${item.all?.draw || 0}E ${
      item.all?.lose || 0
    }P`,
    goalsFor: item.all?.goals?.for || 0,
    goalsAgainst: item.all?.goals?.against || 0,
    goalDifference: item.goalsDiff || 0,
    form: item.form || "",
  };
}

function normalizeFixture(item = {}) {
  const goals = item.goals || {};
  const scoreLabel = getScoreLabel(goals);

  return {
    id: String(item.fixture?.id || `${item.teams?.home?.id}-${item.teams?.away?.id}`),
    date: item.fixture?.date || "",
    dateLabel: formatDateLabel(item.fixture?.date),
    venue: item.fixture?.venue?.name || "",
    city: item.fixture?.venue?.city || "",
    round: item.league?.round || "",
    status: item.fixture?.status?.short || "",
    statusLabel: item.fixture?.status?.long || "",
    homeTeamId: String(item.teams?.home?.id || ""),
    awayTeamId: String(item.teams?.away?.id || ""),
    homeTeam: item.teams?.home?.name || "Local",
    awayTeam: item.teams?.away?.name || "Visitante",
    homeLogoUrl: proxiedImageUrl(item.teams?.home?.logo),
    awayLogoUrl: proxiedImageUrl(item.teams?.away?.logo),
    homeFlag: "",
    awayFlag: "",
    homeScore: goals.home,
    awayScore: goals.away,
    scoreLabel,
    resultLabel: scoreLabel ? `Resultado final: ${scoreLabel}` : "Por jugar",
  };
}

function normalizeTeamStats(stats = {}, standing = null) {
  const fixtures = stats.fixtures || {};
  const goalsFor = stats.goals?.for?.total || {};
  const goalsAgainst = stats.goals?.against?.total || {};

  return {
    rank: standing?.rank || "",
    points: standing?.points || 0,
    groupName: standing?.groupName || "",
    form: stats.form || standing?.form || "",
    matches: fixtures.played?.total || 0,
    wins: fixtures.wins?.total || 0,
    draws: fixtures.draws?.total || 0,
    losses: fixtures.loses?.total || 0,
    goalsFor: goalsFor.total || 0,
    goalsAgainst: goalsAgainst.total || 0,
    goalDifference: standing?.goalDifference || 0,
    cleanSheets: stats.clean_sheet?.total || 0,
    failedToScore: stats.failed_to_score?.total || 0,
    biggestHomeWin: stats.biggest?.wins?.home || "",
    biggestAwayWin: stats.biggest?.wins?.away || "",
  };
}

function normalizePlayerItem(item = {}) {
  const player = item.player || item;
  const statistics = item.statistics?.[0] || {};
  const games = statistics.games || {};
  const goals = statistics.goals || {};
  const shots = statistics.shots || {};
  const passes = statistics.passes || {};
  const tackles = statistics.tackles || {};
  const duels = statistics.duels || {};
  const dribbles = statistics.dribbles || {};
  const cards = statistics.cards || {};

  return {
    id: String(player.id || ""),
    playerId: String(player.id || ""),
    name: player.name || "Jugador",
    firstName: player.firstname || "",
    lastName: player.lastname || "",
    age: player.age || "",
    birthDate: player.birth?.date || "",
    nationality: player.nationality || "",
    height: player.height || "",
    weight: player.weight || "",
    injured: Boolean(player.injured),
    photoUrl: proxiedImageUrl(player.photo),
    position: games.position || "Posicion",
    club: statistics.team?.name || "",
    teamId: String(statistics.team?.id || ""),
    teamLogoUrl: proxiedImageUrl(statistics.team?.logo),
    bio: `${player.name || "Jugador"} participo en el Mundial Qatar 2022 con ${
      statistics.team?.name || "su seleccion"
    }.`,
    stats: {
      goals: goals.total || 0,
      assists: goals.assists || 0,
      conceded: goals.conceded || 0,
      saves: goals.saves || 0,
      minutes: games.minutes || 0,
      appearances: games.appearences || 0,
      lineups: games.lineups || 0,
      rating: games.rating || "",
      shots: shots.total || 0,
      shotsOnTarget: shots.on || 0,
      passes: passes.total || 0,
      keyPasses: passes.key || 0,
      tackles: tackles.total || 0,
      interceptions: tackles.interceptions || 0,
      duels: duels.total || 0,
      duelsWon: duels.won || 0,
      dribblesAttempted: dribbles.attempts || 0,
      dribblesSucceeded: dribbles.success || 0,
      yellowCards: cards.yellow || 0,
      redCards: cards.red || 0,
    },
  };
}

async function getTeamPlayers(teamId) {
  const cacheKey = `${CACHE_PREFIX}:team:${teamId}:players`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const firstPage = await apiFootballRequest("/players", {
    league: WORLD_CUP_LEAGUE_ID,
    season: WORLD_CUP_SEASON,
    team: teamId,
    page: 1,
  });

  const totalPages = Math.min(
    firstPage.paging?.total || 1,
    MAX_PLAYER_PAGES_PER_TEAM
  );
  let players = firstPage.response || [];

  for (let page = 2; page <= totalPages; page += 1) {
    const data = await apiFootballRequest("/players", {
      league: WORLD_CUP_LEAGUE_ID,
      season: WORLD_CUP_SEASON,
      team: teamId,
      page,
    });
    players = [...players, ...(data.response || [])];
  }

  const normalized = players
    .map(normalizePlayerItem)
    .sort((left, right) => left.position.localeCompare(right.position));

  cache.set(cacheKey, normalized, 60 * 60 * 24);
  return normalized;
}

export async function getTeams() {
  const cacheKey = `${CACHE_PREFIX}:teams`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) return [];

  const response = await apiFootballGet("/teams", {
    league: WORLD_CUP_LEAGUE_ID,
    season: WORLD_CUP_SEASON,
  });

  const teams = response
    .map(normalizeTeamItem)
    .filter((team) => team.id)
    .sort((left, right) => left.name.localeCompare(right.name));

  cache.set(cacheKey, teams, 60 * 60 * 24);
  return teams;
}

export async function getTeam(teamId) {
  const cacheKey = `${CACHE_PREFIX}:team:${teamId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) {
    return {
      id: teamId,
      teamId,
      name: `Equipo ${teamId}`,
      description: "Configura API_FOOTBALL_KEY para cargar informacion real.",
      players: [],
      fixtures: [],
      stats: {},
    };
  }

  const [teamResponse, players, statsResponse, fixtures, standings] =
    await Promise.all([
      apiFootballGet("/teams", { id: teamId }),
      getTeamPlayers(teamId),
      apiFootballGet("/teams/statistics", {
        league: WORLD_CUP_LEAGUE_ID,
        season: WORLD_CUP_SEASON,
        team: teamId,
      }),
      apiFootballGet("/fixtures", {
        league: WORLD_CUP_LEAGUE_ID,
        season: WORLD_CUP_SEASON,
        team: teamId,
      }),
      getStandings(),
    ]);

  const team = normalizeTeamItem(teamResponse[0]);
  const standing = standings.find((item) => item.teamId === String(teamId));
  const teamStats = normalizeTeamStats(statsResponse, standing);
  const normalizedFixtures = fixtures.map(normalizeFixture);

  const record = `${teamStats.wins}G ${teamStats.draws}E ${teamStats.losses}P`;
  const description = `${team.name} disputo ${teamStats.matches} partidos en el Mundial Qatar 2022 con record ${record}.`;

  const normalized = {
    ...team,
    groupName: standing?.groupName || "Grupo por confirmar",
    coachName: "No disponible",
    description,
    players,
    fixtures: normalizedFixtures,
    stats: teamStats,
  };

  cache.set(cacheKey, normalized, 60 * 60 * 24);
  return normalized;
}

export async function getPlayer(playerId) {
  const cacheKey = `${CACHE_PREFIX}:player:${playerId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) {
    return {
      id: playerId,
      playerId,
      name: `Jugador ${playerId}`,
      bio: "Configura API_FOOTBALL_KEY para cargar informacion real.",
      stats: {},
    };
  }

  const response = await apiFootballGet("/players", {
    id: playerId,
    season: WORLD_CUP_SEASON,
    league: WORLD_CUP_LEAGUE_ID,
  });

  const player = response[0] ? normalizePlayerItem(response[0]) : null;
  const normalized =
    player || {
      id: playerId,
      playerId,
      name: `Jugador ${playerId}`,
      bio: "API-FOOTBALL no devolvio datos para este jugador.",
      stats: {},
    };

  cache.set(cacheKey, normalized, 60 * 60 * 24);
  return normalized;
}

export async function getStandings() {
  const cacheKey = `${CACHE_PREFIX}:standings`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) return [];

  const response = await apiFootballGet("/standings", {
    league: WORLD_CUP_LEAGUE_ID,
    season: WORLD_CUP_SEASON,
  });

  const standings =
    response.flatMap((entry) => entry.league?.standings?.flat() || []).map(normalizeStanding) ||
    [];

  cache.set(cacheKey, standings, 60 * 60 * 12);
  return standings;
}

export async function getFixtures() {
  const cacheKey = `${CACHE_PREFIX}:fixtures`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  if (!ensureFootballKey()) return [];

  const response = await apiFootballGet("/fixtures", {
    league: WORLD_CUP_LEAGUE_ID,
    season: WORLD_CUP_SEASON,
  });

  const fixtures = response.map(normalizeFixture);

  cache.set(cacheKey, fixtures, 60 * 60 * 12);
  return fixtures;
}
