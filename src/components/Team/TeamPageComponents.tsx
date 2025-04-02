import { FC } from "react";
import { Border } from "../../_design/Borders";
import { Text } from "../../_design/Typography";
import {
  League,
  SimPHL,
} from "../../_constants/constants";
import { getTextColorBasedOnBg } from "../../_utility/getBorderClass";
import { darkenColor } from "../../_utility/getDarkerColor";
import { getLogo } from "../../_utility/getLogo";
import { Logo } from "../../_design/Logo";

interface TeamInfoProps {
  id?: number;
  TeamName?: string;
  Team: any;
  Owner?: string;
  Coach?: string;
  GM?: string;
  Scout?: string;
  Marketing?: string;
  Conference?: string;
  Division?: string;
  Roster?: any;
  Arena?: string;
  Capacity?: number;
  isPro: boolean;
  Capsheet?: any;
  League: League;
  ts: any;
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
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
  Division,
  Conference = "",
  Arena = "",
  Capacity = 0,
  Capsheet = "",
  League,
  Roster,
  ts,
  colorOne = "",
  colorTwo = "",
  colorThree = "",
  isRetro = false,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const darkerBorder = backgroundColor === "#000000" || borderColor === "rgb(0, 0, 0)"
  ? darkenColor(backgroundColor, 5)
  : darkenColor(backgroundColor, -5);
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const logo = getLogo(League, id!!, isRetro);
  return (
    <div className="flex flex-row">
      <Border
        direction="row"
        classes="sm:w-full min-w-[70vw] p-8 justify-around"
        styles={{
          backgroundColor,
          borderColor,
        }}
      >            
      <div className="flex w-1/3 justify-center items-center gap-x-2">

        <FrontOfficeInfo 
          owner={Owner} 
          gm={GM} 
          coach={Coach} 
          scout={Scout} 
          isPro={isPro}
          marketing={Marketing} 
          borderColor={borderColor} 
          backgroundColor={darkerBorder}
          lineColor={backgroundColor}
          textColorClass={textColorClass} />

          <RosterInfo 
            roster={Roster} 
            league={League}
            arena={Arena}
            capacity={Capacity}
            textColorClass={textColorClass}
            borderColor={borderColor} 
            backgroundColor={darkerBorder}
            isPro={isPro} />
          <StadiumInfo 
            league={League}
            arena={Arena}
            team={Team}
            capacity={Capacity}
            textColorClass={textColorClass}
            borderColor={borderColor} 
            backgroundColor={darkerBorder}
            isPro={isPro} />
      </div>
        <div className="flex flex-col w-1/4 justify-center items-center pb-2">
          <div className="flex flex-col max-w-1/4 p-2">
            <div className="max-w-[6rem] w-[5.5em] h-[5.5rem] rounded-lg border-2"
                 style={{ backgroundColor: darkerBorder, borderColor: borderColor }}>
              <Logo url={logo} variant="large" containerClass="" />
            </div>
          </div>
          <div className="flex flex-col max-w-1/2">
            <Text variant="h5" classes={`${textColorClass}`}>
              {TeamName}
            </Text>
            <div className="flex flex-row justify-center">
              <Text variant="body-small" classes={`${textColorClass}`}>
                {Conference} Conference
              </Text>
              {Division && Division.length > 0 && (
                <Text variant="body-small" classes={`${textColorClass}`}>
                  {Division}
                </Text>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/3 items-center justify-center gap-x-2">
          {isPro && (
            <CapsheetInfo 
              capsheet={Capsheet} 
              ts={ts} 
              borderColor={borderColor} 
              backgroundColor={darkerBorder} 
            />
          )}
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

export const CapsheetInfo = ({ capsheet, ts, backgroundColor, borderColor, textColorClass }: any) => {
  return (
    <div
      className="flex w-full h-[100%] border-2 rounded-lg py-5 flex-row"
      style={{ borderColor, backgroundColor }}
    >
      {capsheet && (
        <div className="table-fixed w-full">
          <div className="table-header-group w-full">
            <div className="table-row">
              <div className="table-cell w-[8em] font-semibold">
                <Text variant="body" classes={`${textColorClass}`}>Year</Text>
              </div>
              <div className="table-cell w-[8em] font-semibold">
                <Text variant="body" classes={`${textColorClass}`}>Bonus</Text>
              </div>
              <div className="table-cell w-[8em] font-semibold">
                <Text variant="body" classes={`${textColorClass}`}>Salary</Text>
              </div>
              <div className="table-cell w-[8em] font-semibold">
                <Text variant="body" classes={`${textColorClass}`}>Space</Text>
              </div>
            </div>
          </div>
          <div className="table-row-group">
            <div className="table-row">
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{ts.Season}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y1Bonus.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y1Salary.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  {(ts.Y1Capspace - (capsheet.Y1Bonus + capsheet.Y1Salary)).toFixed(2)}
                </Text>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{ts.Season + 1}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y2Bonus.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y2Salary.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  {(ts.Y2Capspace - (capsheet.Y2Bonus + capsheet.Y2Salary)).toFixed(2)}
                </Text>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{ts.Season + 2}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y3Bonus.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y3Salary.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  {(ts.Y3Capspace - (capsheet.Y3Bonus + capsheet.Y3Salary)).toFixed(2)}
                </Text>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{ts.Season + 3}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y4Bonus.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>{capsheet.Y4Salary.toFixed(2)}</Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" classes={`${textColorClass}`}>
                  {(ts.Y4Capspace - (capsheet.Y4Bonus + capsheet.Y4Salary)).toFixed(2)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FrontOfficeInfo = ({ 
  backgroundColor, borderColor, textColorClass, lineColor, league, owner, coach, gm, scout, marketing, isPro 
}: any) => {
  const personnelRoles = isPro
    ? [
        { role: "Owner", 
          value: owner },
        { role: "GM", 
          value: gm },
        { role: "Coach", 
          value: coach },
        { role: "Assistant", 
          value: scout },
        ...(league === "SimPHL" ? 
          [{ role: "Marketing", 
             value: marketing }] : []),
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
        { role: "Owner", 
          value: owner },
        { role: "GM", 
          value: gm },
        { role: "Coach", 
          value: coach },
        { role: "Assistant", 
          value: scout },
        ...(league === "SimPHL" ? 
          [{ role: "Marketing", 
             value: marketing }] : []),
      ]
        .filter(({ value }) => !value)
        .map(({ role }) => role)
        .join(", ") || "None"
    : !coach || coach === "AI"
    ? "Coach"
    : "None";

  return (
    <div
      className="flex w-[15em] h-[100%] py-5 border-2 rounded-lg p-2 flex-row"
      style={{ borderColor, backgroundColor }}
    >
      <div className="table-fixed w-full">
        <div className="table-header-group">
          <div className="table-row">
            <div className="table-cell w-[6em] font-semibold text-left">
              <Text variant="body-small" classes={`${textColorClass}`}>Role</Text>
            </div>
            <div className="table-cell font-semibold text-left">
              <Text variant="body-small" classes={`${textColorClass}`}>Personnel</Text>
            </div>
          </div>
        </div>
        <div className="table-row-group">
          {Object.entries(personnelRoles).map(([person, roles]) => (
            <div key={person} className="table-row">
              <div className="table-cell text-left">
                <Text variant="xs" classes={`${textColorClass}`}>{roles.join("/")}</Text>
              </div>
              <div className="table-cell text-left">
                <Text variant="xs" classes={`${textColorClass}`}>{person}</Text>
              </div>
            </div>
          ))}
        </div>
        <div className="flex my-2 border-t" 
             style={{ borderColor: lineColor }} />
        <div className="table-row-group">
          {vacancies && (
            <div className="table-row border-t" 
                 style={{ borderColor: lineColor, borderTopWidth: "2px" }}>
              <div className="table-cell w-[6em] text-left">
                <Text variant="xs" classes={`${textColorClass}`}>Vacancies</Text>
              </div>
              <div className="table-cell text-left">
                <Text variant="xs" classes={`${textColorClass}`}>{vacancies}</Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RosterInfo = ({ backgroundColor, borderColor, league, arena, capacity, roster, isPro, textColorClass }: any) => {
  const totalPlayers = roster?.length || 0;
  const specialPlayersCount = roster?.filter((player: any) => {
    if (isPro) {
      return player.IsPracticeSquad;
    } else {
      return player.IsRedshirting;
    }
  }).length || 0;
  const activeRoster = totalPlayers - specialPlayersCount;

  return (
    <div
      className="flex flex-col w-[10em] h-[100%] justify-between py-5 border-2 rounded-lg"
      style={{ borderColor, backgroundColor }}
    >
      <div className="flex flex-col items-center">
        <Text variant="small" classes={`${textColorClass} font-semibold`}>
          Active Roster
        </Text>
        <Text variant="small" classes={`${textColorClass}`}>{activeRoster}</Text>
      </div>
      <div className="flex flex-col items-center">
        <Text variant="small" classes={`${textColorClass} font-semibold`}>
          {isPro ? "Practice Squad" : "Redshirts"}
        </Text>
        <Text variant="small" classes={`${textColorClass}`}>{specialPlayersCount}</Text>
      </div>
    </div>
  );
};

export const StadiumInfo = ({ backgroundColor, borderColor, arena, team, capacity, textColorClass }: any) => {
  return (
    <div
      className="flex flex-col w-[8em] h-[100%] justify-between py-5 border-2 rounded-lg p-1"
      style={{ borderColor, backgroundColor }}
    >
      <div className="flex flex-col items-center">
        <Text variant="body-small" classes={`${textColorClass} font-semibold`}>
          Stadium
        </Text>
        <Text variant="xs" classes={`${textColorClass}`}>{arena}</Text>
      </div>
      <div className="flex flex-col items-center">
        <Text variant="body-small" classes={`${textColorClass} font-semibold`}>
          Capacity
        </Text>
        <Text variant="xs" classes={`${textColorClass}`}>{capacity}</Text>
      </div>
    </div>
  );
};
