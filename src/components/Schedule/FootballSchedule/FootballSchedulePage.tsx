import { FC, useEffect, useMemo, useState } from "react";
import {
  League,
  SimCFB,
  SimNFL,
  Overview,
  Schedule,
  Standings,
  WeeklyGames,
  TeamGames
} from "../../../_constants/constants";
import { Border } from "../../../_design/Borders";
import { useAuthStore } from "../../../context/AuthContext";
import { SelectDropdown } from "../../../_design/Select";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";
import { Button, ButtonGroup } from "../../../_design/Buttons";
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
import { PaperAirplane } from "../../../_design/Icons";
import { ToggleSwitch } from "../../../_design/Inputs";

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
  const [view, setView] = useState(TeamGames);
  const [isChecked, setIsChecked] = useState(false);
  console.log(view)
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
      players.slice(0, 1).map((player) => {
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
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-6 gap-4 w-full h-[82vh]">
          <div className="flex flex-col w-full col-span-1 items-center gap-4 overflow-auto pb-2">
            <div className="flex gap-4 justify-center">
              <ButtonGroup>
                <Button size="sm"
                        variant="primary" 
                        onClick={() => setCategory(Overview)}
                        isSelected={category === Overview}
                        classes="px-3 py-2"
                >
                  <Text variant="xs">
                    Overview
                  </Text>
                </Button>                
                <Button size="sm" 
                        variant="primary" 
                        onClick={() => setCategory(Standings)}
                        isSelected={category === Standings}
                        classes="px-3 py-2"
                >
                  <Text variant="xs">
                    Standings
                  </Text>
                </Button>
              </ButtonGroup>
            </div>
            {category === Overview && (
              <div className="flex justify-center items-center gap-2">
                <ToggleSwitch 
                onChange={(checked) => {
                  setView(checked ? WeeklyGames : TeamGames);
                  setIsChecked(checked);
                }}
                  checked={isChecked}
                />
                <Text variant="small">
                  Weekly Games
                </Text>
              </div>
            )}
            <div className="flex flex-col items-center gap-2 justify-center">
              <Text variant="body">Teams</Text>
              <SelectDropdown
                options={cfbTeamOptions}
                placeholder="Select Team..."
                onChange={selectTeamOption}
              />
            </div>             
            <div className="flex flex-col items-center gap-2 justify-center">
              <Text variant="body">Seasons</Text>
              <SelectDropdown
                options={cfbTeamOptions}
                placeholder="Select Season..."
                onChange={selectTeamOption}
              />
            </div>
            <div className="flex items-center w-[12em] gap-2 justify-center">
              <Button size="md" classes="w-full" variant="primary">
                College Poll
              </Button>
              <Button size="md" variant="warning" classes="opacity-50 h-full">
                <PaperAirplane />
              </Button> 
            </div>
            <div className="flex flex-col items-center gap-2 justify-center">
              <Text variant="body">Export Day of Week</Text>
              <SelectDropdown
                options={cfbTeamOptions}
                placeholder="Select Timeslot..."
                onChange={selectTeamOption}
              />
            </div>
          </div>
          <div className="flex flex-col h-full col-span-2">
          {category === Overview && (
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
           )}
          </div>
          <div className="flex flex-col h-full col-span-2">
          {category === Overview && (
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
          )}
          </div>
          <div className="flex flex-col h-full col-span-1">
          {category === Overview && (
            <LeagueStats
              league={league}
              topPassers={leagueStatsData.topPassers}
              topRushers={leagueStatsData.topRushers}
              topReceivers={leagueStatsData.topReceivers}
              titles={["Passing Leader", "Rushing Leader", "Receiving Leader"]}
              backgroundColor={backgroundColor}
              headerColor={headerColor}
              borderColor={borderColor}
              textColorClass={textColorClass}
              darkerBackgroundColor={darkerBackgroundColor}
              isLoadingTwo={isLoading}
            />
          )}
          </div>
        </div>
      </div>
    </>
  );
};