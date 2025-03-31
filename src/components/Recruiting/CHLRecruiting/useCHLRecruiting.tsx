import { useMemo, useState } from "react";
import { useAuthStore } from "../../../context/AuthContext";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { useModal } from "../../../_hooks/useModal";
import {
  Attributes,
  Canada,
  CanadaRegionOptions,
  InfoType,
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
import { Croot as HockeyCroot } from "../../../models/hockeyModels";
import { Croot as FootballCroot } from "../../../models/footballModels";
import { Croot as BasketballCroot } from "../../../models/basketballModels";

export const useCHLRecruiting = () => {
  const { currentUser } = useAuthStore();
  const hkStore = useSimHCKStore();
  const { recruits, teamProfileMap, chlTeam } = hkStore;
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
  const {pageIndex, setPageIndex, PreviousPage, NextPage} = usePagination(recruits.length - 1);
  const [modalPlayer, setModalPlayer] = useState<HockeyCroot | FootballCroot | BasketballCroot>({} as HockeyCroot);
  const [modalAction, setModalAction] = useState<ModalAction>(RecruitInfoType);

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
    return recruits.slice(pageIndex, pageIndex +100).filter((r) => {
      if (country.length > 0 && !country.includes(r.Country)) {
        return false;
      }
      if (positions.length > 0 && !positions.includes(r.Position)) {
        return false;
      }
      if (archetype.length > 0 && !archetype.includes(r.Archetype)) {
        return false;
      }
      if (regions.length > 0 && !regions.includes(r.State)) {
        return false;
      }
      // Finally, recruiting status
      if (statuses.length > 0 && !statuses.includes(r.RecruitingStatus)) {
        return false;
      }
      return true;
    });
  }, [recruits, country, positions, archetype, regions, statuses, pageIndex]);

  const SelectPositionOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setPositions(options);
    setPageIndex(0);
  };

  const SelectArchetypeOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setArchetype(options);
    setPageIndex(0);
  };

  const SelectStarOptions = (opts: any) => {
    const options = [...opts.map((x: any) => Number(x.value))];
    setStars(options);
    setPageIndex(0);
  };
  const SelectCountryOption = (opts: SingleValue<SelectOption>) => {
    const value = opts?.value;
    if (value) {
      setCountry(value);
      setPageIndex(0);
    }
  };

  const SelectRegionOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setRegions(options);
    setPageIndex(0);
  };

  const SelectStatusOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setStatuses(options);
    setPageIndex(0);
  };

  const openModal = (action: ModalAction, player: HockeyCroot | FootballCroot | BasketballCroot) => {
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
    filteredRecruits,
    PreviousPage,
    NextPage,
    pageIndex,
  };
};
