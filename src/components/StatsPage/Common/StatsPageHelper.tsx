import {
  League,
  PLAYER_VIEW,
  SEASON_VIEW,
  SimCBB,
  SimCHL,
  SimNBA,
  SimNFL,
  SimPHL,
  StatsType,
  StatsView,
  TEAM_VIEW,
} from "../../../_constants/constants";
import { isSeasonStats } from "../../../_helper/statsPageHelper";
import {
  CollegePlayerGameStats,
  CollegePlayerSeasonStats,
  CollegeTeamGameStats,
  CollegeTeamSeasonStats,
  ProfessionalPlayerGameStats,
  ProfessionalPlayerSeasonStats,
  ProfessionalTeamGameStats,
  ProfessionalTeamSeasonStats,
} from "../../../models/hockeyModels";

export const GetStatsColumns = (
  league: League,
  statsType: StatsType,
  statsView: StatsView,
  isMobile: boolean,
  isGoalie: boolean
) => {
  if (league === SimCHL || league === SimPHL) {
    return GetHockeyStatsColumns(
      league,
      statsType,
      statsView,
      isMobile,
      isGoalie
    );
  }
  if (league === SimCBB || league === SimNBA) {
    return GetBasketballStatsColumns(league, statsType, statsView, isMobile);
  }
  return GetFootballStatsColumns(league, statsType, statsView, isMobile);
};

// Update as needed for viewing Football stats
export const GetFootballStatsColumns = (
  league: League,
  statsType: StatsType,
  statsView: StatsView,
  isMobile: boolean
) => {
  return [];
};

// Update as needed for viewing Basketball stats
export const GetBasketballStatsColumns = (
  league: League,
  statsType: StatsType,
  statsView: StatsView,
  isMobile: boolean
) => {
  return [];
};

