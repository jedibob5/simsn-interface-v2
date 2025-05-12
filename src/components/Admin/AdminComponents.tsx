import { 
  League, 
  SimCFB, 
  SimNFL,
  SimCHL,
  SimPHL
 } from "../../_constants/constants";
 import { useSimFBAStore } from "../../context/SimFBAContext";
 import { GetCurrentWeek } from "../../_helper/teamHelper";
 import { GetLeagueTS } from "../../_helper/teamHelper";


interface CommissionerHubProps {
  league: any;
}

export const CommissionerHub = ({
  league
}: CommissionerHubProps) => {


  switch (league) {
    case SimNFL:
      ({
        capBreach,
        rosterBreach
      } = getNFLCommissionerData({ league }));
      break;
  }
  
  return (
    <></>
  )
}

export const getNFLCommissionerData = ({
  league
}: CommissionerHubProps) => {
  const fbStore = useSimFBAStore();
  const { capsheetMap, proRosterMap, proTeamMap, cfb_Timestamp: ts } = fbStore;
  const yearlyCap = ts?.Y1Capspace;

  let rosterBreach: { teamID: string; playerCount: number }[] = [];
  let capBreach: { teamID: string; capOverage: number }[] = [];

  if (proRosterMap) {
    Object.entries(proRosterMap).forEach(([teamID, roster]) => {
      const totalPlayers = roster?.length || 0;
      const specialPlayersCount =
        roster?.filter((player: any) => player?.IsPracticeSquad || false).length || 0;

      const injuryReserveCount =
        roster?.filter((player: any) => player?.InjuryReserve || false).length || 0;

      const activeRoster = totalPlayers - specialPlayersCount - injuryReserveCount;
      if (activeRoster > 53) {
        rosterBreach.push({ teamID, playerCount: activeRoster });
      }
    });
  }

  if (capsheetMap) {
    Object.entries(capsheetMap).forEach(([teamID, team]) => {
      const Y1Bonus = team?.Y1Bonus || 0;
      const Y1Salary = team?.Y1Salary || 0;
      const Y1CapHit = team?.Y1CapHit || 0;
      const totalCapHit = Y1Bonus + Y1Salary + Y1CapHit;

      if (yearlyCap && totalCapHit > yearlyCap) {
        const capOverage = totalCapHit - yearlyCap;
        capBreach.push({ teamID, capOverage });
      }
    });
  }

  return {
    capBreach,
    rosterBreach,
  };
};