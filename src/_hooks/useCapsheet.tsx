import { League, SimNBA, SimNFL, SimPHL } from "../_constants/constants";
import { NBACapsheet } from "../models/basketballModels";
import { NFLCapsheet } from "../models/footballModels";
import { ProCapsheet } from "../models/hockeyModels";

interface CapsheetProps {
  capsheet: ProCapsheet | NFLCapsheet | NBACapsheet;
  league: League;
}

export const useCapsheet = (
  capsheet: ProCapsheet | NFLCapsheet | NBACapsheet,
  league: League
) => {
  let y1bonus = 0;
  let y2bonus = 0;
  let y3bonus = 0;
  let y4bonus = 0;
  let y5bonus = 0;
  let y1salary = 0;
  let y2salary = 0;
  let y3salary = 0;
  let y4salary = 0;
  let y5salary = 0;
  let y1ch = 0;
  let y1space = 0;
  let y2ch = 0;
  let y2space = 0;
  let y3ch = 0;
  let y3space = 0;
  let y4ch = 0;
  let y4space = 0;
  let y5ch = 0;
  let y5space = 0;
  switch (league) {
    case SimPHL:
      const tp = capsheet as ProCapsheet;
      break;
    case SimNBA:
      break;
    case SimNFL:
      break;
    default:
      break;
  }

  return {
    y1bonus,
    y2bonus,
    y3bonus,
    y4bonus,
    y5bonus,
    y1salary,
    y2salary,
    y3salary,
    y4salary,
    y5salary,
    y1ch,
    y2ch,
    y3ch,
    y4ch,
    y5ch,
    y1space,
    y2space,
    y3space,
    y4space,
    y5space,
  };
};
