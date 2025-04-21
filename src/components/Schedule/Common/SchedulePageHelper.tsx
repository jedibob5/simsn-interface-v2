import { useEffect, useState } from "react";
import { 
  CollegeStandings,
  NFLStandings, 
  CollegeGame,
  NFLGame, 
  CollegeTeam,
  NFLTeam,
  CollegePlayer as CFBPlayer,
  NFLPlayer, 
} from "../../../models/footballModels";

import { 
  CollegeStandings as CHLStandings,
  ProfessionalStandings as PHLStandings, 
  CollegeGame as CHLGame,
  ProfessionalGame as PHLGame, 
  CollegeTeam as CHLTeam,
  ProfessionalTeam as PHLTeam,
  CollegePlayer as CHLPlayer,
  ProfessionalPlayer as PHLPlayer, 
} from "../../../models/hockeyModels";

import { League } from "../../../_constants/constants";

export const getScheduleCFBData = (
  team: any,
  currentWeek: any,
  selectedWeek: any,
  selectedSeason: any,
  league: League,
  allCFBStandings: CollegeStandings[],
  allCollegeGames: CollegeGame[],
  allCollegeTeams: CollegeTeam[],
) => {
    // Team Standings
    const teamStandings = allCFBStandings
      .filter((standings) => standings.ConferenceID === team.ConferenceID)
      .map((standings, index) => ({ ...standings, Rank: index + 1 }));

    const teamAbbrMap = new Map(allCollegeTeams.map((team) => [team.ID, team.TeamAbbr]));

    // Team Schedule
    const teamSchedule = allCollegeGames
      .filter((game) => game.HomeTeamID === team.ID || 
                        game.AwayTeamID === team.ID)
      .map((game) => ({
        ...game,
        HomeTeamAbbr: teamAbbrMap.get(game.HomeTeamID),
        AwayTeamAbbr: teamAbbrMap.get(game.AwayTeamID),
      }));

  return { 
    teamStandings, 
    teamSchedule, 
  };
};

export const getScheduleCHLData = (
  team: any,
  currentWeek: any,
  selectedWeek: any,
  selectedSeason: any,
  league: League,
  allCHLStandings: CHLStandings[],
  allCollegeGames: CHLGame[],
  allCollegeTeams: CHLTeam[],
) => {
    // Team Standings
    const teamStandings = allCHLStandings
      .filter((standings) => standings.ConferenceID === team.ConferenceID)
      .map((standings, index) => ({ ...standings, Rank: index + 1 }));

    const teamAbbrMap = new Map(allCollegeTeams.map((team) => [team.ID, team.Abbreviation]));

    // Team Schedule
    const teamSchedule = allCollegeGames
      .filter((game) => game.HomeTeamID === team.ID || 
                        game.AwayTeamID === team.ID)
      .map((game) => ({
        ...game,
        HomeTeamAbbr: teamAbbrMap.get(game.HomeTeamID),
        AwayTeamAbbr: teamAbbrMap.get(game.AwayTeamID),
      }));

  return { 
    teamStandings, 
    teamSchedule, 
  };
};