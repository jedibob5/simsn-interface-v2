import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import {
  Croot as HockeyCroot,
  RecruitPlayerProfile as HockeyCrootProfile,
} from "../../../models/hockeyModels";
import {
  Attributes,
  ButtonColor,
  League,
  ModalAction,
  Potentials,
  Preferences,
  RecruitInfoType,
  RemoveRecruitType,
  ScholarshipOffered,
  ScholarshipRevoked,
  ScoutAttributeType,
  SimCHL,
  ToggleScholarshipType,
} from "../../../_constants/constants";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import {
  Croot as FootballCroot,
  RecruitPlayerProfile as FootballCrootProfile,
} from "../../../models/footballModels";
import { Table } from "../../../_design/Table";
import {
  getAdditionalCrootPreferenceAttributes,
  getAdditionalHockeyAttributeGrades,
  getAdditionalHockeyCrootAttributes,
} from "../../Team/TeamPageUtils";
import { Input } from "../../../_design/Inputs";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Croot as BasketballCroot } from "../../../models/basketballModels";
import { Info, SadFace, Scholarship, TrashCan } from "../../../_design/Icons";

const getRecruitProfileColumns = (
  league: League,
  category: string,
  isMobile: boolean
) => {
  if (league != SimCHL) return [];
  let columns: { header: string; accessor: string }[] = [
    { header: "ID", accessor: "" },
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: "Arch", accessor: "Archetype" },
    { header: "⭐", accessor: "Stars" },
    { header: "Country", accessor: "Country" },
    { header: "Region", accessor: "State" },
    { header: "Overall", accessor: "OverallGrade" },
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
  } else if (!isMobile && category === Potentials) {
    columns = columns.concat([
      { header: "Agi", accessor: "AgilityGrade" },
      { header: "FO", accessor: "FaceoffsGrade" },
      { header: "LSA", accessor: "LongShotAccuracyGrade" },
      { header: "LSP", accessor: "LongShotPowerGrade" },
      { header: "CSA", accessor: "CloseShotAccuracyGrade" },
      { header: "CSP", accessor: "CloseShotPowerGrade" },
      { header: "Pass", accessor: "PassingGrade" },
      { header: "PH", accessor: "PuckHandlingGrade" },
      { header: "Str", accessor: "StrengthGrade" },
      { header: "BChk", accessor: "BodyCheckingGrade" },
      { header: "SChk", accessor: "StickCheckingGrade" },
      { header: "SB", accessor: "ShotBlockingGrade" },
      { header: "GK", accessor: "GoalkeepingGrade" },
      { header: "GV", accessor: "GoalieVisionGrade" },
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
  columns = columns.concat([
    { header: "Status", accessor: "RecruitingStatus" },
    { header: "Leaders", accessor: "lead" },
    { header: "Add Points", accessor: "CurrentWeeksPoints" },
    { header: "Mod.", accessor: "ModifiedPoints" },
    { header: "Total", accessor: "TotalPoints" },
    { header: "Actions", accessor: "actions" },
  ]);
  return columns;
};

interface RecruitProfileTableProps {
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  recruitProfiles?: HockeyCrootProfile[];
  recruitMap: any;
  teamMap: any;
  team: any;
  league: League;
  isMobile?: boolean;
  category: string;
  openModal: (
    action: ModalAction,
    player: HockeyCroot | FootballCroot | BasketballCroot
  ) => void;
  ChangeInput: (id: number, name: string, points: number) => void;
  setAttribute: Dispatch<SetStateAction<string>>;
}

export const RecruitProfileTable: FC<RecruitProfileTableProps> = ({
  colorOne,
  colorTwo,
  colorThree,
  recruitProfiles,
  recruitMap,
  teamMap,
  team,
  league,
  category,
  isMobile = false,
  ChangeInput,
  openModal,
  setAttribute,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const columns = getRecruitProfileColumns(league, category, isMobile);
  const CFBRowRenderer = (
    item: FootballCrootProfile,
    index: number,
    backgroundColor: string
  ) => <></>;

  const CHLRowRenderer = (
    item: HockeyCrootProfile,
    index: number,
    backgroundColor: string
  ) => {
    const croot = recruitMap[item.RecruitID] as HockeyCroot;
    const signedTeam = teamMap[croot.TeamID];
    let attrList = getAdditionalHockeyCrootAttributes(croot);
    if (category === Potentials) {
      attrList = getAdditionalHockeyAttributeGrades(croot);
    }
    const prefList = getAdditionalCrootPreferenceAttributes(croot);
    let toggleVariant = "secondary";
    if (item.Scholarship && !item.ScholarshipRevoked) {
      toggleVariant = "success";
    } else if (!item.Scholarship && item.ScholarshipRevoked) {
      toggleVariant = "danger";
    }

    let modValue = item.CurrentWeeksPoints * item.Modifier;
    if (item.IsHomeState) {
      modValue = modValue * 1.25;
    } else if (item.IsPipelineState) {
      modValue = modValue * 1.15;
    }

    const ChangeCurrentWeekPointsInput = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = event.target;
      let numericValue = Number(value);
      if (numericValue < 0) return;
      if (numericValue > 20) {
        numericValue = 20;
      }
      ChangeInput(item.ID, name, numericValue);
    };

    const toggleScholarship = () => {
      if (item.Scholarship) {
        setAttribute(ScholarshipRevoked);
      } else {
        setAttribute(ScholarshipOffered);
      }
      openModal(ToggleScholarshipType, croot);
    };

    const scoutAttribute = (attr: string) => {
      setAttribute(attr);
      openModal(ScoutAttributeType, croot);
    };
    return (
      <div
        key={item.ID}
        className="table-row border-b dark:border-gray-700 text-left"
        style={{ backgroundColor }}
      >
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.ID}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>
            {croot.FirstName} {croot.LastName}
          </span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.Position}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.Archetype}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.Stars}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.Country}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.State}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.OverallGrade}</span>
        </div>
        {category === Attributes && (
          <>
            {attrList.map((attr) => (
              <div className="table-cell px-2 py-1 whitespace-nowrap">
                <span className={`text-sm`}>{attr.value}</span>
              </div>
            ))}
          </>
        )}
        {category === Potentials && (
          <>
            {attrList.map((attr) => (
              <div className="table-cell px-2 py-1 whitespace-nowrap">
                {item[attr.label] ? (
                  <span className={`text-sm`}>{attr.value}</span>
                ) : (
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => scoutAttribute(attr.label)}
                  >
                    ?
                  </Button>
                )}
              </div>
            ))}
          </>
        )}
        {category === Preferences && (
          <>
            {prefList.map((attr, idx) => (
              <div key={idx} className="table-cell px-2 py-1 whitespace-nowrap">
                <span className="text-sm">{attr.value}</span>
              </div>
            ))}
          </>
        )}
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{croot.RecruitingStatus}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>
            {croot.LeadingTeams && croot.LeadingTeams.length}
          </span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <div className="w-[1rem]">
            <Input
              type="number"
              key={item.ID}
              label=""
              name="CurrentWeeksPoints"
              value={item.CurrentWeeksPoints as number}
              classes="text-sm"
              onChange={ChangeCurrentWeekPointsInput}
            />
          </div>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{modValue.toFixed(4)}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <span className={`text-sm`}>{item.TotalPoints}</span>
        </div>
        <div className="table-cell px-2 py-1 whitespace-nowrap">
          <ButtonGroup classes="flex-nowrap">
            <Button size="xs" onClick={() => openModal(RecruitInfoType, croot)}>
              <Info />
            </Button>
            <Button
              variant={toggleVariant as ButtonColor}
              size="xs"
              onClick={toggleScholarship}
              disabled={item.ScholarshipRevoked}
            >
              {item.ScholarshipRevoked ? <SadFace /> : <Scholarship />}
            </Button>
            <Button
              variant="danger"
              size="xs"
              onClick={() => openModal(RemoveRecruitType, croot)}
            >
              <TrashCan />
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
      data={recruitProfiles as HockeyCrootProfile[]}
      team={team}
      rowRenderer={rowRenderer(SimCHL)}
    />
  );
};
