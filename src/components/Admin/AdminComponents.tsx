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
 import { getLogo } from "../../_utility/getLogo";
 import { Text } from "../../_design/Typography";
 import { Logo } from "../../_design/Logo";


interface CommissionerHubProps {
  league: any;
}

export const CommissionerHub = ({
  league
}: CommissionerHubProps) => {

  let capBreach: { teamID: string; capOverage: number }[] = [];
  let rosterBreach: { teamID: string; playerCount: number }[] = [];

  switch (league) {
    case SimNFL:
      ({
        capBreach,
        rosterBreach
      } = getNFLCommissionerData({ league }));
      break;
  }
  
  return (
    <div className="flex flex-row justify-between gap-8 p-4 max-w-[95vw]">
      <div className="flex flex-col w-1/2">
        <Text variant="h3" className="mb-4">Cap Breaches</Text>
        <div className="flex flex-wrap w-full justify-around gap-1">
        {capBreach.length > 0 ? (
          capBreach.slice(1).map((breach) => (
              <div key={breach.teamID} className="mb-4 w-[12em] p-4 flex flex-col items-center border rounded-md">
                <Logo
                  url={getLogo(league, Number(breach.teamID), false)}
                  variant="normal"
                />
                <Text variant="small" className="text-center text-red-500">
                  {`Capspace: $${breach.capOverage.toFixed(2)}M`}
                </Text>
              </div>
          ))
        ) : (
          <p>No cap breaches found.</p>
        )}
        </div>
      </div>
      <div className="border" />
      <div className="flex flex-col w-1/2">
        <Text variant="h3" className="mb-4">Roster Breaches</Text>
        <div className="flex flex-wrap w-full justify-around gap-2">
        {rosterBreach.length > 0 ? (
          rosterBreach.map((roster) => (
              <div key={roster.teamID} className="mb-4 w-[14em] p-4 flex flex-col items-center border rounded-md">
                <Logo
                  url={getLogo(league, Number(roster.teamID), false)}
                  variant="normal"
                />
                <Text variant="small" className="text-center text-red-500">
                  {`Active Roster: ${roster.playerCount} players`}
                </Text>
              </div>
          ))
        ) : (
          <p>No roster breaches found.</p>
        )}
        </div>
      </div>
    </div>
  )
}

export const getNFLCommissionerData = ({
  league
}: CommissionerHubProps) => {
  const fbStore = useSimFBAStore();
  const { capsheetMap, proRosterMap, cfb_Timestamp: ts } = fbStore;
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