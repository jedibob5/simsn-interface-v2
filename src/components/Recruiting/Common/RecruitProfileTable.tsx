import { Dispatch, FC, ReactNode, SetStateAction, useMemo } from "react";
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
  SimCFB,
  SimCHL,
  ToggleScholarshipType,
} from "../../../_constants/constants";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import {
  Croot as FootballCroot,
  RecruitPlayerProfile as FootballCrootProfile,
} from "../../../models/footballModels";
import { Table, TableCell } from "../../../_design/Table";
import {
  getAdditionalCrootPreferenceAttributes,
  getAdditionalHockeyAttributeGrades,
  getAdditionalHockeyCrootAttributes,
  getCFBCrootAttributes,
} from "../../Team/TeamPageUtils";
import { Input } from "../../../_design/Inputs";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import {
  Croot as BasketballCroot,
  PlayerRecruitProfile as BasketballCrootProfile,
} from "../../../models/basketballModels";
import { SadFace, Scholarship, TrashCan } from "../../../_design/Icons";
import {
  annotateCountry,
  annotateRegion,
} from "../../../_helper/StateAbbreviationHelper";
import { getLogo } from "../../../_utility/getLogo";
import { Logo } from "../../../_design/Logo";

const getRecruitProfileColumns = (
  league: League,
  category: string,
  isMobile: boolean
) => {
  if (league === SimCHL) {
    let columns: { header: string; accessor: string }[] = [
      { header: "ID", accessor: "" },
      { header: "Name", accessor: "LastName" },
      { header: "Pos", accessor: "Position" },
      { header: "Arch", accessor: "Archetype" },
      { header: "⭐", accessor: "Stars" },
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
  }
  if (league === SimCFB) {
    let columns: { header: string; accessor: string }[] = [
      { header: "ID", accessor: "" },
      { header: "Name", accessor: "LastName" },
      { header: "Pos", accessor: "Position" },
      { header: "Arch", accessor: "Archetype" },
      { header: "⭐", accessor: "Stars" },
      { header: "State", accessor: "State" },
      { header: "Ovr", accessor: "OverallGrade" },
      { header: "Pot", accessor: "PotentialGrade" },
      { header: "Status", accessor: "RecruitingStatus" },
      { header: "Leaders", accessor: "lead" },
      { header: "Add Points", accessor: "CurrentWeeksPoints" },
      { header: "Mod.", accessor: "ModifiedPoints" },
      { header: "Total", accessor: "TotalPoints" },
      { header: "Actions", accessor: "actions" },
    ];
    return columns;
  }
  return [];
};

interface CHLProfileRowProps {
  profile: HockeyCrootProfile;
  croot: HockeyCroot;
  isMobile: boolean;
  category: string;
  ChangeInput: (id: number, name: string, points: number) => void;
  openModal: (action: ModalAction, player: HockeyCroot) => void;
  setAttribute: (attr: string) => void;
  backgroundColor: string;
}

export const CHLProfileRow: FC<CHLProfileRowProps> = ({
  profile,
  croot,
  isMobile,
  category,
  ChangeInput,
  openModal,
  setAttribute,
  backgroundColor,
}) => {
  // 1) Build attribute lists once
  let attrList = getAdditionalHockeyCrootAttributes(croot);
  if (category === Potentials)
    attrList = getAdditionalHockeyAttributeGrades(croot);
  const prefList = getAdditionalCrootPreferenceAttributes(croot);

  // 2) Scholarship button state
  const toggleVariant =
    profile.Scholarship && !profile.ScholarshipRevoked
      ? "success"
      : !profile.Scholarship && profile.ScholarshipRevoked
      ? "danger"
      : "secondary";

  // 3) Compute modifier
  let modValue = profile.CurrentWeeksPoints * profile.Modifier;
  if (profile.IsHomeState) modValue *= 1.25;
  else if (profile.IsPipelineState) modValue *= 1.15;

  // 4) Change handler
  const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(0, Math.min(20, Number(e.target.value)));
    ChangeInput(profile.ID, e.target.name, val);
  };

  // 5) Leading teams (memo)
  const leadingTeams = useMemo(() => {
    if (!croot.LeadingTeams?.length) return "None";
    const tops = croot.LeadingTeams.filter((x) => x.Odds > 0).slice(0, 4);
    if (!tops.length) return "None";
    return tops.map((x) => (
      <Logo
        key={x.TeamID}
        url={getLogo(SimCHL, x.TeamID, false)}
        variant="tiny"
      />
    ));
  }, [croot.LeadingTeams]);

  // 6) Buttons
  const toggleScholarship = () => {
    setAttribute(profile.Scholarship ? ScholarshipRevoked : ScholarshipOffered);
    openModal(ToggleScholarshipType, croot);
  };
  const scoutAttribute = (attr: string) => {
    setAttribute(attr);
    openModal(ScoutAttributeType, croot);
  };

  return (
    <div
      className="table-row border-b dark:border-gray-700 text-left"
      style={{ backgroundColor }}
    >
      <TableCell>
        <span className={`text-xs`}>{croot.ID}</span>
      </TableCell>{" "}
      <TableCell>
        <span
          className={`text-xs cursor-pointer font-semibold ${
            croot.IsCustomCroot ? "text-blue-400" : ""
          }`}
          onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
            (e.target as HTMLElement).style.color = "#fcd53f";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLSpanElement>) => {
            (e.target as HTMLElement).style.color = "";
          }}
          onClick={() => openModal(RecruitInfoType, croot)}
        >
          {croot.FirstName} {croot.LastName}
        </span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.Position}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.Archetype}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.Stars}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{annotateCountry(croot.Country)}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{annotateRegion(croot.State)}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.OverallGrade}</span>
      </TableCell>
      {category === Attributes && (
        <>
          {attrList.map((attr) => (
            <TableCell>
              <span className={`text-xs`}>{attr.value}</span>
            </TableCell>
          ))}
        </>
      )}
      {category === Potentials && (
        <>
          {attrList.map((attr) => (
            <TableCell>
              {profile[attr.label] ? (
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
            </TableCell>
          ))}
        </>
      )}
      {category === Preferences && (
        <>
          {prefList.map((attr, idx) => (
            <TableCell key={idx}>
              <span className="text-sm">{attr.value}</span>
            </TableCell>
          ))}
        </>
      )}
      <TableCell>
        <span className={`text-xs`}>{croot.RecruitingStatus}</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-row gap-x-2 text-xs">{leadingTeams}</div>
      </TableCell>
      <TableCell>
        <div className="w-[1rem]">
          <Input
            type="number"
            key={profile.ID}
            label=""
            name="CurrentWeeksPoints"
            value={profile.CurrentWeeksPoints as number}
            classes="text-xs"
            disabled={profile.IsLocked || profile.IsSigned}
            onChange={onPointsChange}
          />
        </div>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{modValue.toFixed(3)}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{profile.TotalPoints}</span>
      </TableCell>
      <TableCell>
        <ButtonGroup classes="flex-nowrap">
          <Button
            variant={toggleVariant as ButtonColor}
            size="xs"
            onClick={toggleScholarship}
            disabled={profile.ScholarshipRevoked}
          >
            {profile.ScholarshipRevoked ? <SadFace /> : <Scholarship />}
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => openModal(RemoveRecruitType, croot)}
          >
            <TrashCan />
          </Button>
        </ButtonGroup>
      </TableCell>
    </div>
  );
};

