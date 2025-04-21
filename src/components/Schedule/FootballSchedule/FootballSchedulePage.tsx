import { FC, useEffect, useMemo, useState } from "react";
import {
  League,
  Overview,
  Standings,
  WeeklyGames,
  TeamGames,
  Seasons,
  FootballWeeks as Weeks,
  Divisions,
  Conferences
} from "../../../_constants/constants";
import { useAuthStore } from "../../../context/AuthContext";
import { SelectDropdown } from "../../../_design/Select";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import { useTeamColors } from "../../../_hooks/useTeamColors";
import { useSimFBAStore } from "../../../context/SimFBAContext";
import { isBrightColor } from "../../../_utility/isBrightColor";
import { useMobile } from "../../../_hooks/useMobile";
import { GetCurrentWeek } from "../../../_helper/teamHelper";
import { getScheduleCFBData, getScheduleNFLData, processSchedule } from "../Common/SchedulePageHelper";
import { TeamSchedule, TeamStandings, LeagueStats, LeagueStandings } from "../Common/SchedulePageComponents";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import { darkenColor } from "../../../_utility/getDarkerColor";
import { PaperAirplane } from "../../../_design/Icons";
import { ToggleSwitch } from "../../../_design/Inputs";

interface SchedulePageProps {
  league: League;
  ts: any;
}

