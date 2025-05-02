import { CollegePlayerGameStats } from "../../../models/hockeyModels";

export interface PlayByPlay {
  [key: string]: any;
}
export interface PlayerStats {
  Position: string;
  FirstName: string;
  LastName: string;
  PassAttempts?: number;
  PassCompletions?: number;
  PassingYards?: number;
  PassingTDs?: number;
  Interceptions?: number;
  RushAttempts?: number;
  Targets?: number;
  Pancakes?: number;
  SacksAllowed?: number;
  Sacks?: number;
}

export interface FilteredStats {
  PassingStats: PlayerStats[];
  RushingStats: PlayerStats[];
  ReceivingStats: PlayerStats[];
  DefenseStats: PlayerStats[];
  SpecialTeamStats: PlayerStats[];
  OLineStats: PlayerStats[];
}

export interface GameResult {
  HomePlayers: PlayerStats[];
  AwayPlayers: PlayerStats[];
  PlayByPlays: PlayByPlay[];
  Score: string;
}

export interface HockeyPlayerStats {
  Position: string;
  FirstName: string;
  LastName: string;
  PassAttempts?: number;
  PassCompletions?: number;
  PassingYards?: number;
  PassingTDs?: number;
  Interceptions?: number;
  RushAttempts?: number;
  Targets?: number;
  Pancakes?: number;
  SacksAllowed?: number;
  Sacks?: number;
}

export interface HockeyFilteredStats {
  ForwardsStats: CollegePlayerGameStats[];
  DefensemenStats: CollegePlayerGameStats[];
  GoalieStats: CollegePlayerGameStats[];
}

export interface HockeyGameResult {
  HomePlayers: PlayerStats[];
  AwayPlayers: PlayerStats[];
  PlayByPlays: PlayByPlay[];
  Score: string;
}