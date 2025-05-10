import { TradeProposal } from "../../../models/hockeyModels";
import { TradeBlockRow } from "../TeamPageTypes";

export const getTradeOptionsList = (rows: TradeBlockRow[]) => {
  const list: { label: string; value: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    const label = item.isPlayer
      ? `${item.position} ${item.name} ${item.overall}`
      : `${item.season} Round ${item.draftRound}, Pick ${item.draftPick}`;

    // Keep index as the value.
    const value = i.toString();
    const obj = { label: label, value: value };
    list.push(obj);
  }

  return list;
};

export const mapSelectedOptionsToTradeOptions = (
  rows: TradeBlockRow[],
  teamID: number
): any[] => {
  const list = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const obj = {
      TeamID: teamID,
      PlayerID: row.isPlayer ? row.id : 0,
      OptionType: row.isPlayer ? "Player" : "DraftPick",
      DraftPickID: row.isPlayer ? 0 : row.id,
      Player: row.player,
      Draftpick: row.pick,
      SalaryPercentage: 0,
    };
    list.push(obj);
  }
  return list;
};

export const mapTradeProposals = (
  proposals: TradeProposal[],
  teamID: number
): TradeProposal[] => {
  const list: TradeProposal[] = [];

  for (let i = 0; i < proposals.length; i++) {
    const item = proposals[i];
    const obj = new TradeProposal({
      ...item,
      TeamTradeOptions: item.TeamTradeOptions.filter(
        (x) => x.TeamID === teamID
      ),
      RecepientTeamTradeOptions: item.TeamTradeOptions.filter(
        (x) => x.TeamID !== teamID
      ),
    });
    list.push(obj);
  }
  return list;
};
