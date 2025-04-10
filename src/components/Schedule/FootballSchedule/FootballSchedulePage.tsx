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

interface SchedulePageProps {
    league: League;
    ts: any;
  }

export const FootballSchedulePage = ({ league, ts }: SchedulePageProps) => {
  const { currentUser } = useAuthStore();
  const fbStore = useSimFBAStore();
  const {
    cfbTeam,
    cfbTeamMap,
    cfbRosterMap,
    cfbTeamOptions,
    allCFBStandings,
    nflTeam,
    proTeamMap: nflTeamMap,
    proRosterMap: nflRosterMap,
    nflTeamOptions,
    allProStandings: allNFLStandings,
  } = fbStore;

  const [selectedTeam, setSelectedTeam] = useState(cfbTeam);
  const [category, setCategory] = useState(Overview);
  const teamColors = useTeamColors(
    selectedTeam?.ColorOne,
    selectedTeam?.ColorTwo,
    selectedTeam?.ColorThree
  );
  let backgroundColor = teamColors.One;
  let borderColor = teamColors.Two;
  const [isMobile] = useMobile();

  if (isBrightColor(backgroundColor)) {
    [backgroundColor, borderColor] = [borderColor, backgroundColor];
  }

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

  return (
    <>
    <Text>FOOTBALL SCHEDULE PAGE</Text>
    </>
  );
};