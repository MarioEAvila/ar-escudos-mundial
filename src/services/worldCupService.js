import apiClient from "../lib/apiClient";

async function getTeams() {
  const response = await apiClient.get("/worldcup/teams");
  return response.data;
}

async function getTeam(teamId) {
  const response = await apiClient.get(`/worldcup/teams/${teamId}`);
  return response.data;
}

async function getPlayer(playerId) {
  const response = await apiClient.get(`/worldcup/players/${playerId}`);
  return response.data;
}

async function getStandings() {
  const response = await apiClient.get("/worldcup/standings");
  return response.data;
}

async function getFixtures() {
  const response = await apiClient.get("/worldcup/fixtures");
  return response.data;
}

async function toggleTeamFavorite(teamId) {
  const response = await apiClient.post("/sports/favorites/team", { teamId });
  return response.data;
}

async function togglePlayerFavorite(playerId) {
  const response = await apiClient.post("/sports/favorites/player", { playerId });
  return response.data;
}

export default {
  getTeams,
  getTeam,
  getPlayer,
  getStandings,
  getFixtures,
  toggleTeamFavorite,
  togglePlayerFavorite,
};
