import { FC, useEffect, useMemo, useState } from "react";
import {
  League,
  SimCHL,
  SimPHL,
  Overview,
} from "../../../_constants/constants";
import { Border } from "../../../_design/Borders";
import { useAuthStore } from "../../../context/AuthContext";
import { SelectDropdown } from "../../../_design/Select";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";
import { Button } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import {
  CollegePlayer as CHLPlayer,
  ProfessionalPlayer as PHLPlayer,
} from "../../../models/hockeyModels";
import { useTeamColors } from "../../../_hooks/useTeamColors";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { isBrightColor } from "../../../_utility/isBrightColor";
import { ActionModal } from "../../Common/ActionModal";
import { useMobile } from "../../../_hooks/useMobile";

interface SchedulePageProps {
    league: League;
    ts: any;
  }

export const HockeySchedulePage = ({ league, ts }: SchedulePageProps) => {
  const { currentUser } = useAuthStore();
  const hkStore = useSimHCKStore();
  const {
    chlTeam,
    chlTeamMap,
    chlRosterMap,
    chlTeamOptions,
    allCHLStandings,
    phlTeam,
    phlTeamMap,
    proRosterMap: phlRosterMap,
    phlTeamOptions,
    allProStandings: allPHLStandings,
  } = hkStore;

  const [selectedTeam, setSelectedTeam] = useState(chlTeam);
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

  return (
    <>
    <Text>HOCKEY SCHEDULE PAGE</Text>
    </>
  );
};