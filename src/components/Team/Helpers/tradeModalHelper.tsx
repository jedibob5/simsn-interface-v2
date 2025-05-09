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
