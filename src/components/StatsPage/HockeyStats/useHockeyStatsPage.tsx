import { useSimHCKStore } from "../../../context/SimHockeyContext";

export const useHockeyStats = () => {
  const { chlTeamMap, phlTeamMap } = useSimHCKStore();

  // Make ProPlayer & College Player Map in context. We have the data, just organized by teams & roster map
  // Get Pro Players & College Player Map
  // Do we need a stats context? Possibly.

  // Based on league selected, return the specific set of stats required.
  // Pagination will be needed.
  // Keep track of statsView (week/season), selectedWeek, selectedSeason
  // Make this an input-first UI. Keep stats in context. This will help save on loading for bootstrap.

  // Make a Hockey Award title Modal. Heisman, but for hockey
  // Fighter award title?

  // Search Logic

  return {};
};
