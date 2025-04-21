import { FC, useEffect, useMemo, useState } from "react";
import {
  League,
  Overview,
  Standings,
  WeeklyGames,
  TeamGames,
  Seasons,
  CHLWeeks,
  PHLWeeks,
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
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { isBrightColor } from "../../../_utility/isBrightColor";
import { useMobile } from "../../../_hooks/useMobile";
import { GetCurrentWeek, RevealFBResults } from "../../../_helper/teamHelper";
import { getScheduleCHLData, getSchedulePHLData, processSchedule } from "../Common/SchedulePageHelper";
import { TeamSchedule, TeamStandings, LeagueStats, LeagueStandings, WeeklySchedule } from "../Common/SchedulePageComponents";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import { darkenColor } from "../../../_utility/getDarkerColor";
import { PaperAirplane } from "../../../_design/Icons";
import { ToggleSwitch } from "../../../_design/Inputs";
import { getLogo } from "../../../_utility/getLogo";
import { CollegeGame as CHLGame, ProfessionalGame as PHLGame } from "../../../models/hockeyModels";
interface SchedulePageProps {
  league: League;
  ts: any;
}

export const CHLSchedulePage: FC<SchedulePageProps> = ({ league, ts }) => {
  const { currentUser } = useAuthStore();
  const hkStore = useSimHCKStore();
  const currentWeek = GetCurrentWeek(league, ts)
  const currentSeason = ts.Season;
  const {
    chlTeam,
    chlTeams,
    chlTeamMap,
    chlRosterMap,
    chlTeamOptions,
    allCHLStandings,
    allCollegeGames: allCHLGames,
    isLoading
  } = hkStore;

  const [selectedTeam, setSelectedTeam] = useState(chlTeam);
  const [category, setCategory] = useState(Overview);
  const [view, setView] = useState(TeamGames);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
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
    if (selectedTeam && chlRosterMap) {
      return chlRosterMap[selectedTeam.ID];
    }
    return null;
  }, [chlRosterMap, selectedTeam]);

  const selectTeamOption = (opts: SingleValue<SelectOption>) => {
    const value = Number(opts?.value);
    const nextTeam = chlTeamMap ? chlTeamMap[value] : null;
    setSelectedTeam(nextTeam);
    setCategory(Overview);
  };

  const { teamStandings, teamSchedule, groupedWeeklyGames } = useMemo(() => {
    return getScheduleCHLData(
      selectedTeam,
      currentWeek,
      selectedWeek,
      selectedSeason,
      league,
      allCHLStandings,
      allCHLGames,
      chlTeams
    );
  }, [selectedTeam, 
      currentWeek, 
      selectedWeek, 
      selectedSeason, 
      league, 
      allCHLStandings, 
      allCHLGames, 
      chlTeams]);
    const processedSchedule = useMemo(() => processSchedule(teamSchedule, selectedTeam, ts, league), [
      teamSchedule,
      selectedTeam,
      ts,
      league,
    ]);

    const weeklyGames = useMemo(() => {
      if (!selectedWeek) return [];
      const gamesForWeek = groupedWeeklyGames[selectedWeek] || [];
      return gamesForWeek.sort((a: CHLGame, b: CHLGame) => (a.GameDay > b.GameDay ? 1 : -1));
    }, [groupedWeeklyGames, selectedWeek]);

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
                    options={chlTeamOptions}
                    placeholder="Select Team..."
                    onChange={selectTeamOption}
                  />
                </>
              ) : (
                <>
                  <Text variant="body">Week</Text>
                  <SelectDropdown
                    options={Array.from({ length: 22 }, (_, i) => ({
                      label: `${i + 1}`,
                      value: (i + 1).toString(),
                    }))}
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
                  setSelectedSeason(selectedSeason);
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
                options={chlTeamOptions}
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
              standings={allCHLStandings}
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
          <div className="flex flex-col h-full col-span-2 overflow-auto">
            {view === TeamGames && (
              <TeamSchedule
                team={selectedTeam}
                Abbr={selectedTeam?.Abbreviation}
                category={view}
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
            {view === WeeklyGames && (
              <WeeklySchedule
                team={selectedTeam}
                Abbr={selectedTeam?.Abbreviation}
                category={view}
                currentUser={currentUser}
                week={selectedWeek}
                league={league}
                ts={ts}
                processedSchedule={weeklyGames}
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
        </div>
      </div>
    </>
  );
};

export const PHLSchedulePage: FC<SchedulePageProps> = ({ league, ts }) => {
  const { currentUser } = useAuthStore();
  const hkStore = useSimHCKStore();
  const currentWeek = GetCurrentWeek(league, ts)
  const currentSeason = ts.Season;
  const {
    phlTeam,
    phlTeams,
    phlTeamMap,
    proRosterMap: phlRosterMap,
    phlTeamOptions,
    allProStandings: allPHLStandings,
    allProGames: allPHLGames,
    isLoading
  } = hkStore;

  const [selectedTeam, setSelectedTeam] = useState(phlTeam);
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
    if (selectedTeam && phlRosterMap) {
      return phlRosterMap[selectedTeam.ID];
    }
    return null;
  }, [phlRosterMap, selectedTeam]);

  const selectTeamOption = (opts: SingleValue<SelectOption>) => {
    const value = Number(opts?.value);
    const nextTeam = phlTeamMap ? phlTeamMap[value] : null;
    setSelectedTeam(nextTeam);
    setCategory(Overview);
  };

  const { teamStandings, teamSchedule } = useMemo(() => {
    return getSchedulePHLData(
      selectedTeam,
      currentWeek,
      selectedWeek,
      selectedSeason,
      league,
      allPHLStandings,
      allPHLGames,
      phlTeams
    );
  }, [selectedTeam, currentWeek, selectedWeek, selectedSeason, league, allPHLStandings, allPHLGames, phlTeams]);

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
                    options={phlTeamOptions}
                    placeholder="Select Team..."
                    onChange={selectTeamOption}
                  />
                </>
              ) : (
                <>
                  <Text variant="body">Week</Text>
                  <SelectDropdown
                    options={PHLWeeks}
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
                options={phlTeamOptions}
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
              standings={allPHLStandings}
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
          <div className="flex flex-col h-full col-span-2 overflow-auto">
          {category === Overview && scheduleView === TeamGames && (
            <TeamSchedule
              team={selectedTeam}
              Abbr={selectedTeam?.Abbreviation}
              category={scheduleView}
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
          {category === Overview && scheduleView === WeeklyGames && (
            <WeeklySchedule
              team={selectedTeam}
              Abbr={selectedTeam?.Abbreviation}
              category={scheduleView}
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
        </div>
      </div>
    </>
  );
};