export const GetHockeyStatsColumns = (
  league: League,
  statsType: StatsType,
  statsView: StatsView,
  isMobile: boolean,
  isGoalie: boolean
) => {
  let columns = [{ header: "Team", accessor: "TeamName" }];

  if (statsType === PLAYER_VIEW) {
    columns = columns.concat([
      { header: "Name", accessor: "LastName" },
      { header: "Pos", accessor: "Position" },
      { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
      { header: "Exp", accessor: "Year" },
      { header: "Ovr", accessor: "Overall" },
    ]);
  }

  if (statsView === SEASON_VIEW) {
    columns = columns.concat([{ header: "GP", accessor: "GamesPlayed" }]);
    if (statsType === PLAYER_VIEW) {
      columns.push({ header: "GS", accessor: "GamesStarted" });
    }
  }

  if (statsType === PLAYER_VIEW) {
    if (!isGoalie) {
      // skater stats
      columns = columns.concat([
        { header: "G", accessor: "Goals" },
        { header: "A", accessor: "Assists" },
        { header: "P", accessor: "Points" },
        { header: "+/-", accessor: "PlusMinus" },
        { header: "PIM", accessor: "PenaltyMinutes" },
        { header: "ESG", accessor: "EvenStrengthGoals" },
        { header: "ESP", accessor: "EvenStrengthPoints" },
        { header: "PPG", accessor: "PowerPlayGoals" },
        { header: "PPP", accessor: "PowerPlayPoints" },
        { header: "SHG", accessor: "ShorthandedGoals" },
        { header: "SHP", accessor: "ShorthandedPoints" },
        { header: "OTG", accessor: "OvertimeGoals" },
        { header: "GWG", accessor: "GameWinningGoals" },
        { header: "SOG", accessor: "Shots" },
        { header: "S%", accessor: "ShootingPercentage" },
        { header: "FO%", accessor: "FaceOffWinPercentage" },
        { header: "FOW", accessor: "FaceOffsWon" },
        { header: "FOA", accessor: "FaceOffs" },
      ]);
    } else {
      // goalie stats
      columns = columns.concat([
        { header: "W", accessor: "GoalieWins" },
        { header: "L", accessor: "GoalieLosses" },
        { header: "T", accessor: "GoalieTies" },
        { header: "OTL", accessor: "OvertimeLosses" },

        { header: "SA", accessor: "ShotsAgainst" },
        { header: "SV", accessor: "Saves" },
        { header: "SV%", accessor: "SavePercentage" },

        { header: "SO", accessor: "Shutouts" },
      ]);
    }
  } else if (statsType === TEAM_VIEW) {
    columns = columns.concat([
      { header: "GF", accessor: "GoalsFor" },
      { header: "GA", accessor: "GoalsAgainst" },
      { header: "A", accessor: "Assists" },
      { header: "P", accessor: "Points" },
      { header: "1st", accessor: "Period1Score" },
      { header: "2nd", accessor: "Period2Score" },
      { header: "3rd", accessor: "Period3Score" },
      { header: "OT", accessor: "OTScore" },
      { header: "+/-", accessor: "PlusMinus" },
      { header: "PIM", accessor: "PenaltyMinutes" },
      { header: "ESG", accessor: "EvenStrengthGoals" },
      { header: "ESP", accessor: "EvenStrengthPoints" },
      { header: "PPG", accessor: "PowerPlayGoals" },
      { header: "PPP", accessor: "PowerPlayPoints" },
      { header: "SHG", accessor: "ShorthandedGoals" },
      { header: "SHP", accessor: "ShorthandedPoints" },
      { header: "OTG", accessor: "OvertimeGoals" },
      { header: "GWG", accessor: "GameWinningGoals" },
      { header: "SOG", accessor: "Shots" },
      { header: "S%", accessor: "ShootingPercentage" },
      { header: "FO%", accessor: "FaceOffWinPercentage" },
      { header: "FOW", accessor: "FaceOffsWon" },
      { header: "FOA", accessor: "FaceOffs" },
      { header: "SA", accessor: "ShotsAgainst" },
      { header: "SV", accessor: "Saves" },
      { header: "SV%", accessor: "SavePercentage" },
      { header: "SO", accessor: "Shutouts" },
    ]);
  }

  return columns;
};

export const GetHockeyPlayerStatsValues = (
  stats:
    | CollegePlayerGameStats
    | CollegePlayerSeasonStats
    | ProfessionalPlayerGameStats
    | ProfessionalPlayerSeasonStats,
  statsView: StatsView,
  isGoalie: boolean
) => {
  let values: any[] = [];
  if (statsView === SEASON_VIEW && isSeasonStats(stats)) {
    values = values.concat([
      { label: "GP", value: stats.GamesPlayed },
      { label: "GS", value: stats.GamesStarted },
    ]);
  }
  if (!isGoalie) {
    values = values.concat([
      { label: "G", value: stats.Goals },
      { label: "A", value: stats.Assists },
      { label: "P", value: stats.Points },
      { label: "+/-", value: stats.PlusMinus },
      { label: "PIM", value: stats.PenaltyMinutes },
      { label: "ESG", value: stats.EvenStrengthGoals },
      { label: "ESP", value: stats.EvenStrengthPoints },
      { label: "PPG", value: stats.PowerPlayGoals },
      { label: "PPP", value: stats.PowerPlayPoints },
      { label: "SHG", value: stats.ShorthandedGoals },
      { label: "SHP", value: stats.ShorthandedPoints },
      { label: "OTG", value: stats.OvertimeGoals },
      { label: "GWG", value: stats.GameWinningGoals },
      { label: "SOG", value: stats.Shots },
      { label: "S%", value: stats.ShootingPercentage.toFixed(3) },
      { label: "FO%", value: stats.FaceOffWinPercentage.toFixed(3) },
      { label: "FOW", value: stats.FaceOffsWon },
      { label: "FOA", value: stats.FaceOffs },
    ]);
  } else {
    values = values.concat([
      { label: "W", value: stats.GoalieWins },
      { label: "L", value: stats.GoalieLosses },
      { label: "T", value: stats.GoalieTies },
      { label: "OTL", value: stats.OvertimeLosses },
      { label: "SA", value: stats.ShotsAgainst },
      { label: "SV", value: stats.Saves },
      { label: "SV%", value: stats.SavePercentage.toFixed(3) },
      { label: "SO", value: stats.Shutouts },
    ]);
  }
  return values;
};

export const GetHockeyTeamStatsValues = (
  stats:
    | CollegeTeamGameStats
    | CollegeTeamSeasonStats
    | ProfessionalTeamGameStats
    | ProfessionalTeamSeasonStats,
  statsView: StatsView
) => {
  let values: any[] = [];
  if (
    statsView === SEASON_VIEW &&
    (stats instanceof CollegeTeamSeasonStats ||
      stats instanceof ProfessionalTeamSeasonStats)
  ) {
    values = values.concat([{ label: "GP", value: stats.GamesPlayed }]);
  }
  values = values.concat([
    { label: "GF", value: stats.GoalsFor },
    { label: "GA", value: stats.GoalsAgainst },
    { label: "A", value: stats.Assists },
    { label: "P", value: stats.Points },
    { label: "1st", value: stats.Period1Score },
    { label: "2nd", value: stats.Period2Score },
    { label: "3rd", value: stats.Period3Score },
    { label: "OT", value: stats.OTScore },
    { label: "+/-", value: stats.PlusMinus },
    { label: "PIM", value: stats.PenaltyMinutes },
    { label: "ESG", value: stats.EvenStrengthGoals },
    { label: "ESP", value: stats.EvenStrengthPoints },
    { label: "PPG", value: stats.PowerPlayGoals },
    { label: "PPP", value: stats.PowerPlayPoints },
    { label: "SHG", value: stats.ShorthandedGoals },
    { label: "SHP", value: stats.ShorthandedPoints },
    { label: "OTG", value: stats.OvertimeGoals },
    { label: "GWG", value: stats.GameWinningGoals },
    { label: "SOG", value: stats.Shots },
    { label: "S%", value: stats.ShootingPercentage.toFixed(3) },
    { label: "FO%", value: stats.FaceOffWinPercentage.toFixed(3) },
    { label: "FOW", value: stats.FaceOffsWon },
    { label: "FOA", value: stats.FaceOffs },
    { label: "SA", value: stats.ShotsAgainst },
    { label: "SV", value: stats.Saves },
    { label: "SV%", value: stats.SavePercentage.toFixed(3) },
    { label: "SO", value: stats.Shutouts },
  ]);
  return values;
};
