import { useMemo, useState } from "react";
import { useLeagueStore } from "../../../context/LeagueContext";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import {
  GameType,
  PLAYER_VIEW,
  REGULAR_SEASON,
  SimCHL,
  SimPHL,
  StatsType,
  StatsView,
  WEEK_VIEW,
} from "../../../_constants/constants";
import {
  GetHCKCollegeStats,
  GetHCKProStats,
  getHCKWeekID,
  MakeCHLPlayerMapFromRosterMap,
  MakeHCKSeasonsOptionList,
  MakeHCKWeeksOptionList,
  MakePHLPlayerMapFromRosterMap,
} from "../../../_helper/statsPageHelper";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";

export const useHockeyStats = () => {
  const { selectedLeague } = useLeagueStore();
  const {
    chlTeamMap,
    phlTeamMap,
    chlTeams,
    phlTeams,
    chlRosterMap,
    proRosterMap,
    chlPlayerGameStatsMap,
    chlPlayerSeasonStatsMap,
    chlTeamGameStatsMap,
    chlTeamSeasonStatsMap,
    phlPlayerGameStatsMap,
    phlPlayerSeasonStatsMap,
    phlTeamGameStatsMap,
    phlTeamSeasonStatsMap,
    hck_Timestamp,
    SearchHockeyStats,
    ExportHockeyStats,
  } = useSimHCKStore();

  const [statsView, setStatsView] = useState<StatsView>(WEEK_VIEW);
  const [statsType, setStatsType] = useState<StatsType>(PLAYER_VIEW);
  const [gameType, setGameType] = useState<GameType>(REGULAR_SEASON);
  const [selectedWeek, setSelectedWeek] = useState<number>(2501);
  const [selectedSeason, setSelectedSeason] = useState<number>(1); // SEASON ID
  const seasonOptions = useMemo(() => {
    if (!hck_Timestamp) {
      return [{ label: "2025", value: 1 }];
    }
    return MakeHCKSeasonsOptionList(hck_Timestamp);
  }, [hck_Timestamp]);

  const weekOptions = useMemo(() => {
    return MakeHCKWeeksOptionList(selectedSeason);
  }, [selectedSeason]);

  const playerMap = useMemo(() => {
    if (selectedLeague === SimCHL) {
      return MakeCHLPlayerMapFromRosterMap(chlTeams, chlRosterMap);
    } else if (selectedLeague === SimPHL) {
      return MakePHLPlayerMapFromRosterMap(phlTeams, proRosterMap);
    }
    return [];
  }, [selectedLeague, chlTeams, phlTeams, chlRosterMap, proRosterMap]);

  const ChangeStatsView = (newView: StatsView) => {
    setStatsView(newView);
  };

  const SelectSeasonOption = (opts: SingleValue<SelectOption>) => {
    const value = opts!.value;
    const num = Number(value);
    const newWeekID = getHCKWeekID(1, num);
    setSelectedSeason(num);
    setSelectedWeek(newWeekID);
  };

  const SelectWeekOption = (opts: SingleValue<SelectOption>) => {
    const value = opts!.value;
    const num = Number(value);
    setSelectedWeek(num);
  };

  const selectedStats = useMemo(() => {
    if (selectedLeague === SimCHL) {
      return GetHCKCollegeStats(
        statsView,
        statsType,
        selectedWeek,
        selectedSeason,
        chlPlayerGameStatsMap,
        chlPlayerSeasonStatsMap,
        chlTeamGameStatsMap,
        chlTeamSeasonStatsMap
      );
    }
    return GetHCKProStats(
      statsView,
      statsType,
      selectedWeek,
      selectedSeason,
      phlPlayerGameStatsMap,
      phlPlayerSeasonStatsMap,
      phlTeamGameStatsMap,
      phlTeamSeasonStatsMap
    );
  }, [
    selectedLeague,
    statsView,
    statsType,
    selectedSeason,
    selectedWeek,
    chlPlayerGameStatsMap,
    chlPlayerSeasonStatsMap,
    chlTeamGameStatsMap,
    chlTeamSeasonStatsMap,
    phlPlayerGameStatsMap,
    phlPlayerSeasonStatsMap,
    phlTeamGameStatsMap,
    phlTeamSeasonStatsMap,
  ]);
  // Make a Hockey Award title Modal. Heisman, but for hockey
  // Fighter award title?

  // Search Logic
  const Search = async () => {
    const dto = {
      League: selectedLeague,
      StatsView: statsView,
      WeekID: selectedWeek,
      SeasonID: selectedSeason,
      GameType: "REGULAR",
    };

    return await SearchHockeyStats(dto);
  };

  const Export = async () => {
    const dto = {
      League: selectedLeague,
      StatsView: statsView,
      WeekID: selectedWeek,
      SeasonID: selectedSeason,
      GameType: "REGULAR",
    };
    return await ExportHockeyStats(dto);
  };

  return {};
};
