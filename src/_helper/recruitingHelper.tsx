import { useMemo } from "react";
import { Croot, Recruit } from "../models/hockeyModels";
import {
  Croot as FootballCroot,
  RecruitingTeamProfile,
} from "../models/footballModels";
import RegionMatcher from "../_matchers/regionMatcher.json";
import StateMatcher from "../_matchers/stateMatcher.json";

export const useFilteredHockeyRecruits = ({
  recruits,
  country,
  positions,
  archetype,
  regions,
  statuses,
  stars,
}: {
  recruits: Croot[];
  country: string;
  positions: string[];
  archetype: string[];
  regions: string[];
  statuses: string[];
  stars: number[];
}) => {
  // 1) build Sets once per-change
  const positionSet = useMemo(() => new Set(positions), [positions]);
  const archSet = useMemo(() => new Set(archetype), [archetype]);
  const regionSet = useMemo(() => new Set(regions), [regions]);
  const statusSet = useMemo(() => new Set(statuses), [statuses]);
  const starsSet = useMemo(() => new Set(stars), [stars]);

  // 2) filter in one pass, rejecting any row that fails an active filter
  return useMemo(
    () => {
      return recruits.filter((r) => {
        // country: if set non-empty and not “All,” must match
        if (country && country !== "All" && r.Country !== country) {
          return false;
        }

        // position
        if (positionSet.size > 0 && !positionSet.has(r.Position)) {
          return false;
        }

        // archetype
        if (archSet.size > 0 && !archSet.has(r.Archetype)) {
          return false;
        }

        // region (state)
        if (regionSet.size > 0 && !regionSet.has(r.State)) {
          return false;
        }

        // stars
        if (starsSet.size > 0 && !starsSet.has(r.Stars)) {
          return false;
        }

        // recruiting status
        if (statusSet.size > 0 && !statusSet.has(r.RecruitingStatus)) {
          return false;
        }

        // passed all active filters
        return true;
      });
    },
    // depend on the raw list plus the Sets
    [recruits, country, positionSet, archSet, regionSet, starsSet, statusSet]
  );
};

export const useFilteredFootballRecruits = ({
  recruits,
  positions,
  archetype,
  regions,
  statuses,
  stars,
}: {
  recruits: FootballCroot[];
  positions: string[];
  archetype: string[];
  regions: string[];
  statuses: string[];
  stars: number[];
}) => {
  // 1) build Sets once per-change
  const positionSet = useMemo(() => new Set(positions), [positions]);
  const archSet = useMemo(() => new Set(archetype), [archetype]);
  const regionSet = useMemo(() => new Set(regions), [regions]);
  const statusSet = useMemo(() => new Set(statuses), [statuses]);
  const starsSet = useMemo(() => new Set(stars), [stars]);

  // 2) filter in one pass, rejecting any row that fails an active filter
  return useMemo(
    () => {
      return recruits.filter((r) => {
        // position
        if (positionSet.size > 0 && !positionSet.has(r.Position)) {
          return false;
        }

        // archetype
        if (archSet.size > 0 && !archSet.has(r.Archetype)) {
          return false;
        }

        // region (state)
        if (regionSet.size > 0 && !regionSet.has(r.State)) {
          return false;
        }

        // stars
        if (starsSet.size > 0 && !starsSet.has(r.Stars)) {
          return false;
        }

        // recruiting status
        if (statusSet.size > 0 && !statusSet.has(r.RecruitingStatus)) {
          return false;
        }

        // passed all active filters
        return true;
      });
    },
    // depend on the raw list plus the Sets
    [recruits, positionSet, archSet, regionSet, starsSet, statusSet]
  );
};

export const getAffinityList = (teamProfile: RecruitingTeamProfile) => {
  const list = [];
  if (teamProfile.AcademicsAffinity) {
    list.push("Academics");
  }
  if (teamProfile.FrontrunnerAffinity) {
    list.push("Frontrunner");
  }
  if (teamProfile.LargeCrowdsAffinity) {
    list.push("Large Crowds");
  }
  if (teamProfile.ReligionAffinity) {
    list.push("Religious School");
  }
  if (teamProfile.ServiceAffinity) {
    list.push("Service Academy");
  }
  if (teamProfile.SmallSchoolAffinity) {
    list.push("Small School");
  }
  if (teamProfile.SmallTownAffinity) {
    list.push("Small Town College");
  }
  if (teamProfile.BigCityAffinity) {
    list.push("Big City School");
  }
  if (teamProfile.MediaSpotlightAffinity) {
    list.push("Media Spotlight");
  }
  if (teamProfile.RisingStarsAffinity) {
    list.push("Rising Stars");
  }
  return list;
};

export const ValidateCloseToHome = (
  croot: { State: string | number; City: string | number },
  abbr: any
) => {
  let crootState = croot.State;

  if (crootState === "TX" || crootState === "CA" || crootState === "FL") {
    let regionalState = RegionMatcher[croot.State];
    if (regionalState && !regionalState[croot.City]) {
      // Short term fix if a city isn't on the map
      crootState = `${croot.State}(S)`;
    } else {
      crootState = RegionMatcher[croot.State][croot.City];
    }
  }

  const closeToHomeSchools = StateMatcher[crootState];

  if (closeToHomeSchools.length <= 0) {
    return false;
  }

  return closeToHomeSchools.includes(abbr);
};
