import { FC } from "react";
import { Border } from "../../_design/Borders";
import { Text } from "../../_design/Typography";
import {
  League,
  SimCFB,
  SimNFL,
  SimCHL,
  SimPHL,
} from "../../_constants/constants";
import { getTextColorBasedOnBg } from "../../_utility/getBorderClass";
import { darkenColor } from "../../_utility/getDarkerColor";
import { getLogo } from "../../_utility/getLogo";
import { Logo } from "../../_design/Logo";
import { useMobile } from "../../_hooks/useMobile";

interface TeamInfoProps {
  id?: number;
  TeamName?: string;
  Team?: any;
  Owner?: string;
  Coach?: string;
  GM?: string;
  Scout?: string;
  Marketing?: string;
  Conference?: string;
  Division?: string;
  Roster?: any;
  TeamProfile?: any;
  Arena?: string;
  Capacity?: number;
  isPro: boolean;
  Capsheet?: any;
  League: League;
  ts: any;
  backgroundColor?: string;
  headerColor?: string;
  borderColor?: string;
  isRetro?: boolean;
}

export const TeamInfo: FC<TeamInfoProps> = ({
  isPro,
  id,
  TeamName = "",
  Team,
  Owner = "None",
  Coach = "None",
  GM = "None",
  Scout = "None",
  Marketing = "None",
  TeamProfile,
  Division,
  Conference = "",
  Arena = "",
  Capacity = 0,
  Capsheet = "",
  League,
  Roster,
  ts,
  backgroundColor,
  headerColor,
  borderColor,
  isRetro = false,
}) => {
  const sectionBg = darkenColor("#1f2937", -5);
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const logo = getLogo(League, id!!, isRetro);
  const [isMobile] = useMobile();
  return (
    <div className="flex flex-col w-full max-w-[2000px]">
      <Border
        direction="row"
        classes="w-full p-8 justify-around"
        styles={{
          backgroundColor,
          borderColor: headerColor,
        }}
      >
        <div className="flex flex-col sm:w-1/4 5xl:max-w-[10rem] justify-center items-center">
          <div className="flex flex-row max-w-1/4 p-2 pt-6 gap-x-4">
            <div
              className="max-w-[6rem] 5xl:max-w-[10rem] w-[10rem] h-[7.5rem] items-center justify-center rounded-lg border-2"
              style={{ backgroundColor: sectionBg, borderColor: headerColor }}
            >
              <Logo
                url={logo}
                variant="large"
                containerClass="items-center justify-center h-full"
              />
            </div>
            <div className="flex flex-col justify-center pb-2">
              <Text variant="h5" classes={`${textColorClass}`}>
                {TeamName}
              </Text>
              <Text variant="small" classes={`${textColorClass} mb-2`}>
                {Conference} Conference
              </Text>
              {Division && Division.length > 0 && (
                <Text variant="xs" classes={`${textColorClass}`}>
                  {Division}
                </Text>
              )}
              <TeamGrades
                Team={Team}
                backgroundColor={sectionBg}
                gradeColor={backgroundColor}
                borderColor={headerColor}
              />
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="flex flex-col w-1/3 gap-2 justify-center items-center gap-x-2">
            <FrontOfficeInfo
              owner={Owner}
              gm={GM}
              coach={Coach}
              scout={Scout}
              isPro={isPro}
              marketing={Marketing}
              borderColor={headerColor}
              backgroundColor={sectionBg}
              lineColor={borderColor}
            />
          </div>
        )}
        {!isMobile && (
          <div className="flex flex-col w-1/3 items-center justify-center gap-x-2">
            {isPro && (
              <CapsheetInfo
                capsheet={Capsheet}
                ts={ts}
                league={League}
                borderColor={headerColor}
                backgroundColor={sectionBg}
              />
            )}
            {!isPro && (
              <TeamBreakdown
                TeamProfile={TeamProfile}
                ts={ts}
                league={League}
                backgroundColor={sectionBg}
                borderColor={headerColor}
                lineColor={borderColor}
              />
            )}
          </div>
        )}
      </Border>
      <Border
        direction="row"
        classes="w-full h-[1em] max-h-[5em] p-4 sm:p-6 sm:px-14 justify-center sm:justify-around"
        styles={{
          backgroundColor,
          borderColor: headerColor,
        }}
      >
        <div className="flex w-full justify-center sm:justify-between items-center gap-x-2">
          {!isMobile && (
            <StadiumInfo
              league={League}
              arena={Arena}
              capacity={Capacity}
              textColorClass={textColorClass}
              borderColor={headerColor}
              backgroundColor={backgroundColor}
              isPro={isPro}
            />
          )}
          <RosterInfo
            roster={Roster}
            league={League}
            textColorClass={textColorClass}
            borderColor={headerColor}
            backgroundColor={backgroundColor}
            isPro={isPro}
          />
        </div>
      </Border>
    </div>
  );
};

