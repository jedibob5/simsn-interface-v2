import {
  BASE_HCK_SEASON,
  BASE_HCK_WEEKS_IN_SEASON,
  PLAYER_VIEW,
  StatsType,
  StatsView,
  WEEK_VIEW,
} from "../_constants/constants";
import {
  CollegePlayer as CHLPlayer,
  CollegeTeam as CHLTeam,
  ProfessionalPlayer as PHLPlayer,
  ProfessionalTeam as PHLTeam,
  Timestamp as HCKTimestamp,
  CollegePlayerGameStats as CHLPlayerGameStats,
  CollegePlayerSeasonStats as CHLPlayerSeasonStats,
  CollegeTeamGameStats as CHLTeamGameStats,
  CollegeTeamSeasonStats as CHLTeamSeasonStats,
  ProfessionalPlayerGameStats,
  ProfessionalPlayerSeasonStats,
  ProfessionalTeamGameStats,
  ProfessionalTeamSeasonStats,
} from "../models/hockeyModels";

export const MakeCHLPlayerMapFromRosterMap = (
  chlTeams: CHLTeam[],
  rosterMap: Record<number, CHLPlayer[]>
): Record<number, CHLPlayer> => {
  const playerMap: Record<number, CHLPlayer> = {};

  for (let i = 0; i < chlTeams.length; i++) {
    const teamID = chlTeams[i].ID;
    const roster = rosterMap[teamID];
    for (let j = 0; j < roster.length; j++) {
      const player = roster[j];
      playerMap[player.ID] = player;
    }
  }

  const unsignedPlayers = rosterMap[0];
  for (let i = 0; i < unsignedPlayers.length; i++) {
    const player = unsignedPlayers[i];
    playerMap[player.ID] = player;
  }

  return playerMap;
};

export const MakePHLPlayerMapFromRosterMap = (
  phlTeams: PHLTeam[],
  rosterMap: Record<number, PHLPlayer[]>
): Record<number, PHLPlayer> => {
  const playerMap: Record<number, PHLPlayer> = {};

  for (let i = 0; i < phlTeams.length; i++) {
    const teamID = phlTeams[i].ID;
    const roster = rosterMap[teamID];
    for (let j = 0; j < roster.length; j++) {
      const player = roster[j];
      playerMap[player.ID] = player;
    }
  }

  const unsignedPlayers = rosterMap[0];
  for (let i = 0; i < unsignedPlayers.length; i++) {
    const player = unsignedPlayers[i];
    playerMap[player.ID] = player;
  }

  return playerMap;
};

export const MakeHCKSeasonsOptionList = (ts: HCKTimestamp) => {
  const seasonsList = [];
  for (let i = 1; i <= ts.SeasonID; i++) {
    const iterativeSeason = 2024 + i;
    const seasonLabel = `${iterativeSeason}`;
    const option = { label: seasonLabel, value: i.toString() };
    seasonsList.push(option);
  }
  return seasonsList;
};

export const MakeHCKWeeksOptionList = (seasonID: number) => {
  const weeksList = [];

  for (let i = 1; i <= BASE_HCK_WEEKS_IN_SEASON; i++) {
    const weekID = getHCKWeekID(i, seasonID);
    const weekLabel = `Week ${i}`;
    const option = { label: weekLabel, value: weekID.toString() };
    weeksList.push(option);
  }

  return weeksList;
};

export const getHCKWeekID = (week: number, seasonID: number) => {
  const season = seasonID + BASE_HCK_SEASON;
  const diffSeason = season - 2000;
  return (diffSeason * 100) + week;
};

export const GetHCKCollegeStats = (
  statsView: StatsView,
  statsType: StatsType,
  week: number,
  season: number,
  chlPlayerGameStatsMap: Record<number, CHLPlayerGameStats[]>,
  chlPlayerSeasonStatsMap: Record<number, CHLPlayerSeasonStats[]>,
  chlTeamGameStatsMap: Record<number, CHLTeamGameStats[]>,
  chlTeamSeasonStatsMap: Record<number, CHLTeamSeasonStats[]>
) => {
  if (statsView === WEEK_VIEW) {
    if (statsType === PLAYER_VIEW) {
      return chlPlayerGameStatsMap[week] || [];
    }
    return chlTeamGameStatsMap[week] || [];
  }
  if (statsType === PLAYER_VIEW) {
    return chlPlayerSeasonStatsMap[season] || [];
  }
  return chlTeamSeasonStatsMap[season] || [];
};

export const GetHCKProStats = (
  statsView: StatsView,
  statsType: StatsType,
  week: number,
  season: number,
  phlPlayerGameStatsMap: Record<number, ProfessionalPlayerGameStats[]>,
  phlPlayerSeasonStatsMap: Record<number, ProfessionalPlayerSeasonStats[]>,
  phlTeamGameStatsMap: Record<number, ProfessionalTeamGameStats[]>,
  phlTeamSeasonStatsMap: Record<number, ProfessionalTeamSeasonStats[]>
) => {
  if (statsView === WEEK_VIEW) {
    if (statsType === PLAYER_VIEW) {
      return phlPlayerGameStatsMap[week] || [];
    }
    return phlTeamGameStatsMap[week] || [];
  }
  if (statsType === PLAYER_VIEW) {
    return phlPlayerSeasonStatsMap[season] || [];
  }
  return phlTeamSeasonStatsMap[season] || [];
};
