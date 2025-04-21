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
import { RevealFBResults, RevealHCKResults } from "../../../_helper/teamHelper";
import { getLogo } from "../../../_utility/getLogo";
import { 
  SimCHL, 
  SimPHL, 
  SimNFL, 
  Divisions, 
  CHLConferenceNames, 
  PHLConferenceNames, 
  PHLDivisionNames 
} from "../../../_constants/constants";

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

export const getScheduleNFLData = (
  team: any,
  currentWeek: any,
  selectedWeek: any,
  selectedSeason: any,
  league: League,
  allNFLStandings: NFLStandings[],
  allNFLGames: NFLGame[],
  allNFLTeams: NFLTeam[],
) => {
    // Team Standings
    const teamStandings = allNFLStandings
      .filter((standings) => standings.ConferenceID === team.ConferenceID)
      .map((standings, index) => ({ ...standings, Rank: index + 1 }));

    const teamAbbrMap = new Map(allNFLTeams.map((team) => [team.ID, team.TeamAbbr]));

    // Team Schedule
    const teamSchedule = allNFLGames
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
    console.log(allCHLStandings)
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
    
     // Weekly Games
     const groupedWeeklyGames = allCollegeGames.reduce((acc: any, game) => {
      if (!acc[game.Week]) {
        acc[game.Week] = [];
      }
      acc[game.Week].push({
        ...game,
        HomeTeamAbbr: teamAbbrMap.get(game.HomeTeamID),
        AwayTeamAbbr: teamAbbrMap.get(game.AwayTeamID),
      });
      return acc;
    }, {});

    return {
      teamStandings,
      teamSchedule,
      groupedWeeklyGames,
  };
};

export const getSchedulePHLData = (
  team: any,
  currentWeek: any,
  selectedWeek: any,
  selectedSeason: any,
  league: League,
  allPHLStandings: PHLStandings[],
  allPHLGames: PHLGame[],
  allPHLTeams: PHLTeam[],
) => {
    // Team Standings
    const teamStandings = allPHLStandings
      .filter((standings) => standings.ConferenceID === team.ConferenceID)
      .map((standings, index) => ({ ...standings, Rank: index + 1 }));

    const teamAbbrMap = new Map(allPHLTeams.map((team) => [team.ID, team.Abbreviation]));

    // Team Schedule
    const teamSchedule = allPHLGames
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

export const processSchedule = (schedule: any[], team: any, ts: any, league: League) => {
  let weekCounter: { [key: number]: number } = {};
console.log(team)
  return schedule.map((game) => {
    const revealResult =
      league === SimCHL || league === SimPHL
        ? RevealHCKResults(game, ts)
        : RevealFBResults(game, ts, league);

    const isHomeGame = game.HomeTeamID === team.ID;
    const opponentLabel = isHomeGame ? game.AwayTeamAbbr : game.HomeTeamAbbr;
    const opponentLogo = getLogo(league, isHomeGame ? game.AwayTeamID : game.HomeTeamID, false);

    let userWin = false;
    let userLoss = false;
    let gameScore = "TBC";
    let headerGameScore = "TBC";

    if (revealResult) {
      const userTeamScore = isHomeGame ? game.HomeTeamScore : game.AwayTeamScore;
      const opponentScore = isHomeGame ? game.AwayTeamScore : game.HomeTeamScore;
      userWin = userTeamScore > opponentScore;
      userLoss = userTeamScore < opponentScore;

      if (game.HomeTeamScore === 0 && game.AwayTeamScore === 0) {
        gameScore = "TBC";
        headerGameScore = "TBC";
      } else {
        gameScore = `${game.HomeTeamScore} - ${game.AwayTeamScore}`;
        headerGameScore = `${userTeamScore} - ${opponentScore}`;
      }
    }

    let weekLabel = `${game.Week}`;
    if (league === SimCHL || league === SimPHL) {
      if (!weekCounter[game.Week]) {
        weekCounter[game.Week] = 0;
      }
      weekCounter[game.Week] += 1;

      const suffix = league === SimCHL
        ? weekCounter[game.Week] === 1
          ? "A"
          : "B"
        : weekCounter[game.Week] === 1
        ? "A"
        : weekCounter[game.Week] === 2
        ? "B"
        : "C";

      weekLabel += suffix;
    }

    return {
      ...game,
      opponentLabel,
      opponentLogo,
      userWin,
      userLoss,
      gameScore,
      headerGameScore,
      gameLocation: isHomeGame ? "vs" : "@",
      weekLabel,
    };
  });
};

export const processLeagueStandings = (
  standings: any[],
  customOrder: string[],
  league: League,
  category?: string
) => {
  if (league === SimCHL) {
    standings = standings.map((team) => {
      const conference = CHLConferenceNames.find((conf) => conf.value === team.ConferenceID.toString());
      return {
        ...team,
        ConferenceName: conference ? conference.name : "Unknown",
      };
    });
  } else if (league === SimPHL) {
    if (category === Divisions) {
      standings = standings.map((team) => {
        const division = PHLDivisionNames.find((div) => div.value === team.DivisionID.toString());
        return {
          ...team,
          DivisionName: division ? division.name : "Unknown",
        };
      });
    } else {
      standings = standings.map((team) => {
        const conference = PHLConferenceNames.find((conf) => conf.value === team.ConferenceID.toString());
        return {
          ...team,
          ConferenceName: conference ? conference.name : "Unknown",
        };
      });
    }
  } else if (league === SimNFL) {
    if (category === Divisions) {
      standings = standings.map((team) => ({
        ...team,
        GroupKey: `${team.ConferenceName} ${team.DivisionName}`,
      }));
    }
  }

  const groupedStandings = standings.reduce((acc: any, team) => {
    const groupKey =
      league === SimNFL && category === Divisions
        ? team.GroupKey
        : category === Divisions
        ? team.DivisionName
        : team.ConferenceName;

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(team);
    return acc;
  }, {});

  const sortedGroupNames = Object.keys(groupedStandings).sort((a, b) => {
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.localeCompare(b);
  });

  return { groupedStandings, sortedGroupNames };
};