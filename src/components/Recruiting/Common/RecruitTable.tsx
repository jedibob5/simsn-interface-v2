import { FC, ReactNode } from "react";
import {
  Attributes,
  InfoType,
  League,
  ModalAction,
  Preferences,
  RecruitInfoType,
  SimCHL,
} from "../../../_constants/constants";
import { useMobile } from "../../../_hooks/useMobile";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import { Croot as BasketballCroot } from "../../../models/basketballModels";
import { Croot as FootballCroot } from "../../../models/footballModels";
import { Croot as HockeyCroot } from "../../../models/hockeyModels";
import { getCHLCrootAttributes } from "../../Team/TeamPageUtils";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Info, Plus } from "../../../_design/Icons";
import { Table } from "../../../_design/Table";

const getRecruitingColumns = (league: League, category: string) => {
  if (league !== SimCHL) return [];

  let columns: { header: string; accessor: string }[] = [
    { header: "ID", accessor: "" },
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: "Arch.", accessor: "Archetype" },
    { header: "⭐", accessor: "Stars" },
    { header: "Ht", accessor: "Height" },
    { header: "Wt", accessor: "Weight" },
    { header: "Country", accessor: "Country" },
    { header: "Region", accessor: "State" },
    { header: "Ovr", accessor: "OverallGrade" },
  ];

  if (category === Attributes) {
    columns = columns.concat([
      { header: "Agi", accessor: "Agility" },
      { header: "FO", accessor: "Faceoffs" },
      { header: "LSA", accessor: "LongShotAccuracy" },
      { header: "LSP", accessor: "LongShotPower" },
      { header: "CSA", accessor: "CloseShotAccuracy" },
      { header: "CSP", accessor: "CloseShotPower" },
      { header: "Pass", accessor: "Passing" },
      { header: "PH", accessor: "PuckHandling" },
      { header: "Str", accessor: "Strength" },
      { header: "BChk", accessor: "BodyChecking" },
      { header: "SChk", accessor: "StickChecking" },
      { header: "SB", accessor: "ShotBlocking" },
      { header: "GK", accessor: "Goalkeeping" },
      { header: "GV", accessor: "GoalieVision" },
    ]);
  } else if (category === Preferences) {
    columns = columns.concat([
      { header: "Program", accessor: "ProgramPref" },
      { header: "Prof. Dev.", accessor: "ProfDevPref" },
      { header: "Trad.", accessor: "TraditionsPref" },
      { header: "Fac.", accessor: "FacilitiesPref" },
      { header: "Atm.", accessor: "AtmospherePref" },
      { header: "Aca.", accessor: "AcademicsPref" },
      { header: "Conf.", accessor: "ConferencePref" },
      { header: "Coach", accessor: "CoachPref" },
      { header: "Season", accessor: "SeasonMomentumPref" },
    ]);
  }
  columns.push({ header: "Status", accessor: "RecruitingStatus" });
  columns.push({ header: "Leaders", accessor: "lead" });
  columns.push({ header: "Actions", accessor: "actions" });

  return columns;
};

interface RecruitTableProps {
  croots: HockeyCroot[] | FootballCroot[] | BasketballCroot[];
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  teamMap: any;
  team: any;
  category: string;
  openModal: (
    action: ModalAction,
    player: HockeyCroot | FootballCroot | BasketballCroot
  ) => void;
  league: League;
}

export const RecruitTable: FC<RecruitTableProps> = ({
  croots,
  colorOne,
  colorTwo,
  colorThree,
  teamMap,
  team,
  category,
  openModal,
  league,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();
  const columns = getRecruitingColumns(league, category);

  const CFBRowRenderer = (
    item: FootballCroot,
    index: number,
    backgroundColor: string
  ) => <></>;

  const CHLRowRenderer = (
    item: HockeyCroot,
    index: number,
    backgroundColor: string
  ) => {
    const selection = getCHLCrootAttributes(item, isMobile, category!);
    return (
      <div
        key={item.ID}
        className="table-row border-b dark:border-gray-700 text-left"
        style={{ backgroundColor }}
      >
        {selection.map((attr, idx) => (
          <div key={idx} className="table-cell px-2 py-1 whitespace-nowrap">
            <span className="text-sm">{attr.value}</span>
          </div>
        ))}
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          {item.RecruitingStatus === "" ? "None" : item.RecruitingStatus}
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">None</div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <ButtonGroup classes="flex-nowrap">
            <Button size="xs" onClick={() => openModal(RecruitInfoType, item)}>
              <Info />
            </Button>
            <Button variant="success" size="xs" onClick={() => openModal(InfoType, item as HockeyCroot)}>
              <Plus/>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  const rowRenderer = (
    league: League
  ): ((item: any, index: number, backgroundColor: string) => ReactNode) => {
    if (league === SimCHL) {
      return CHLRowRenderer;
    }
    return CFBRowRenderer;
  };

  return (
    <Table
      columns={columns}
      data={croots as HockeyCroot[]}
      rowRenderer={rowRenderer(SimCHL)}
      team={team}
    />
  );
};