interface CFBProfileRowProps {
  profile: FootballCrootProfile;
  croot: FootballCroot;
  isMobile: boolean;
  category: string;
  ChangeInput: (id: number, name: string, points: number) => void;
  openModal: (action: ModalAction, player: FootballCroot) => void;
  setAttribute: (attr: string) => void;
  backgroundColor: string;
}

export const CFBProfileRow: FC<CFBProfileRowProps> = ({
  profile,
  croot,
  isMobile,
  category,
  ChangeInput,
  openModal,
  setAttribute,
  backgroundColor,
}) => {
  // 2) Scholarship button state
  const toggleVariant =
    profile.Scholarship && !profile.ScholarshipRevoked
      ? "success"
      : !profile.Scholarship && profile.ScholarshipRevoked
      ? "danger"
      : "secondary";

  // 3) Compute modifier
  let modifier = profile.RecruitingEfficiencyScore;
  if (profile.AffinityOneEligible) {
    modifier += 0.1;
  }
  if (profile.AffinityTwoEligible) {
    modifier += 0.1;
  }
  let modValue = profile.CurrentWeeksPoints * modifier;

  // 4) Change handler
  const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(0, Math.min(20, Number(e.target.value)));
    ChangeInput(profile.ID, e.target.name, val);
  };

  // 5) Leading teams (memo)
  const leadingTeams = useMemo(() => {
    if (!croot.LeadingTeams?.length) return "None";
    const tops = croot.LeadingTeams.filter((x) => x.Odds > 0).slice(0, 4);
    if (!tops.length) return "None";
    return tops.map((x) => (
      <Logo
        key={x.TeamID}
        url={getLogo(SimCFB, x.TeamID, false)}
        variant="tiny"
      />
    ));
  }, [croot.LeadingTeams]);

  // 6) Buttons
  const toggleScholarship = () => {
    setAttribute(profile.Scholarship ? ScholarshipRevoked : ScholarshipOffered);
    openModal(ToggleScholarshipType, croot);
  };

  return (
    <div
      className="table-row border-b dark:border-gray-700 text-left"
      style={{ backgroundColor }}
    >
      <TableCell>
        <span className={`text-xs`}>{croot.ID}</span>
      </TableCell>{" "}
      <TableCell>
        <span
          className={`text-xs cursor-pointer font-semibold ${
            croot.IsCustomCroot ? "text-blue-400" : ""
          }`}
          onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
            (e.target as HTMLElement).style.color = "#fcd53f";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLSpanElement>) => {
            (e.target as HTMLElement).style.color = "";
          }}
          onClick={() => openModal(RecruitInfoType, croot)}
        >
          {croot.FirstName} {croot.LastName}
        </span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.Position}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.Archetype}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.Stars}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{annotateRegion(croot.State)}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.OverallGrade}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.PotentialGrade}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{croot.RecruitingStatus}</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-row gap-x-2 text-xs">{leadingTeams}</div>
      </TableCell>
      <TableCell>
        <div className="w-[1rem]">
          <Input
            type="number"
            key={profile.ID}
            label=""
            name="CurrentWeeksPoints"
            value={profile.CurrentWeeksPoints as number}
            classes="text-xs"
            disabled={profile.IsLocked || profile.IsSigned}
            onChange={onPointsChange}
          />
        </div>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{modValue.toFixed(3)}</span>
      </TableCell>
      <TableCell>
        <span className={`text-xs`}>{profile.TotalPoints.toFixed(3)}</span>
      </TableCell>
      <TableCell>
        <ButtonGroup classes="flex-nowrap">
          <Button
            variant={toggleVariant as ButtonColor}
            size="xs"
            onClick={toggleScholarship}
            disabled={profile.ScholarshipRevoked}
          >
            {profile.ScholarshipRevoked ? <SadFace /> : <Scholarship />}
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => openModal(RemoveRecruitType, croot)}
          >
            <TrashCan />
          </Button>
        </ButtonGroup>
      </TableCell>
    </div>
  );
};