interface TeamDropdownSectionProps {
  teamOptions: { label: string; value: string }[];
  selectTeamOption: () => void;
  export: () => Promise<void>;
}

export const TeamDropdownSection: FC<TeamDropdownSectionProps> = ({}) => {
  return <></>;
};

export const CapsheetInfo = ({
  capsheet,
  ts,
  league,
  backgroundColor,
  borderColor,
  textColorClass,
}: any) => {
  const isNFL = league === SimNFL;
  const rows = [1, 2, 3, 4, 5].map((yearOffset) => {
    const year = ts.Season + (yearOffset - 1);
    const salaryKey = `Y${yearOffset}Salary`;
    const bonusKey = `Y${yearOffset}Bonus`;
    const deadCapKey = `Y${yearOffset}CapHit`;
    const capspaceKey = `Y${yearOffset}Capspace`;
    const salary = capsheet[salaryKey] || 0;
    const bonus = isNFL ? capsheet[bonusKey] || 0 : 0;
    const deadCap = capsheet[deadCapKey] || 0;
    const capSpace = ts[capspaceKey] || 0;
    const space = capSpace - salary - bonus - deadCap;
    return { year, salary, bonus, space };
  });

  return (
    <div
      className="flex w-full h-[100%] border-2 rounded-lg py-5 flex-row"
      style={{ borderColor, backgroundColor }}
    >
      {capsheet && (
        <div className="table-fixed w-full">
          <div className="table-header-group w-full">
            <div className="table-row">
              <div className="table-cell w-[9em] font-semibold">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  Year
                </Text>
              </div>
              {isNFL && (
                <div className="table-cell w-[9em] font-semibold">
                  <Text variant="body-small" classes={`${textColorClass}`}>
                    Bonus
                  </Text>
                </div>
              )}
              <div className="table-cell w-[9em] font-semibold">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  Salary
                </Text>
              </div>
              <div className="table-cell w-[9em] font-semibold">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  Space
                </Text>
              </div>
            </div>
          </div>
          <div className="table-row-group">
            {rows.map(({ year, salary, bonus, space }) => (
              <div key={year} className="table-row">
                <div className="table-cell">
                  <Text variant="xs" classes={`${textColorClass}`}>
                    {year}
                  </Text>
                </div>
                {isNFL && (
                  <div className="table-cell">
                    <Text variant="xs" classes={`${textColorClass}`}>
                      {bonus.toFixed(2)}
                    </Text>
                  </div>
                )}
                <div className="table-cell">
                  <Text variant="xs" classes={`${textColorClass}`}>
                    {salary.toFixed(2)}
                  </Text>
                </div>
                <div className="table-cell">
                  <Text variant="xs" classes={`${textColorClass}`}>
                    {space.toFixed(2)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Text variant="xs" classes={`${textColorClass} font-semibold`}>
              {`Dead Cap: ${capsheet.Y1CapHit.toFixed(2)}`}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export const TeamBreakdown = ({
  TeamProfile,
  ts,
  league,
  backgroundColor,
  borderColor,
  lineColor,
  textColorClass,
}: any) => {
  const notHockey = league !== SimCHL && league !== SimPHL;
  return (
    <div
      className="flex flex-col w-full h-[100%] border-2 rounded-lg py-5"
      style={{ borderColor, backgroundColor }}
    >
      {TeamProfile && notHockey && (
        <div className="flex flex-row w-full pb-2 px-1">
          <div className="flex flex-col items-center w-full">
            <Text
              variant="body-small"
              classes={`${textColorClass} font-semibold`}
            >
              Offensive Scheme
            </Text>
            <Text variant="xs" classes={`${textColorClass}`}>
              {TeamProfile.OffensiveScheme || "N/A"}
            </Text>
          </div>
          <div className="flex flex-col items-center w-full">
            <Text
              variant="body-small"
              classes={`${textColorClass} font-semibold`}
            >
              Defensive Scheme
            </Text>
            <Text variant="xs" classes={`${textColorClass}`}>
              {TeamProfile.DefensiveScheme || "N/A"}
            </Text>
          </div>
        </div>
      )}
      {notHockey && (
        <div
          className="flex w-[90%] self-center border-t"
          style={{ borderColor: lineColor }}
        />
      )}
      {TeamProfile && ts && (
        <div
          className="flex flex-col w-full border-t border-dotted pt-1 px-1"
          style={{ borderColor }}
        >
          <Text
            variant="body-small"
            classes={`${textColorClass} font-semibold pb-1`}
          >
            Incoming Croots
          </Text>
          <div className="flex flex-row">
            <div
              className="flex flex-col items-center w-full border-r-2 pr-1"
              style={{ borderColor }}
            >
              <Text variant="xs" classes={`${textColorClass} text-small`}>
                ⭐⭐⭐
              </Text>
              <Text
                variant="xs"
                classes={`${textColorClass} font-semibold text-small`}
              >
                {TeamProfile.ThreeStars || "0"}
              </Text>
            </div>
            <div className="flex flex-col items-center px-4">
              <Text variant="xs" classes={`${textColorClass} text-small`}>
                ⭐⭐⭐⭐
              </Text>
              <Text
                variant="xs"
                classes={`${textColorClass} font-semibold text-small`}
              >
                {TeamProfile.FourStars || "0"}
              </Text>
            </div>
            <div
              className="flex flex-col items-center w-full border-l-2 pl-1"
              style={{ borderColor }}
            >
              <Text variant="xs" classes={`${textColorClass} text-small`}>
                ⭐⭐⭐⭐⭐
              </Text>
              <Text
                variant="xs"
                classes={`${textColorClass} font-semibold text-small`}
              >
                {TeamProfile.FiveStars || "0"}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FrontOfficeInfo = ({
  backgroundColor,
  borderColor,
  textColorClass,
  lineColor,
  league,
  owner,
  coach,
  gm,
  scout,
  marketing,
  isPro,
}: any) => {
  const personnelRoles = isPro
    ? [
        { role: "Owner", value: owner },
        { role: "GM", value: gm },
        { role: "Coach", value: coach },
        { role: "Assistant", value: scout },
        ...(league === SimPHL ? [{ role: "Marketing", value: marketing }] : []),
      ]
        .filter(({ value }) => value)
        .reduce((acc: Record<string, string[]>, { role, value }) => {
          if (!acc[value]) {
            acc[value] = [];
          }
          acc[value].push(role);
          return acc;
        }, {})
    : {
        [coach || "AI"]: ["Coach"],
      };

  const vacancies = isPro
    ? [
        { role: "Owner", value: owner },
        { role: "GM", value: gm },
        { role: "Coach", value: coach },
        { role: "Assistant", value: scout },
        ...(league === SimPHL ? [{ role: "Marketing", value: marketing }] : []),
      ]
        .filter(({ value }) => !value)
        .map(({ role }) => role)
        .join(", ") || "None"
    : !coach || coach === "AI"
    ? "Coach"
    : "None";

  return (
    <div
      className="flex w-full h-full py-5 px-4 border-2 rounded-lg flex-row"
      style={{ borderColor, backgroundColor }}
    >
      <div className="table-fixed w-full">
        <div className="table-header-group">
          <div className="table-row">
            <div className="table-cell w-[6em] font-semibold text-left">
              <Text variant="body-small" classes={`${textColorClass}`}>
                Role
              </Text>
            </div>
            <div className="table-cell font-semibold text-left">
              <Text variant="body-small" classes={`${textColorClass}`}>
                Personnel
              </Text>
            </div>
          </div>
        </div>
        <div className="table-row-group">
          {Object.entries(personnelRoles).map(([person, roles]) => (
            <div key={person} className="table-row">
              <div className="table-cell text-left">
                <Text variant="xs" classes={`${textColorClass}`}>
                  {roles.join("/")}
                </Text>
              </div>
              <div className="table-cell text-left">
                <Text variant="xs" classes={`${textColorClass}`}>
                  {person}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex my-2 border-t"
          style={{ borderColor: lineColor }}
        />
        <div className="table-row-group">
          {vacancies && (
            <div
              className="table-row border-t"
              style={{ borderColor: lineColor, borderTopWidth: "2px" }}
            >
              <div className="table-cell w-[6em] text-left">
                <Text variant="xs" classes={`${textColorClass}`}>
                  Vacancies
                </Text>
              </div>
              <div className="table-cell text-left">
                <Text variant="xs" classes={`${textColorClass}`}>
                  {vacancies}
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RosterInfo = ({
  backgroundColor,
  borderColor,
  league,
  roster,
  isPro,
  textColorClass,
}: any) => {
  const totalPlayers = roster?.length || 0;
  const specialPlayersCount =
    roster?.filter((player: any) => {
      if (isPro) {
        if (league === SimNFL) {
          return player?.IsPracticeSquad || false;
        }
        if (league === SimPHL) {
          return player?.IsAffiliatePlayer || false;
        }
      } else {
        return player?.IsRedshirting || false;
      }
    }).length || 0;
  const activeRoster = totalPlayers - specialPlayersCount;

  return (
    <div className="flex gap-4">
      <div className="flex justify-center items-center gap-2">
        <Text variant="xs" classes={`${textColorClass} font-semibold`}>
          Active Roster:
        </Text>
        <Text variant="xs" classes={`${textColorClass}`}>
          {activeRoster}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="xs" classes={`${textColorClass} font-semibold`}>
          {isPro
            ? league === SimNFL
              ? "Practice Squad:"
              : league === SimPHL
              ? "Reserves:"
              : "Unknown"
            : "Redshirts"}
        </Text>
        <Text variant="xs" classes={`${textColorClass}`}>
          {specialPlayersCount}
        </Text>
      </div>
    </div>
  );
};

export const StadiumInfo = ({
  backgroundColor,
  borderColor,
  arena,
  capacity,
  league,
  textColorClass,
}: any) => {
  const home = league === SimCFB || league === SimNFL ? "Stadium:" : "Arena:";
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <Text
          variant="xs"
          classes={`${textColorClass} font-semibold text-left`}
        >
          {`${home}`}
        </Text>
        <Text variant="xs" classes={`${textColorClass}`}>
          {arena}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="xs" classes={`${textColorClass} font-semibold`}>
          Capacity:
        </Text>
        <Text variant="xs" classes={`${textColorClass}`}>
          {capacity}
        </Text>
      </div>
    </div>
  );
};

export const TeamGrades = ({
  backgroundColor,
  gradeColor,
  borderColor,
  league,
  Team,
}: any) => {
  return (
    <div
      className="flex items-center w-full justify-center gap-5 p-2 sm:p-0 sm:pt-1 flex-shrink-1 rounded-lg border-2"
      style={{ backgroundColor, borderColor }}
    >
      {Team && (
        <div className="flex flex-col py-1 items-center">
          <div
            className={`flex items-center justify-center 
                          size-6 md:size-8 rounded-full border-2`}
            style={{ borderColor, backgroundColor: gradeColor }}
          >
            <Text variant="xs" classes={`font-semibold text-center`}>
              {Team.OverallGrade ? Team.OverallGrade : "-"}
            </Text>
          </div>
          <Text
            variant="xs"
            classes={`font-semibold 
                    whitespace-nowrap`}
          >
            OVR
          </Text>
        </div>
      )}
      {Team && (
        <div className="flex flex-col py-1 items-center">
          <div
            className={`flex items-center justify-center 
                          size-6 md:size-8 rounded-full border-2`}
            style={{ borderColor, backgroundColor: gradeColor }}
          >
            <Text variant="xs" classes={`font-semibold`}>
              {Team.OffenseGrade ? Team.OffenseGrade : "-"}
            </Text>
          </div>
          <Text
            variant="xs"
            classes={`font-semibold 
                    whitespace-nowrap`}
          >
            OFF
          </Text>
        </div>
      )}
      {Team && (
        <div className="flex flex-col py-1 items-center">
          <div
            className={`flex items-center justify-center 
                          size-6 md:size-8 rounded-full border-2`}
            style={{ borderColor, backgroundColor: gradeColor }}
          >
            <Text variant="xs" classes={`font-semibold text-center`}>
              {Team.DefenseGrade ? Team.DefenseGrade : "-"}
            </Text>
          </div>
          <Text
            variant="xs"
            classes={`font-semibold 
                    whitespace-nowrap`}
          >
            DEF
          </Text>
        </div>
      )}
      {Team && Team.SpecialTeamsGrade && (
        <div className="flex flex-col py-1 items-center">
          <div
            className={`flex items-center justify-center 
                          size-6 md:size-8 rounded-full border-2`}
            style={{ borderColor, backgroundColor: gradeColor }}
          >
            <Text variant="xs" classes={`font-semibold`}>
              {Team.SpecialTeamsGrade ? Team.SpecialTeamsGrade : "-"}
            </Text>
          </div>
          <Text
            variant="xs"
            classes={`font-semibold 
                    whitespace-nowrap`}
          >
            STU
          </Text>
        </div>
      )}
    </div>
  );
};
