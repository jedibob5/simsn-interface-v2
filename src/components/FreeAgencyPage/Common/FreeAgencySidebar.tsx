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
import { CapsheetInfo } from "../../Team/TeamPageComponents";

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
  ts,
}) => {
  let teamLabel = "";
  let coach = "";
  let season1 = 2025;
  let season2 = 2025;
  let season3 = 2025;
  let season4 = 2025;
  let season5 = 2025;
  let owner = "";
  let gm = "";
  let scout = "";
  switch (league) {
    case SimPHL:
      const tp = Capsheet as ProCapsheet;
      const t = Team as ProfessionalTeam;
      const tsp = ts as HCKTimestamp;
      season1 = tsp.Season;
      season2 = tsp.Season + 1;
      season3 = tsp.Season + 2;
      season4 = tsp.Season + 3;
      season5 = tsp.Season + 4;
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
          borderColor: teamColors.One,
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
        <CapsheetInfo
          ts={ts as HCKTimestamp}
          capsheet={Capsheet}
          league={league}
          backgroundColor={teamColors.Three}
          borderColor={teamColors.Two}
          textColorClass={teamColors.TextColorThree}
        />
      </Border>
    </div>
  );
};
