export interface PlayerStats {
  PassAttempts?: number;
  RushAttempts?: number;
  Targets?: number;
  Position: string;
  Pancakes?: number;
  SacksAllowed?: number;
}

export interface FilteredStats {
  PassingStats: PlayerStats[];
  RushingStats: PlayerStats[];
  ReceivingStats: PlayerStats[];
  DefenseStats: PlayerStats[];
  SpecialTeamStats: PlayerStats[];
  OLineStats: PlayerStats[];
}

export interface PlayByPlay {
  [key: string]: any;
}

export interface GameResult {
  HomePlayers: PlayerStats[];
  AwayPlayers: PlayerStats[];
  PlayByPlays: PlayByPlay[];
  Score: string;
}