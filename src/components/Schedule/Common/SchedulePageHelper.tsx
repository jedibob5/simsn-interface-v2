import { useEffect, useState } from "react";
import { 
  CollegeStandings,
  NFLStandings, 
  Notification,
  CollegeGame,
  NFLGame, 
  CollegeTeam,
  NFLTeam,
  CollegePlayer as CFBPlayer,
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

export const getLeagueStats = (league: League, leagueStats: any) => {
  let topPassers = [];
  let topRushers = [];
  let topReceivers = [];

  switch (league) {
    case "SimCFB":
    case "SimNFL":
      topPassers = leagueStats.TopPassers.slice(0, 3).map((player: CFBPlayer) => ({
        id: player.ID,
        name: `${player.FirstName} ${player.LastName}`,
        teamAbbr: player.TeamAbbr,
        stat1: "Passing Yards",
        stat1Value: player.SeasonStats.PassingYards,
        stat2: "Passing TDs",
        stat2Value: player.SeasonStats.PassingTDs,
      }));
      topRushers = leagueStats.TopRushers.slice(0, 3).map((player: CFBPlayer) => ({
        id: player.ID,
        name: `${player.FirstName} ${player.LastName}`,
        teamAbbr: player.TeamAbbr,
        stat1: "Rushing Yards",
        stat1Value: player.SeasonStats.RushingYards,
        stat2: "Rushing TDs",
        stat2Value: player.SeasonStats.RushingTDs,
      }));
      topReceivers = leagueStats.TopReceivers.slice(0, 3).map((player: CFBPlayer) => ({
        id: player.ID,
        name: `${player.FirstName} ${player.LastName}`,
        stat1: "Receiving Yards",
        stat1Value: player.SeasonStats.ReceivingYards,
        stat2: "Receiving TDs",
        stat2Value: player.SeasonStats.ReceivingTDs,
      }));
      break;

    // case "SimCBB":
    // case "SimNBA":
    //   topPassers = leagueStats.TopPoints.slice(0, 3).map((player: BasketballPlayer) => ({
    //     name: `${player.FirstName} ${player.LastName}`,
    //     teamAbbr: player.TeamAbbr,
    //     logoUrl: player.TeamLogo,
    //     stat1: "Points Per Game",
    //     stat1Value: player.SeasonStats.PPG.toFixed(1),
    //     stat2: "Minutes Per Game",
    //     stat2Value: player.SeasonStats.MinutesPerGame.toFixed(1),
    //   }));
    //   topRushers = leagueStats.TopAssists.slice(0, 3).map((player: BasketballPlayer) => ({
    //     name: `${player.FirstName} ${player.LastName}`,
    //     teamAbbr: player.TeamAbbr,
    //     logoUrl: player.TeamLogo,
    //     stat1: "Assists Per Game",
    //     stat1Value: player.SeasonStats.AssistsPerGame.toFixed(1),
    //     stat2: "Minutes Per Game",
    //     stat2Value: player.SeasonStats.MinutesPerGame.toFixed(1),
    //   }));
    //   topReceivers = leagueStats.TopRebounds.slice(0, 3).map((player: BasketballPlayer) => ({
    //     name: `${player.FirstName} ${player.LastName}`,
    //     teamAbbr: player.TeamAbbr,
    //     logoUrl: player.TeamLogo,
    //     stat1: "Rebounds Per Game",
    //     stat1Value: player.SeasonStats.ReboundsPerGame.toFixed(1),
    //     stat2: "Minutes Per Game",
    //     stat2Value: player.SeasonStats.MinutesPerGame.toFixed(1),
    //   }));
    //   break;

    // case "SimCHL":
    // case "SimPHL":
    //   topPassers = leagueStats.TopPoints.slice(0, 3).map((player: HockeyPlayer) => ({
    //     name: `${player.FirstName} ${player.LastName}`,
    //     teamAbbr: player.TeamAbbr,
    //     logoUrl: player.TeamLogo,
    //     stat1: "Points",
    //     stat1Value: player.SeasonStats.Points,
    //     stat2: "Time On Ice",
    //     stat2Value: player.SeasonStats.TimeOnIce.toFixed(1),
    //   }));
    //   topRushers = leagueStats.TopGoals.slice(0, 3).map((player: HockeyPlayer) => ({
    //     name: `${player.FirstName} ${player.LastName}`,
    //     teamAbbr: player.TeamAbbr,
    //     logoUrl: player.TeamLogo,
    //     stat1: "Goals",
    //     stat1Value: player.SeasonStats.Goals,
    //     stat2: "Time On Ice",
    //     stat2Value: player.SeasonStats.TimeOnIce.toFixed(1),
    //   }));
    //   topReceivers = leagueStats.TopAssists.slice(0, 3).map((player: HockeyPlayer) => ({
    //     name: `${player.FirstName} ${player.LastName}`,
    //     teamAbbr: player.TeamAbbr,
    //     logoUrl: player.TeamLogo,
    //     stat1: "Assists",
    //     stat1Value: player.SeasonStats.Assists,
    //     stat2: "Time On Ice",
    //     stat2Value: player.SeasonStats.TimeOnIce.toFixed(1),
    //   }));
    //   break;

    default:
      break;
  }

  return { topPassers, topRushers, topReceivers };
};