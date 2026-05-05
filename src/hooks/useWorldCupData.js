import { useCallback, useEffect, useState } from "react";
import worldCupService from "../services/worldCupService";

export function useWorldCupData() {
  const [teams, setTeams] = useState([]);
  const [standings, setStandings] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [teamsResponse, standingsResponse, fixturesResponse] = await Promise.all([
        worldCupService.getTeams(),
        worldCupService.getStandings(),
        worldCupService.getFixtures(),
      ]);

      setTeams(teamsResponse.teams || []);
      setStandings(standingsResponse.standings || []);
      setFixtures(fixturesResponse.fixtures || []);

      setActiveTeam((current) => current || teamsResponse.teams?.[0] || null);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectTeam = useCallback(async (team) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await worldCupService.getTeam(team.id || team.teamId);
      setActiveTeam(response.team || team);
      setActivePlayer(null);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectPlayer = useCallback(async (player) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await worldCupService.getPlayer(player.id || player.playerId);
      setActivePlayer(response.player || player);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTeamFavorite = useCallback(async (teamId) => {
    const response = await worldCupService.toggleTeamFavorite(teamId);
    return response.user;
  }, []);

  const togglePlayerFavorite = useCallback(async (playerId) => {
    const response = await worldCupService.togglePlayerFavorite(playerId);
    return response.user;
  }, []);

  return {
    teams,
    standings,
    fixtures,
    activeTeam,
    activePlayer,
    isLoading,
    error,
    refresh,
    selectTeam,
    selectPlayer,
    toggleTeamFavorite,
    togglePlayerFavorite,
  };
}
