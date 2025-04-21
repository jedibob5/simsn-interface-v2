import { FC, ReactNode } from "react";
import {
  AddRecruitType,
  Attributes,
  InfoType,
  League,
  ModalAction,
  Preferences,
  RecruitInfoType,
  SimCHL,
} from "../../../_constants/constants";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import { Croot as BasketballCroot } from "../../../models/basketballModels";
import { Croot as FootballCroot } from "../../../models/footballModels";
import { Croot as HockeyCroot } from "../../../models/hockeyModels";
import { getCHLCrootAttributes } from "../../Team/TeamPageUtils";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { ActionLock, Info, Plus } from "../../../_design/Icons";
import { Table, TableCell } from "../../../_design/Table";
import { Text } from "../../../_design/Typography";

const getRecruitingColumns = (
  league: League,
  category: string,
  isMobile: boolean
) => {
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

  if (!isMobile && category === Attributes) {
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
  } else if (!isMobile && category === Preferences) {
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
  isMobile?: boolean;
  recruitOnBoardMap: Record<number, boolean>;
}

export const RecruitTable: FC<RecruitTableProps> = ({
  croots,
  colorOne,
  teamMap,
  team,
  category,
  openModal,
  league,
  isMobile = false,
  recruitOnBoardMap,
}) => {
  const backgroundColor = colorOne;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const columns = getRecruitingColumns(league, category, isMobile);

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
    const actionVariant = !recruitOnBoardMap[item.ID] ? "success" : "secondary";
    return (
      <div
        key={item.ID}
        className="table-row border-b dark:border-gray-700 text-left"
        style={{ backgroundColor }}
      >
        {selection.map((attr, idx) => (
          <TableCell>
            {attr.label === "Name" ? (
              <span
                className={`cursor-pointer font-semibold`}
                onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
                  (e.target as HTMLElement).style.color = "#fcd53f";
                  }}
                onMouseLeave={(e: React.MouseEvent<HTMLSpanElement>) => {
                  (e.target as HTMLElement).style.color = "";
                  }}
                onClick={() => openModal(InfoType, item)}
                >
                  <Text variant="small">{attr.value}</Text>
              </span>
            ) : <span className="text-sm">{attr.value}</span>}
          </TableCell>
        ))}
        <TableCell>
          {item.RecruitingStatus === "" ? "None" : item.RecruitingStatus}
        </TableCell>
        <TableCell>None</TableCell>
        <TableCell>
          <ButtonGroup classes="flex-nowrap">
            <Button
              variant={actionVariant}
              size="xs"
              onClick={() => openModal(AddRecruitType, item as HockeyCroot)}
              disabled={recruitOnBoardMap[item.ID]}
            >
              {recruitOnBoardMap[item.ID] ? <ActionLock /> : <Plus />}
            </Button>
          </ButtonGroup>
        </TableCell>
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
      data={croots}
      rowRenderer={rowRenderer(league)}
      team={team}
    />
  );
};
