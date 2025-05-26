import React from "react";
import { CollegeTeamProfileData, FlexComparisonModel } from "../../../models/footballModels";
import { Trophy, CrossCircle } from "../../../_design/Icons";

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
    } else if (!selectedTeamWonLatest && rivalry.LatestWin) {
      latestResultScore = swapScore(opponentTeamMScore);
      latestResultSeason = opponentTeamMSeason;
    } else {
      latestResultScore = "N/A";
      latestResultSeason = "N/A";
    }

    const latestResultColor = selectedTeamWonLatest 
                                ? `text-[${winsColor}]` 
                                : !selectedTeamWonLatest && rivalry.LatestWin
                                  ? `text-red-500`
                                  : `text-inherit`

    const streakIsWin = selectedTeamWonLatest;
    const streakColor = streakIsWin ? `text-[${winsColor}]` : `text-red-500`;
    const streakLabel =
      Math.abs(rivalry.CurrentStreak) === 1
        ? (streakIsWin ? "Win" : "Loss")
        : (streakIsWin ? "Wins" : "Losses");
    const streakText =
      rivalry.CurrentStreak !== 0
        ? `${Math.abs(rivalry.CurrentStreak)} ${streakLabel}`
        : "N/A";

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
    .sort((a, b) => (b.SacksMade || 0) - (a.SacksMade || 0))
    .filter(p => p.SacksMade > 0);

  const topINTs = [...enhancedStats]
    .sort((a, b) => (b.InterceptionsCaught || 0) - (a.InterceptionsCaught || 0))
    .filter(p => p.InterceptionsCaught > 0);

  return {
    topPassing,
    topRushing,
    topReceiving,
    topTackles,
    topSacks,
    topINTs,
  };
};

export function processSeasonHistory(collegeStandings: any[]): { processedSeasonHistory: any[]; totalWins: number; totalLosses: number } {
  if (!Array.isArray(collegeStandings)) return { processedSeasonHistory: [], totalWins: 0, totalLosses: 0 };

  let totalWins = 0;
  let totalLosses = 0;

  const processedSeasonHistory = [...collegeStandings]
    .sort((a, b) => b.SeasonID - a.SeasonID)
    .reduce((acc, record, idx) => {
      totalWins += record.TotalWins || 0;
      totalLosses += record.TotalLosses || 0;

      if (record.Season === 0) {
        const prevSeason = acc[idx - 1]?.Season ?? new Date().getFullYear();
        const updated = Object.assign(
          Object.create(Object.getPrototypeOf(record)),
          record,
          { Season: prevSeason - 1 }
        );
        acc.push(updated);
      } else {
        acc.push(record);
      }
      return acc;
    }, []);

  return { processedSeasonHistory, totalWins, totalLosses };
}

export interface FBATrophies {
  NationalChampionshipWins: number[];
  NationalChampionshipLosses: number[];
  ConferenceChampionshipWins: number[];
  ConferenceChampionshipLosses: number[];
  BowlWins: number[];
  BowlLosses: number[];
  PlayoffAppearances: number[];
}

export function processTeamTrophies(games: any[], teamId: number): FBATrophies {
  const NationalChampionshipWins: number[] = [];
  const NationalChampionshipLosses: number[] = [];
  const ConferenceChampionshipWins: number[] = [];
  const ConferenceChampionshipLosses: number[] = [];
  const BowlWins: number[] = [];
  const BowlLosses: number[] = [];
  const PlayoffAppearancesSet = new Set<number>();

  for (const game of games) {
    if (!game.GameComplete) continue;

    const seasonId = game.SeasonID;
    const isAway = game.AwayTeamID === teamId;
    const isHome = game.HomeTeamID === teamId;
    const teamWon = (isAway && game.AwayTeamWin) || (isHome && game.HomeTeamWin);

    if (game.IsNationalChampionship) {
      if (teamWon) {
        NationalChampionshipWins.push(seasonId);
      } else if (isHome || isAway) {
        NationalChampionshipLosses.push(seasonId);
      }
    }

    if (game.IsConferenceChampionship) {
      if (teamWon) {
        ConferenceChampionshipWins.push(seasonId);
      } else if (isHome || isAway) {
        ConferenceChampionshipLosses.push(seasonId);
      }
    }

    if (game.IsBowlGame) {
      if (teamWon) {
        BowlWins.push(seasonId);
      } else if (isHome || isAway) {
        BowlLosses.push(seasonId);
      }
    }

    if (game.IsPlayoffGame && (isHome || isAway)) {
      PlayoffAppearancesSet.add(seasonId);
    }
  }

  return {
    NationalChampionshipWins,
    NationalChampionshipLosses,
    ConferenceChampionshipWins,
    ConferenceChampionshipLosses,
    BowlWins,
    BowlLosses,
    PlayoffAppearances: Array.from(PlayoffAppearancesSet).sort((a, b) => b - a),
  };
}