export const CFBSchedulePage: FC<SchedulePageProps> = ({ league, ts }) => {
  const { currentUser } = useAuthStore();
  const fbStore = useSimFBAStore();
  const currentWeek = GetCurrentWeek(league, ts)
  const currentSeason = ts.Season;
  const {
    cfbTeam,
    cfbTeams,
    cfbTeamMap,
    cfbRosterMap,
    cfbTeamOptions,
    allCFBStandings,
    allCollegeGames: allCFBGames,
    topCFBPassers,
    topCFBReceivers,
    topCFBRushers,
    isLoading
  } = fbStore;

  const [selectedTeam, setSelectedTeam] = useState(cfbTeam);
  const [category, setCategory] = useState(Overview);
  const [view, setView] = useState(TeamGames);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)

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

  const { teamStandings, teamSchedule } = useMemo(() => {
    return getScheduleCFBData(
      selectedTeam,
      currentWeek,
      selectedWeek,
      selectedSeason,
      league,
      allCFBStandings,
      allCFBGames,
      cfbTeams,
    );
  }, [selectedTeam, currentWeek, selectedWeek, selectedSeason, league, allCFBStandings, allCFBGames, cfbTeams]);

  const processedSchedule = useMemo(() => processSchedule(teamSchedule, selectedTeam, ts, league), [
    teamSchedule,
    selectedTeam,
    ts,
    league,
  ]);

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
              {view === TeamGames ? (
                <>
                  <Text variant="body">Teams</Text>
                  <SelectDropdown
                    options={cfbTeamOptions}
                    placeholder="Select Team..."
                    onChange={selectTeamOption}
                  />
                </>
              ) : (
                <>
                  <Text variant="body">Week</Text>
                  <SelectDropdown
                    options={Weeks}
                    placeholder="Select Week..."
                    onChange={(selectedOption) => {
                      const selectedWeek = Number(selectedOption?.value);
                      setSelectedWeek(selectedWeek);
                    }}
                  />
                </>
              )}
            </div>            
            <div className="flex flex-col items-center gap-2 justify-center">
              <Text variant="body">Seasons</Text>
              <SelectDropdown
                options={Seasons}
                placeholder="Select Season..."
                onChange={(selectedOption) => {
                  const selectedSeason = Number(selectedOption?.value);
                  setSelectedWeek(selectedSeason);
                }}
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
          {category === Standings && (
            <div className="flex flex-col h-full col-span-5">
              <LeagueStandings
              currentUser={currentUser}
              league={league}
              standings={allCFBStandings}
              backgroundColor={backgroundColor}
              headerColor={headerColor}
              borderColor={borderColor}
              textColorClass={textColorClass}
              darkerBackgroundColor={darkerBackgroundColor}
              isLoadingTwo={isLoading}
            />
          </div>
           )}
        {category === Overview && (
          <div className="flex flex-col h-full col-span-2">
          {category === Overview && view === TeamGames && (
            <TeamSchedule
              team={selectedTeam}
              Abbr={selectedTeam?.TeamAbbr}
              currentUser={currentUser}
              week={currentWeek}
              league={league}
              ts={ts}
              processedSchedule={processedSchedule}
              backgroundColor={backgroundColor}
              headerColor={headerColor}
              borderColor={borderColor}
              textColorClass={textColorClass}
              darkerBackgroundColor={darkerBackgroundColor}
              isLoadingTwo={isLoading}
            />
           )}
          </div>
        )}
        {category === Overview && (
          <div className="flex flex-col h-full col-span-2">
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
        )}
        {category === Overview && (
          <div className="flex flex-col h-full col-span-1">
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
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export const NFLSchedulePage: FC<SchedulePageProps> = ({ league, ts }) => {
  const { currentUser } = useAuthStore();
  const fbStore = useSimFBAStore();
  const currentWeek = GetCurrentWeek(league, ts)
  const currentSeason = ts.Season;
  const {
    nflTeam,
    nflTeams,
    proTeamMap: nflTeamMap,
    proRosterMap: nflRosterMap,
    nflTeamOptions,
    allProStandings: allNFLStandings,
    allProGames: allNFLGames,
    topNFLPassers,
    topNFLReceivers,
    topNFLRushers,
    isLoading
  } = fbStore;

  const [selectedTeam, setSelectedTeam] = useState(nflTeam);
  const [category, setCategory] = useState(Overview);
  const [scheduleView, setScheduleView] = useState(TeamGames);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [standingsView, setStandingsView] = useState(Conferences)

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
    if (selectedTeam && nflRosterMap) {
      return nflRosterMap[selectedTeam.ID];
    }
    return null;
  }, [nflRosterMap, selectedTeam]);

  const selectTeamOption = (opts: SingleValue<SelectOption>) => {
    const value = Number(opts?.value);
    const nextTeam = nflTeamMap ? nflTeamMap[value] : null;
    setSelectedTeam(nextTeam);
    setCategory(Overview);
  };

  const leagueStatsData = useMemo(() => {
    const processStats = (players: any[]) =>
      players.slice(0, 1).map((player) => {
        const team = nflTeams.find((team) => team.ID === player.TeamID);
  
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
      topPassers: processStats(topNFLPassers),
      topRushers: processStats(topNFLRushers),
      topReceivers: processStats(topNFLReceivers),
    };
  }, [topNFLPassers, topNFLRushers, topNFLReceivers, nflTeams]);

  const { teamStandings, teamSchedule } = useMemo(() => {
    return getScheduleNFLData(
      selectedTeam,
      currentWeek,
      selectedWeek,
      selectedSeason,
      league,
      allNFLStandings,
      allNFLGames,
      nflTeams,
    );
  }, [selectedTeam, currentWeek, selectedWeek, selectedSeason, league, allNFLStandings, allNFLGames, nflTeams]);

  const processedSchedule = useMemo(() => processSchedule(teamSchedule, selectedTeam, ts, league), [
    teamSchedule,
    selectedTeam,
    ts,
    league,
  ]);

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
                  setScheduleView(checked ? WeeklyGames : TeamGames);
                  setIsChecked(checked);
                }}
                checked={isChecked}
              />
              <Text variant="small">Weekly Games</Text>
            </div>
          )}
          {category === Standings && (
            <div className="flex justify-center items-center gap-2">
              <ToggleSwitch
                onChange={(checked) => {
                  setStandingsView(checked ? Divisions : Conferences);
                  setIsChecked(checked);
                }}
                checked={isChecked}
              />
              <Text variant="small">Divisions</Text>
            </div>
          )}
            <div className="flex flex-col items-center gap-2 justify-center">
              {scheduleView === TeamGames ? (
                <>
                  <Text variant="body">Teams</Text>
                  <SelectDropdown
                    options={nflTeamOptions}
                    placeholder="Select Team..."
                    onChange={selectTeamOption}
                  />
                </>
              ) : (
                <>
                  <Text variant="body">Week</Text>
                  <SelectDropdown
                    options={Weeks}
                    placeholder="Select Week..."
                    onChange={(selectedOption) => {
                      const selectedWeek = Number(selectedOption?.value);
                      setSelectedWeek(selectedWeek);
                    }}
                  />
                </>
              )}
            </div>            
            <div className="flex flex-col items-center gap-2 justify-center">
              <Text variant="body">Seasons</Text>
              <SelectDropdown
                options={Seasons}
                placeholder="Select Season..."
                onChange={(selectedOption) => {
                  const selectedSeason = Number(selectedOption?.value);
                  setSelectedWeek(selectedSeason);
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-2 justify-center">
              <Text variant="body">Export Day of Week</Text>
              <SelectDropdown
                options={nflTeamOptions}
                placeholder="Select Timeslot..."
                onChange={selectTeamOption}
              />
            </div>
          </div>
          {category === Standings && (
            <div className="flex flex-col h-full col-span-5">
              <LeagueStandings
              currentUser={currentUser}
              league={league}
              category={standingsView}
              standings={allNFLStandings}
              backgroundColor={backgroundColor}
              headerColor={headerColor}
              borderColor={borderColor}
              textColorClass={textColorClass}
              darkerBackgroundColor={darkerBackgroundColor}
              isLoadingTwo={isLoading}
            />
          </div>
           )}
        {category === Overview && (
          <div className="flex flex-col h-full col-span-2">
          {category === Overview && scheduleView === TeamGames && (
            <TeamSchedule
              team={selectedTeam}
              Abbr={selectedTeam?.TeamAbbr}
              currentUser={currentUser}
              week={currentWeek}
              league={league}
              ts={ts}
              processedSchedule={processedSchedule}
              backgroundColor={backgroundColor}
              headerColor={headerColor}
              borderColor={borderColor}
              textColorClass={textColorClass}
              darkerBackgroundColor={darkerBackgroundColor}
              isLoadingTwo={isLoading}
            />
           )}
          </div>
        )}
        {category === Overview && (
          <div className="flex flex-col h-full col-span-2">
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
        )}
        {category === Overview && (
          <div className="flex flex-col h-full col-span-1">
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
          </div>
        )}
        </div>
      </div>
    </>
  );
};