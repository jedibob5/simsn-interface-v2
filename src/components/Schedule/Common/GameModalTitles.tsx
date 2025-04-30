export const fbSchemes = "Schemes";
export const fbPassing = "Passing Stats";
export const fbRushing = "Rushing Stats";
export const fbReceiving = "Receiving Stats";
export const fbDefensive = "Defensive Stats";
export const fbSpecialTeams = "Special Teams Stats";
export const hkForwards = "Forwards Stats";
export const hkDefensemen = "Defensemen Stats";
export const hkGoalies = "Goalies Stats";

export const headersMapping = {
  SimCFB: [
    fbSchemes,
    fbPassing,
    fbRushing,
    fbReceiving,
    fbDefensive,
  ],
  SimNFL: [
    fbSchemes,
    fbPassing,
    fbRushing,
    fbReceiving,
    fbDefensive,
  ],
  SimCHL: [
    hkForwards,
    hkDefensemen,
    hkGoalies,
  ],
  SimPHL: [
    hkForwards,
    hkDefensemen,
    hkGoalies,
  ],
} as const;

export type LeagueType = keyof typeof headersMapping;