import { useMemo, useState } from "react";
import { useModal } from "../../../_hooks/useModal";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import {
  Attributes,
  Canada,
  CanadaRegionOptions,
  InfoType,
  ModalAction,
  Russia,
  RussiaRegionOptions,
  Sweden,
  SwedenRegionOptions,
  USA,
  USARegionOptions,
} from "../../../_constants/constants";
import {
  ProfessionalPlayer as PHLPlayer,
  ProCapsheet,
} from "../../../models/hockeyModels";
import { NFLPlayer } from "../../../models/footballModels";
import { NBAPlayer } from "../../../models/basketballModels";
import { usePagination } from "../../../_hooks/usePagination";
import { SingleValue } from "react-select";
import { SelectOption } from "../../../_hooks/useSelectStyles";

export const usePHLFreeAgency = () => {
  const hkStore = useSimHCKStore();
  const {
    capsheetMap,
    phlTeamMap,
    phlTeam,
    freeAgentOffers,
    waiverOffers,
    proRosterMap,
  } = hkStore;
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const [freeAgencyCategory, setFreeAgencyCategory] = useState("");
  const [tableViewType, setTableViewType] = useState<string>(Attributes);
  const [modalPlayer, setModalPlayer] = useState<
    PHLPlayer | NFLPlayer | NBAPlayer
  >({} as PHLPlayer);
  const [modalAction, setModalAction] = useState<ModalAction>(InfoType);
  const [country, setCountry] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  const [archetype, setArchetype] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const pageSize = 100;

  const FreeAgents = useMemo(() => {
    return proRosterMap[0].filter((player) => player.IsFreeAgent);
  }, [proRosterMap]);

  const WaiverPlayers = useMemo(() => {
    return proRosterMap[0].filter((player) => player.IsFreeAgent);
  }, [proRosterMap]);

  const teamCapsheet = useMemo(() => {
    if (phlTeam) {
      return capsheetMap[phlTeam.ID];
    }
    return {} as ProCapsheet;
  }, [phlTeam, capsheetMap]);

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

  const freeAgentMap = useMemo(() => {
    const rMap: any = {};
    for (let i = 0; i < FreeAgents.length; i++) {
      rMap[FreeAgents[i].ID] = FreeAgents[i];
    }
    return rMap;
  }, [FreeAgents]);

  const filteredFA = useMemo(() => {
    // Single-pass filter
    return FreeAgents.filter((fa) => {
      if (
        country.length === 0 &&
        positions.length === 0 &&
        archetype.length === 0 &&
        regions.length === 0
      ) {
        return true;
      }
      if (country.length > 0 && country.includes(fa.Country)) {
        return true;
      }
      if (positions.length > 0 && positions.includes(fa.Position)) {
        return true;
      }
      if (archetype.length > 0 && archetype.includes(fa.Archetype)) {
        return true;
      }
      if (regions.length > 0 && regions.includes(fa.State)) {
        return true;
      }
      return false;
    });
  }, [FreeAgents, country, positions, archetype, regions]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(filteredFA.length, pageSize);

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

  return {
    teamCapsheet,
    modalAction,
    setModalAction,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    freeAgencyCategory,
    setFreeAgencyCategory,
    tableViewType,
    setTableViewType,
    goToPreviousPage,
    goToNextPage,
    currentPage,
    totalPages,
    modalPlayer,
    setModalPlayer,
    SelectArchetypeOptions,
    SelectCountryOption,
    SelectPositionOptions,
    SelectRegionOptions,
    country,
    regionOptions,
    filteredFA,
    freeAgentMap,
  };
};
