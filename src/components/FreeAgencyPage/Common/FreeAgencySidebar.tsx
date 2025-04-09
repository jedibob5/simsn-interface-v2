import { FC } from "react";
import {
  ProCapsheet,
  ProfessionalTeam,
  Timestamp as HCKTimestamp,
} from "../../../models/hockeyModels";
import {
  NFLCapsheet,
  NFLTeam,
  Timestamp as FBATimestamp,
} from "../../../models/footballModels";
import {
  NBACapsheet,
  NBATeam,
  Timestamp as BBATimestamp,
} from "../../../models/basketballModels";
import { League, SimNBA, SimNFL, SimPHL } from "../../../_constants/constants";
import { Border } from "../../../_design/Borders";
import { Text } from "../../../_design/Typography";
import { useCapsheet } from "../../../_hooks/useCapsheet";

interface FreeAgencySideBarProps {
  Capsheet: ProCapsheet | NFLCapsheet | NBACapsheet;
  Team: ProfessionalTeam | NFLTeam | NBATeam;
  teamColors: any;
  league: League;
  ts: HCKTimestamp | FBATimestamp | BBATimestamp;
}

export const FreeAgencySidebar: FC<FreeAgencySideBarProps> = ({
  Capsheet,
  Team,
  teamColors,
  league,
}) => {
  let teamLabel = "";
  let coach = "";
  let season = 2025;
  let owner = "";
  let gm = "";
  let scout = "";
  const {
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
  } = useCapsheet(Capsheet, league);
  switch (league) {
    case SimPHL:
      const tp = Capsheet as ProCapsheet;
      const t = Team as ProfessionalTeam;
      teamLabel = t.TeamName;
      owner = t.Owner;
      gm = t.GM;
      scout = t.Scout;
      coach = t.Coach;
      break;
    case SimNBA:
      break;
    case SimNFL:
      break;
    default:
      break;
  }
  return (
    <div className="flex flex-col w-full h-full max-[1024px]:gap-y-2">
      <Border
        direction="col"
        classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 px-4 py-2 h-full items-center justify-start"
        styles={{
          backgroundColor: teamColors.One,
          borderColor: teamColors.Two,
        }}
      >
        <div className="flex flex-col gap-x-2 flex-wrap w-full text-start mb-4">
          <Text variant="h6">{teamLabel}</Text>
          <Text variant="body-small">Owner: {owner}</Text>
          {gm.length > 0 && <Text variant="body-small">GM: {gm}</Text>}
          {coach.length > 0 && <Text variant="body-small">Coach: {coach}</Text>}
          {scout.length > 0 && <Text variant="body-small">Scout: {scout}</Text>}
          <Text variant="body-small">State: {Team?.State}</Text>
        </div>
        <div className="flex flex-col gap-x-2 flex-wrap w-full text-start">
          <Text variant="h6">Capsheet</Text>
        </div>
        <div className="flex flex-col gap-x-2 flex-wrap w-full text-start">
          <div
            className={`grid grid-cols-${
              league === SimNFL ? "5" : "4"
            } text-nowrap gap-x-8`}
          >
            <Text variant="body-small">Year</Text>
            {league === SimNFL && <Text variant="body-small">Bonus</Text>}
            <Text variant="body-small">Salary</Text>
            <Text variant="body-small">Cap Hit</Text>
            <Text variant="body-small">Space</Text>
          </div>
        </div>
      </Border>
    </div>
  );
};
