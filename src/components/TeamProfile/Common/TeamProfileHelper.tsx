import React from "react";
import { CollegeTeamProfileData, FlexComparisonModel } from "../../../models/footballModels";

type TeamProfileType = CollegeTeamProfileData;
type SelectedTeamType = { ID: number; [key: string]: any };
type TeamMapType = any;

export function processRivalries(
  teamProfile: TeamProfileType,
  selectedTeam: SelectedTeamType,
  cfbTeamMap: TeamMapType
) {
  const winsColor = "#189E5B";
  const lossesColor = "#ef4444";

  if (!Array.isArray(teamProfile?.Rivalries)) return [];

  return teamProfile.Rivalries.map((rivalry: FlexComparisonModel) => {
    const isTeamOne = rivalry.TeamOneID === selectedTeam.ID;
    const selectedTeamName = isTeamOne ? rivalry.TeamOne : rivalry.TeamTwo;
    const selectedTeamMScore = isTeamOne ? rivalry.TeamOneMScore : rivalry.TeamTwoMScore;
    const selectedTeamMSeason = isTeamOne ? rivalry.TeamOneMSeason : rivalry.TeamTwoMSeason;
    const opponentTeamMScore = isTeamOne ? rivalry.TeamTwoMScore : rivalry.TeamOneMScore;
    const opponentTeamMSeason = isTeamOne ? rivalry.TeamTwoMSeason : rivalry.TeamOneMSeason;
    const selectedTeamWins = isTeamOne ? rivalry.TeamOneWins : rivalry.TeamTwoWins;
    const selectedTeamLosses = isTeamOne ? rivalry.TeamOneLosses : rivalry.TeamTwoLosses;

    const opponentTeamName = isTeamOne
      ? cfbTeamMap?.[rivalry.TeamTwoID]?.TeamName || rivalry.TeamTwo || "Unknown"
      : cfbTeamMap?.[rivalry.TeamOneID]?.TeamName || rivalry.TeamOne || "Unknown";
    const opponentTeamId = isTeamOne ? rivalry.TeamTwoID : rivalry.TeamOneID;
    let selectedTeamLeads = false;
    let rivalryTie = false;
    const opponentTeamWins = isTeamOne ? rivalry.TeamTwoWins : rivalry.TeamOneWins;
    if (selectedTeamWins > opponentTeamWins) selectedTeamLeads = true;
    else if (selectedTeamWins === opponentTeamWins) rivalryTie = true;

    const rivalryColor = selectedTeamLeads ? winsColor : lossesColor;
    const latestWin = rivalry.LatestWin;
    const selectedTeamWonLatest = latestWin === selectedTeamName;

    function swapScore(score: string) {
      const [a, b] = score.split("-").map(s => s.trim());
      return `${b}-${a}`;
    }

    let latestResultScore = "";
    let latestResultSeason;
    if (selectedTeamWonLatest) {
      latestResultScore = selectedTeamMScore;
      latestResultSeason = selectedTeamMSeason;
    } else {
      latestResultScore = swapScore(opponentTeamMScore);
      latestResultSeason = opponentTeamMSeason;
    }
    const latestResultColor = selectedTeamWonLatest ? winsColor : lossesColor;

    const streakIsWin = selectedTeamWonLatest;
    const streakColor = streakIsWin ? winsColor : lossesColor;
    const streakLabel =
      Math.abs(rivalry.CurrentStreak) === 1
        ? (streakIsWin ? "Win" : "Loss")
        : (streakIsWin ? "Wins" : "Losses");
    const streakText =
      rivalry.CurrentStreak !== 0
        ? `${Math.abs(rivalry.CurrentStreak)} ${streakLabel}`
        : "No Current Streak";

    return {
      ...rivalry,
      selectedTeamName,
      selectedTeamWins,
      selectedTeamLosses,
      opponentTeamName,
      opponentTeamId,
      selectedTeamLeads,
      rivalryTie,
      rivalryColor,
      winsColor,
      lossesColor,
      latestResultScore,
      latestResultColor,
      latestResultSeason,
      streakColor,
      streakText,
    };
  });
}

export function processTopPlayers(careerStats: any[], playerMap: { [key: number]: any }) {
  const enhancedStats = careerStats.map(stat => {
    const player = playerMap[stat.CollegePlayerID];
    return {
      ...stat,
      FirstName: player?.FirstName || "",
      LastName: player?.LastName || "",
      Position: player?.Position || "",
    };
  });

  const topPassing = [...enhancedStats]
    .sort((a, b) => (b.PassingYards || 0) - (a.PassingYards || 0))
    .filter(p => p.PassingYards > 0);

  const topRushing = [...enhancedStats]
    .sort((a, b) => (b.RushingYards || 0) - (a.RushingYards || 0))
    .filter(p => p.RushingYards > 0);

  const topReceiving = [...enhancedStats]
    .sort((a, b) => (b.ReceivingYards || 0) - (a.ReceivingYards || 0))
    .filter(p => p.ReceivingYards > 0);

  const topTackles = [...enhancedStats]
    .sort((a, b) => (b.Tackles || 0) - (a.Tackles || 0))
    .filter(p => p.Tackles > 0);

  const topSacks = [...enhancedStats]
    .sort((a, b) => (b.Sacks || 0) - (a.Sacks || 0))
    .filter(p => p.Sacks > 0);

  const topINTs = [...enhancedStats]
    .sort((a, b) => (b.Interceptions || 0) - (a.Interceptions || 0))
    .filter(p => p.Interceptions > 0);

  return {
    topPassing,
    topRushing,
    topReceiving,
    topTackles,
    topSacks,
    topINTs,
  };
}