export const getFBAStatColumns = (
  type: "Passing" | "Rushing" | "Receiving" | "Tackles" | "Sacks" | "Interceptions" = "Passing"
) => {
  const rankColumn = {
    header: "#",
    accessor: "Rank",
    render: (_row: any, idx: number) => idx + 1,
  };

  switch (type) {
    case "Passing":
      return [
        rankColumn,
        {
          header: "Player",
          accessor: "Player",
          render: (row: any) => `${row.Position} ${row.FirstName} ${row.LastName}`,
        },
        { header: "TD", accessor: "PassingTDs" },
        { header: "INT", accessor: "Interceptions" },
        { header: "Yards", accessor: "PassingYards" },
      ];
    case "Rushing":
      return [
        rankColumn,
        {
          header: "Player",
          accessor: "Player",
          render: (row: any) => `${row.Position} ${row.FirstName} ${row.LastName}`,
        },
        { header: "Yards", accessor: "RushingYards" },
        { header: "TD", accessor: "RushingTDs" },
      ];
    case "Receiving":
      return [
        rankColumn,
        {
          header: "Player",
          accessor: "Player",
          render: (row: any) => `${row.Position} ${row.FirstName} ${row.LastName}`,
        },
        { header: "Yards", accessor: "ReceivingYards" },
        { header: "TD", accessor: "ReceivingTDs" },
      ];
    case "Tackles":
      return [
        rankColumn,
        {
          header: "Player",
          accessor: "Player",
          render: (row: any) => `${row.Position} ${row.FirstName} ${row.LastName}`,
        },
        { header: "Tackles", accessor: "SoloTackles" },
        { header: "TFL", accessor: "TacklesForLoss" },
      ];
    case "Sacks":
      return [
        rankColumn,
        {
          header: "Player",
          accessor: "Player",
          render: (row: any) => `${row.Position} ${row.FirstName} ${row.LastName}`,
        },
        { header: "Sacks", accessor: "SacksMade" },
        { header: "FF", accessor: "ForcedFumbles" },
      ];
    case "Interceptions":
      return [
        rankColumn,
        {
          header: "Player",
          accessor: "Player",
          render: (row: any) => `${row.Position} ${row.FirstName} ${row.LastName}`,
        },
        { header: "INT", accessor: "InterceptionsCaught" },
        { header: "PD", accessor: "PassDeflections" },
      ];
    default:
      return [];
  }
};

export const getFBAPastSeasonColumns = (
  winsColor: string,
  textColorClass: string,
  teamTrophies: FBATrophies,
) => [
  {
    header: "Season",
    accessor: "Season",
    render: (row: any) => <span className={textColorClass}>{row.Season}</span>,
  },
  {
    header: "Coach",
    accessor: "Coach",
    render: (row: any) => <span className={textColorClass}>{row.Coach}</span>,
  },
  {
    header: "Record",
    accessor: "Record",
    render: (row: any) => (
      <span className="flex items-center">
        <span
          className={
            row.TotalWins > row.TotalLosses
              ? `text-[${winsColor}] w-1/3`
              : row.TotalWins < row.TotalLosses
                ? `text-red-500 w-1/3`
                : textColorClass
          }
        >
          {row.TotalWins}
        </span>
        <span
          className={
            row.TotalWins > row.TotalLosses
              ? `text-[${winsColor}] w-1/5`
              : row.TotalWins < row.TotalLosses
                ? `text-red-500 w-1/5`
                : textColorClass
          }
        >
          -
        </span>
        <span
          className={
            row.TotalWins > row.TotalLosses
              ? `text-[${winsColor}] w-1/3`
              : row.TotalWins < row.TotalLosses
                ? `text-red-500 w-1/3`
                : textColorClass
          }
        >
          {row.TotalLosses}
        </span>
      </span>
    ),
  },
{
    header: "Post-Season",
    accessor: "PostSeasonStatus",
    render: (row: any) => {
      const seasonId = row.SeasonID;
      if (!teamTrophies) {
        return (
          <span className="flex items-center gap-2">
            <CrossCircle textColorClass="text-red-500" />
            <span>Nothing</span>
          </span>
        );
      }
      if (teamTrophies.NationalChampionshipWins.includes(seasonId)) {
        return (
          <span className="flex items-center gap-2">
            <Trophy textColorClass="text-yellow-500" />
            <span>National Champions</span>
          </span>
        );
      } else if (teamTrophies.NationalChampionshipLosses.includes(seasonId)) {
        return (
          <span className="flex items-center gap-2">
            <Trophy textColorClass="text-gray-400" />
            <span>Runners Up</span>
          </span>
        );
      } else if (teamTrophies.PlayoffAppearances.includes(seasonId)) {
        return (
          <span className="flex items-center gap-2">
            <Trophy textColorClass="text-blue-500" />
            <span>Play-Offs</span>
          </span>
        );
      } else {
        return (
          <span className="flex items-center gap-2">
            <CrossCircle textColorClass="text-red-500" />
            <span>None</span>
          </span>
        );
      }
    },
  },
];