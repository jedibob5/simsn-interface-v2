import { DraftPick, ProfessionalPlayer } from "../../models/hockeyModels";

export interface TradeBlockRow {
  id: number;
  isPlayer: boolean;
  name: string;
  position: string;
  arch: string;
  year: string;
  overall: string;
  draftRound: string;
  draftPick: string;
  value: string;
  player?: ProfessionalPlayer;
  pick?: DraftPick;
  season?: number;
}
