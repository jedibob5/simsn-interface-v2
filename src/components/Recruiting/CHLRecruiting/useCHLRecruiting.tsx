import { useMemo, useState } from "react";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { useModal } from "../../../_hooks/useModal";
import {
  Attributes,
  Canada,
  CanadaRegionOptions,
  ModalAction,
  RecruitInfoType,
  RecruitingCategory,
  RecruitingOverview,
  Russia,
  RussiaRegionOptions,
  Sweden,
  SwedenRegionOptions,
  USA,
  USARegionOptions,
} from "../../../_constants/constants";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";
import { usePagination } from "../../../_hooks/usePagination";
import {
  Croot as HockeyCroot,
  RecruitingTeamProfile,
} from "../../../models/hockeyModels";
import { Croot as FootballCroot } from "../../../models/footballModels";
import { Croot as BasketballCroot } from "../../../models/basketballModels";

export const useCHLRecruiting = () => {
  const hkStore = useSimHCKStore();
  const {
    recruits,
    teamProfileMap,
    chlTeam,
    recruitProfiles,
    chlTeams,
    chlTeamMap,
    hck_Timestamp,
  } = hkStore;
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const [recruitingCategory, setRecruitingCategory] =
    useState<RecruitingCategory>(RecruitingOverview);
  const [tableViewType, setTableViewType] = useState<string>(Attributes);
  const [country, setCountry] = useState<string>("");
  const [stars, setStars] = useState<number[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [archetype, setArchetype] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
  const [conferences, setConferences] = useState<any[]>([]);
  const [attribute, setAttribute] = useState<string>("");
  const [modalPlayer, setModalPlayer] = useState<
    HockeyCroot | FootballCroot | BasketballCroot
  >({} as HockeyCroot);
  const [modalAction, setModalAction] = useState<ModalAction>(RecruitInfoType);

  const recruitingLocked = useMemo(() => {
    if (hck_Timestamp) {
      return hck_Timestamp.IsRecruitingLocked;
    }
    return false;
  }, [hck_Timestamp]);

  const recruitOnBoardMap = useMemo(() => {
    const boardMap: Record<number, boolean> = {};
    recruitProfiles.forEach((profile) => {
      boardMap[profile.RecruitID] = true;
    });
    return boardMap;
  }, [recruitProfiles]);

  const regionOptions = useMemo(() => {
    if (country === USA) {
      return USARegionOptions;
    }
    if (country === Canada) {
      return CanadaRegionOptions;
    }
    if (country === Sweden) {
      return SwedenRegionOptions;
    }
    if (country === Russia) {
      return RussiaRegionOptions;
    }
    return [];
  }, [country]);

  const teamProfile = useMemo(() => {
    if (chlTeam && teamProfileMap) {
      return teamProfileMap[Number(chlTeam.ID)];
    }
    return null;
  }, [chlTeam, teamProfileMap]);

  const recruitMap = useMemo(() => {
    const rMap: any = {};
    for (let i = 0; i < recruits.length; i++) {
      rMap[recruits[i].ID] = recruits[i];
    }
    return rMap;
  }, [recruits]);

  const filteredRecruits = useMemo(() => {
    // Single-pass filter
    return recruits.filter((r) => {
      if (
        country.length === 0 &&
        positions.length === 0 &&
        archetype.length === 0 &&
        regions.length === 0 &&
        statuses.length === 0 &&
        stars.length === 0
      ) {
        return true;
      }
      if (country.length > 0 && country.includes(r.Country)) {
        return true;
      }
      if (positions.length > 0 && positions.includes(r.Position)) {
        return true;
      }
      if (archetype.length > 0 && archetype.includes(r.Archetype)) {
        return true;
      }
      if (regions.length > 0 && regions.includes(r.State)) {
        return true;
      }
      if (stars.length > 0 && stars.includes(r.Stars)) {
        return true;
      }
      // Finally, recruiting status
      if (statuses.length > 0 && statuses.includes(r.RecruitingStatus)) {
        return true;
      }
      return false;
    });
  }, [recruits, country, positions, stars, archetype, regions, statuses]);

  const pageSize = 100;

  const teamRankList = useMemo(() => {
    const teamsList = [...chlTeams];
    let profileList: RecruitingTeamProfile[] = [];
    teamsList.forEach((team) => {
      profileList.push(teamProfileMap[team.ID]);
    });
    return profileList
      .sort((a, b) => a.CompositeScore - b.CompositeScore)
      .filter((team) => {
        if (conferences.length === 0 && selectedTeams.length === 0) {
          return true;
        }
        if (
          conferences.length > 0 &&
          conferences.includes(chlTeamMap[team.ID].ConferenceID)
        ) {
          return true;
        }
        if (
          selectedTeams.length > 0 &&
          selectedTeams.includes(chlTeamMap[team.ID].ID)
        ) {
          return true;
        }
        return false;
      });
  }, [conferences, selectedTeams, chlTeams, chlTeamMap, teamProfileMap]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(filteredRecruits.length, pageSize);

  const pagedRecruits = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredRecruits.slice(start, start + pageSize);
  }, [filteredRecruits, currentPage, pageSize]);

  const SelectPositionOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setPositions(options);
    setCurrentPage(0);
  };

  const SelectArchetypeOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setArchetype(options);
    setCurrentPage(0);
  };

  const SelectStarOptions = (opts: any) => {
    const options = [...opts.map((x: any) => Number(x.value))];
    setStars(options);
    setCurrentPage(0);
  };
  const SelectCountryOption = (opts: SingleValue<SelectOption>) => {
    const value = opts?.value;
    if (value) {
      setCountry(value);
      setCurrentPage(0);
    }
  };

  const SelectRegionOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setRegions(options);
    setCurrentPage(0);
  };

  const SelectStatusOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setStatuses(options);
    setCurrentPage(0);
  };

  const SelectConferences = (options: any) => {
    const opts = [...options.map((x: any) => Number(x.value))];
    setConferences(() => opts);
  };

  const SelectTeams = (options: any) => {
    const opts = [...options.map((x: any) => Number(x.value))];
    setSelectedTeams(() => opts);
  };

  const openModal = (
    action: ModalAction,
    player: HockeyCroot | FootballCroot | BasketballCroot
  ) => {
    handleOpenModal();
    setModalAction(action);
    setModalPlayer(player);
  };

  return {
    teamProfile,
    recruitMap,
    recruitingCategory,
    setRecruitingCategory,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    openModal,
    modalAction,
    modalPlayer,
    regionOptions,
    SelectArchetypeOptions,
    SelectCountryOption,
    SelectPositionOptions,
    SelectRegionOptions,
    country,
    SelectStarOptions,
    SelectStatusOptions,
    tableViewType,
    setTableViewType,
    goToPreviousPage,
    goToNextPage,
    currentPage,
    totalPages,
    pagedRecruits,
    recruitOnBoardMap,
    teamRankList,
    SelectConferences,
    SelectTeams,
    attribute,
    setAttribute,
    recruitingLocked,
  };
};
