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
  const darkerBorder = borderColor === "#000000" || borderColor === "rgb(0, 0, 0)"
  ? darkenColor(borderColor, 12)
  : darkenColor(borderColor, -12);
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const logo = getLogo(League, id!!, isRetro);
  console.log(Roster)
  return (
    <div className="flex flex-row w-full">
      <Border
        direction="row"
        classes="w-full h-[15em] justify-around px-4"
        styles={{
          backgroundColor,
          borderColor,
        }}
      >            
      <div className="flex justify-center items-center gap-x-2">
      {isPro && (
        <FrontOfficeInfo 
          owner={Owner} 
          gm={GM} 
          coach={Coach} 
          scout={Scout} 
          marketing={Marketing} 
          borderColor={borderColor} 
          backgroundColor={darkerBorder} />
      )}
        <RosterInfo 
            roster={Roster} 
            league={League}
            borderColor={borderColor} 
            backgroundColor={darkerBorder}
            isPro={isPro} />
      </div>
        <div className="flex flex-col justify-center items-center pb-2">
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
            {!isPro && (<Text variant="body-small" classes={`${textColorClass}`}>
              Coach {Coach}
            </Text>
            )}
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
            <div className="flex flex-col justify-center">
              <Text variant="xs" classes={`${textColorClass}`}>
                {Arena}
              </Text>
              <Text variant="xs" classes={`${textColorClass}`}>
                Capacity: {Capacity}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-x-2">
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

export const CapsheetInfo = ({ capsheet, ts, backgroundColor, borderColor }: any) => {
  return (
    <>
      <div className="flex flex-row h-[11em] border-2 rounded-lg p-2" style={{ borderColor, backgroundColor }}>
          {capsheet && (<table className="table-fixed w-[25em]">
            <thead>
              <tr>
                <th>Year</th>
                <th>Bonus</th>
                <th>Salary</th>
                <th>Space</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{ts.Season}</td>
                <td>{capsheet.Y1Bonus.toFixed(2)}</td>
                <td>{capsheet.Y1Salary.toFixed(2)}</td>
                <td>{(ts.Y1Capspace - (capsheet.Y1Bonus + capsheet.Y1Salary)).toFixed(2)}</td>
              </tr>
              <tr>
                <td>{(ts.Season) + 1}</td>
                <td>{capsheet.Y2Bonus.toFixed(2)}</td>
                <td>{capsheet.Y2Salary.toFixed(2)}</td>
                <td>{(ts.Y2Capspace - (capsheet.Y2Bonus + capsheet.Y2Salary)).toFixed(2)}</td>
              </tr>
              <tr>
                <td>{(ts.Season) + 2}</td>
                <td>{capsheet.Y3Bonus.toFixed(2)}</td>
                <td>{capsheet.Y3Salary.toFixed(2)}</td>
                <td>{(ts.Y3Capspace - (capsheet.Y3Bonus + capsheet.Y3Salary)).toFixed(2)}</td>
              </tr>
              <tr>
                <td>{(ts.Season) + 3}</td>
                <td>{capsheet.Y4Bonus.toFixed(2)}</td>
                <td>{capsheet.Y4Salary.toFixed(2)}</td>
                <td>{(ts.Y4Capspace - (capsheet.Y4Bonus + capsheet.Y4Salary)).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>)}
      </div>
    </>
  );
};

export const FrontOfficeInfo = ({ backgroundColor, borderColor, league, owner, coach, gm, scout, marketing }: any) => {
  const personnelRoles = [
    { role: "Owner", value: owner },
    { role: "GM", value: gm },
    { role: "Coach", value: coach },
    { role: "Assistant", value: scout },
    ...(league === "SimPHL" ? [{ role: "Marketing", value: marketing }] : []),
  ]
    .filter(({ value }) => value)
    .reduce((acc: Record<string, string[]>, { role, value }) => {
      if (!acc[value]) {
        acc[value] = [];
      }
      acc[value].push(role);
      return acc;
    }, {});

  const vacancies = [
    { role: "Owner", value: owner },
    { role: "GM", value: gm },
    { role: "Coach", value: coach },
    { role: "Assistant", value: scout },
    ...(league === "SimPHL" ? [{ role: "Marketing", value: marketing }] : []),
  ]
    .filter(({ value }) => !value)
    .map(({ role }) => role)
    .join(", ") || "None";

  return (
    <div
      className="flex w-[15em] h-[11em] border-2 rounded-lg p-2 flex-row"
      style={{ borderColor, backgroundColor }}
    >
      <div className="table-fixed w-full">
        <div className="table-header-group">
          <div className="table-row">
            <div className="table-cell w-[6em] font-semibold text-left">
              <Text variant="body-small">Role</Text>
            </div>
            <div className="table-cell font-semibold text-left">
              <Text variant="body-small">Personnel</Text>
            </div>
          </div>
        </div>
        <div className="table-row-group">
          {Object.entries(personnelRoles).map(([person, roles]) => (
            <div key={person} className="table-row">
              <div className="table-cell h-[1.5em] text-left">
                <Text variant="small">{roles.join("/")}</Text>
              </div>
              <div className="table-cell text-left">
                <Text variant="small">{person}</Text>
              </div>
            </div>
          ))}
          <div className="table-row">
            <div className="table-cell text-left">
              <Text variant="small">Vacancies</Text>
            </div>
            <div className="table-cell text-left">
              <Text variant="small">{vacancies}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RosterInfo = ({ backgroundColor, borderColor, league, roster, isPro }: any) => {
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
    <>
      <div className="flex w-[10em] border-2 rounded-lg p-2 flex-row" 
           style={{ borderColor, backgroundColor }}>
        <div className="table-fixed w-full">
          <div className="table-header-group">
            <div className="table-row">
              <div className="table-cell">
                <Text variant="body-small" 
                      classes="font-semibold">
                  Active Roster
                </Text>
              </div>
              <div className="table-cell">
                <Text variant="body-small" 
                      classes="font-semibold">
                  {isPro ? "Practice Squad" : "Redshirts"}
                </Text>
              </div>
            </div>
          </div>
          <div className="table-row-group">
            <div className="table-row">
              <div className="table-cell">
                <Text variant="small">{isPro ? activeRoster : totalPlayers}
                </Text>
              </div>
              <div className="table-cell">
                <Text variant="small">
                  {specialPlayersCount}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};