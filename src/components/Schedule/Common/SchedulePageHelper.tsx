import { useEffect, useState } from "react";
import { 
  CollegeStandings,
  NFLStandings, 
  Notification,
  CollegeGame,
  NFLGame, 
  CollegeTeam,
  NFLTeam,
  CollegePlayer,
  NFLPlayer,
  NewsLog 
} from "../../../models/footballModels";

import { League } from "../../../_constants/constants";

export const getScheduleCFBData = (
  team: any,
  currentWeek: any,
  league: League,
  allCFBStandings: CollegeStandings[],
  allCollegeGames: CollegeGame[],
  allCollegeTeams: CollegeTeam[],
  topCFBPassers: CollegePlayer[],
  topCFBRushers: CollegePlayer[],
  topCFBReceivers: CollegePlayer[],
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

    // Team Stats
    const userPassers = topCFBPassers.filter((p) => p.TeamID === team.ID);
    const userRushers = topCFBRushers.filter((r) => r.TeamID === team.ID);
    const userReceivers = topCFBReceivers.filter((rcv) => rcv.TeamID === team.ID);
    const topPasser = userPassers.length > 0 ? userPassers[0] : null;
    const topRusher = userRushers.length > 0 ? userRushers[0] : null;
    const topReceiver = userReceivers.length > 0 ? userReceivers[0] : null;

    const teamStats = {
      TopPasser: topPasser,
      TopRusher: topRusher,
      TopReceiver: topReceiver
    };

  return { 
    teamStandings, 
    teamSchedule, 
    teamStats, 
  };
};