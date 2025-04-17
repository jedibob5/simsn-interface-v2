import { FC, useEffect, useMemo, useState } from "react";
import {
  League,
  SimCFB,
  SimNFL,
  Overview,
} from "../../../_constants/constants";
import { Border } from "../../../_design/Borders";
import { useAuthStore } from "../../../context/AuthContext";
import { SelectDropdown } from "../../../_design/Select";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";
import { Button } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import { CollegePlayer, NFLPlayer } from "../../../models/footballModels";
import { useTeamColors } from "../../../_hooks/useTeamColors";
import { useSimFBAStore } from "../../../context/SimFBAContext";
import { isBrightColor } from "../../../_utility/isBrightColor";
import { useMobile } from "../../../_hooks/useMobile";
import { GetCurrentWeek } from "../../../_helper/teamHelper";
import { getScheduleCFBData } from "../Common/SchedulePageHelper";
import { TeamSchedule, TeamStandings, LeagueStats } from "../Common/SchedulePageComponents";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import { darkenColor } from "../../../_utility/getDarkerColor";

interface SchedulePageProps {
  league: League;
  ts: any;
}

export const FootballSchedulePage: FC<SchedulePageProps> = ({ league, ts }) => {
  const { currentUser } = useAuthStore();
  const fbStore = useSimFBAStore();
  const currentWeek = GetCurrentWeek(league, ts)
  const {
    cfbTeam,
    cfbTeams,
    cfbTeamMap,
    cfbRosterMap,
    cfbTeamOptions,
    allCFBStandings,
    allCollegeGames: allCFBGames,
    nflTeam,
    nflTeams,
    proTeamMap: nflTeamMap,
    proRosterMap: nflRosterMap,
    nflTeamOptions,
    allProStandings: allNFLStandings,
    topCFBPassers,
    topCFBReceivers,
    topCFBRushers,
    isLoading
  } = fbStore;

  let teamStandings: any[] = [],
    teamNotifications: any[] = [],
    teamMatchUp: any[] = [],
    teamSchedule: any[] = [],
    homeLogo: string = "",
    awayLogo: string = "",
    homeLabel: string = "",
    awayLabel: string = "",
    teamStats: any = {},
    teamNews: any[] = [],
    gameWeek: number = 0;

  const [selectedTeam, setSelectedTeam] = useState(cfbTeam);
  const [category, setCategory] = useState(Overview);
  const teamColors = useTeamColors(
    selectedTeam?.ColorOne,
    selectedTeam?.ColorTwo,
    selectedTeam?.ColorThree
  );
  let backgroundColor = "#1f2937";
  let headerColor = teamColors.One;
  let borderColor = teamColors.Two;
  const [isMobile] = useMobile();

  if (isBrightColor(headerColor)) {
    [headerColor, borderColor] = [borderColor, headerColor];
  }

  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const darkerBackgroundColor = darkenColor(backgroundColor, -5);

  const selectedRoster = useMemo(() => {
    if (selectedTeam && cfbRosterMap) {
      return cfbRosterMap[selectedTeam.ID];
    }
    return null;
  }, [cfbRosterMap, selectedTeam]);

  const selectTeamOption = (opts: SingleValue<SelectOption>) => {
    const value = Number(opts?.value);
    const nextTeam = cfbTeamMap ? cfbTeamMap[value] : null;
    setSelectedTeam(nextTeam);
    setCategory(Overview);
  };

  const leagueStatsData = useMemo(() => {
    const processStats = (players: any[]) =>
      players.slice(0, 3).map((player) => {
        const team = cfbTeams.find((team) => team.ID === player.TeamID);
  
        return {
          id: player.ID,
          name: `${player.FirstName} ${player.LastName}`,
          teamAbbr: player.TeamAbbr,
          team,
          stat1: player.SeasonStats.PassingYards
            ? "Passing Yards"
            : player.SeasonStats.RushingYards
            ? "Rushing Yards"
            : "Receiving Yards",
          stat1Value: player.SeasonStats.PassingYards
            ? player.SeasonStats.PassingYards
            : player.SeasonStats.RushingYards
            ? player.SeasonStats.RushingYards
            : player.SeasonStats.ReceivingYards,
          stat2: player.SeasonStats.PassingTDs
            ? "Passing TDs"
            : player.SeasonStats.RushingTDs
            ? "Rushing TDs"
            : "Receiving TDs",
          stat2Value: player.SeasonStats.PassingTDs
            ? player.SeasonStats.PassingTDs
            : player.SeasonStats.RushingTDs
            ? player.SeasonStats.RushingTDs
            : player.SeasonStats.ReceivingTDs,
        };
      });
  
    return {
      topPassers: processStats(topCFBPassers),
      topRushers: processStats(topCFBRushers),
      topReceivers: processStats(topCFBReceivers),
    };
  }, [topCFBPassers, topCFBRushers, topCFBReceivers, cfbTeams]);

  switch (league) {
    case SimCFB:
      ({
        teamStandings,
        teamSchedule,
      } = getScheduleCFBData(
        selectedTeam,
        currentWeek,
        league,
        allCFBStandings,
        allCFBGames,
        cfbTeams,
      ));
      break;

    default:
      break;
  }

  return (
    <>
      <div className="grid grid-cols-10 gap-4">
        <div className="flex flex-col items-center col-span-2 gap-4 overflow-auto max-h-[85vh]">
          <div className="flex gap-4 justify-center">
            <Button size="md" variant="success">
              Schedule
            </Button>
            <Button size="md" variant="success">
              Standings
            </Button>
          </div>             
          <SelectDropdown
            options={cfbTeamOptions}
            placeholder="Select a team"
            onChange={selectTeamOption}
          />
        </div>
        <div className="flex w-full justify-center col-span-3 h-full pl-8 overflow-auto max-h-[84vh]">
          <TeamSchedule   
            team={selectedTeam}
            currentUser={currentUser}
            week={currentWeek}
            league={league}
            ts={ts}
            schedule={teamSchedule}
            backgroundColor={backgroundColor}
            headerColor={headerColor}
            borderColor={borderColor}
            textColorClass={textColorClass}
            darkerBackgroundColor={darkerBackgroundColor}
            isLoadingTwo={isLoading} 
          />
        </div>
        <div className="flex w-full justify-center col-span-2 h-full overflow-auto max-h-[84vh]">
          <TeamStandings   
            team={selectedTeam}
            currentUser={currentUser}
            league={league}
            standings={teamStandings}
            backgroundColor={backgroundColor}
            headerColor={headerColor}
            borderColor={borderColor}
            textColorClass={textColorClass}
            darkerBackgroundColor={darkerBackgroundColor}
            isLoadingTwo={isLoading} 
          />
        </div>
        <div className="flex col-span-2 justify-center w-full h-full max-h-[84vh]">
          <LeagueStats
            league={league}
            topPassers={leagueStatsData.topPassers}
            topRushers={leagueStatsData.topRushers}
            topReceivers={leagueStatsData.topReceivers}
            titles={["Passing Leaders", "Rushing Leaders", "Receiving Leaders"]}
            backgroundColor={backgroundColor}
            headerColor={headerColor}
            borderColor={borderColor}
            textColorClass={textColorClass}
            darkerBackgroundColor={darkerBackgroundColor}
            isLoadingTwo={isLoading}
          />
        </div>
      </div>
    </>
  );
};