interface RecruitProfileTableProps {
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  recruitProfiles?:
    | HockeyCrootProfile[]
    | FootballCrootProfile[]
    | BasketballCrootProfile[];
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

  const rowRenderer = (
    league: League
  ): ((item: any, index: number, backgroundColor: string) => ReactNode) => {
    if (league === SimCHL) {
      return (profile: HockeyCrootProfile, idx: number, bg: string) => {
        const croot = recruitMap[profile.RecruitID] as HockeyCroot;
        return (
          <CHLProfileRow
            profile={profile}
            key={profile.ID}
            croot={croot}
            isMobile={isMobile}
            backgroundColor={bg}
            category={category}
            ChangeInput={ChangeInput}
            openModal={openModal}
            setAttribute={setAttribute}
          />
        );
      };
    }
    if (league === SimCFB) {
      return (profile: FootballCrootProfile, idx: number, bg: string) => {
        const croot = recruitMap[profile.RecruitID] as FootballCroot;
        return (
          <CFBProfileRow
            profile={profile}
            key={profile.ID}
            croot={croot}
            isMobile={isMobile}
            backgroundColor={bg}
            category={category}
            ChangeInput={ChangeInput}
            openModal={openModal}
            setAttribute={setAttribute}
          />
        );
      };
    }
    return (profile: BasketballCrootProfile, idx: number, bg: string) => {
      const croot = recruitMap[profile.RecruitID] as BasketballCroot;
      return <></>;
    };
  };
  return (
    <Table
      columns={columns}
      data={recruitProfiles!!}
      team={team}
      rowRenderer={rowRenderer(league)}
    />
  );
};
