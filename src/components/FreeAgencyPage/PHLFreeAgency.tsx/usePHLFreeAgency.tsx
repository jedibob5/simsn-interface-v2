import { useMemo, useState } from "react";
import { useModal } from "../../../_hooks/useModal";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import {
  Affiliate,
  Attributes,
  Canada,
  CanadaRegionOptions,
  FreeAgent,
  FreeAgentOffer,
  InfoType,
  ModalAction,
  OfferAction,
  Overview,
  Russia,
  RussiaRegionOptions,
  Sweden,
  SwedenRegionOptions,
  USA,
  USARegionOptions,
  Waivers,
} from "../../../_constants/constants";
import {
  FreeAgencyOffer,
  ProfessionalPlayer as PHLPlayer,
  ProCapsheet,
  ProfessionalPlayer,
  WaiverOffer,
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
    affiliatePlayers,
  } = hkStore;
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const [freeAgencyCategory, setFreeAgencyCategory] = useState(Overview);
  const [playerType, setPlayerType] = useState<string>(FreeAgent);
  const [tableViewType, setTableViewType] = useState<string>(Attributes);
  const [modalPlayer, setModalPlayer] = useState<
    PHLPlayer | NFLPlayer | NBAPlayer
  >({} as PHLPlayer);
  const [modalAction, setModalAction] = useState<ModalAction>(InfoType);
  const [offerAction, setOfferAction] = useState<OfferAction>(FreeAgentOffer);
  const [country, setCountry] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  const [archetype, setArchetype] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const pageSize = 100;

  const freeAgents = useMemo(() => {
    return proRosterMap[0].filter((player) => player.IsFreeAgent);
  }, [proRosterMap]);

  const freeAgentMap = useMemo(() => {
    const dict: Record<number, ProfessionalPlayer> = {};
    for (let i = 0; i < freeAgents.length; i++) {
      dict[freeAgents[i].ID] = freeAgents[i];
    }
  }, [freeAgents]);

  const waiverPlayers = useMemo(() => {
    return proRosterMap[0].filter((player) => player.IsWaived);
  }, [proRosterMap]);

  const waiverPlayerMap = useMemo(() => {
    const dict: Record<number, ProfessionalPlayer> = {};
    for (let i = 0; i < waiverPlayers.length; i++) {
      dict[waiverPlayers[i].ID] = waiverPlayers[i];
    }
  }, [waiverPlayers]);

  const teamFreeAgentOffers = useMemo(() => {
    if (!phlTeam) return [];
    return freeAgentOffers.filter((x) => x.TeamID === phlTeam.ID);
  }, [phlTeam, freeAgentOffers]);

  const teamWaiverOffers = useMemo(() => {
    if (!phlTeam) return [];
    return waiverOffers.filter((x) => x.TeamID === phlTeam.ID);
  }, [phlTeam, waiverOffers]);

  const freeAgentOfferMapByPlayer = useMemo(() => {
    const dict: Record<number, FreeAgencyOffer[]> = {};
    for (let i = 0; i < freeAgentOffers.length; i) {
      const offer = freeAgentOffers[i];
      if (dict[offer.PlayerID].length > 0) {
        dict[offer.PlayerID].push(offer);
      } else {
        dict[offer.PlayerID] = [offer];
      }
    }
    return dict;
  }, [freeAgentOffers]);

  const waiverOfferMapByPlayer = useMemo(() => {
    const dict: Record<number, WaiverOffer[]> = {};
    for (let i = 0; i < waiverOffers.length; i) {
      const offer = waiverOffers[i];
      if (dict[offer.PlayerID].length > 0) {
        dict[offer.PlayerID].push(offer);
      } else {
        dict[offer.PlayerID] = [offer];
      }
    }
    return dict;
  }, [waiverOffers]);

  const teamFreeAgentOfferMap = useMemo(() => {
    const dict: Record<number, FreeAgencyOffer> = {};
    for (let i = 0; i < freeAgentOffers.length; i) {
      const offer = freeAgentOffers[i];
      dict[offer.PlayerID] = offer;
    }
    return dict;
  }, [teamFreeAgentOffers]);

  const teamWaiverOfferMap = useMemo(() => {
    const dict: Record<number, WaiverOffer> = {};
    for (let i = 0; i < waiverOffers.length; i) {
      const offer = waiverOffers[i];
      dict[offer.PlayerID] = offer;
    }
    return dict;
  }, [teamWaiverOffers]);

  const offerMapByPlayerType = useMemo(() => {
    if (playerType === Waivers) {
      return waiverOfferMapByPlayer;
    }
    return freeAgentOfferMapByPlayer;
  }, [freeAgentOfferMapByPlayer, waiverOfferMapByPlayer, playerType]);

  const teamOfferMap = useMemo(() => {
    if (playerType === Waivers) {
      return teamWaiverOfferMap;
    }
    return teamFreeAgentOfferMap;
  }, [teamFreeAgentOfferMap, teamWaiverOfferMap, playerType]);

  const teamCapsheet = useMemo(() => {
    if (phlTeam) {
      return capsheetMap[phlTeam.ID];
    }
    return {} as ProCapsheet;
  }, [phlTeam, capsheetMap]);

  const adjustedTeamCapsheet = useMemo(() => {
    if (teamFreeAgentOffers.length === 0) {
      return teamCapsheet;
    }
    const adjCapsheet = { ...teamCapsheet } as ProCapsheet;
    for (let i = 0; i < teamFreeAgentOffers.length; i++) {
      adjCapsheet.Y1Salary += teamFreeAgentOffers[i].ContractValue;
      adjCapsheet.Y2Salary += teamFreeAgentOffers[i].ContractValue;
      adjCapsheet.Y3Salary += teamFreeAgentOffers[i].ContractValue;
      adjCapsheet.Y4Salary += teamFreeAgentOffers[i].ContractValue;
      adjCapsheet.Y5Salary += teamFreeAgentOffers[i].ContractValue;
    }
    adjCapsheet.UpdatedAt = new Date();
    return adjCapsheet;
  }, [teamCapsheet, teamFreeAgentOffers]);

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

  const filteredFA = useMemo(() => {
    // Single-pass filter
    let players = [...freeAgents];
    if (playerType === Waivers) {
      players = [...waiverPlayers];
    } else if (playerType === Affiliate) {
      players = [...affiliatePlayers];
    }
    return players.filter((fa) => {
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
  }, [
    freeAgents,
    waiverPlayers,
    affiliatePlayers,
    playerType,
    country,
    positions,
    archetype,
    regions,
  ]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(filteredFA.length, pageSize);

  const pagedFreeAgents = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredFA.slice(start, start + pageSize);
  }, [filteredFA, currentPage, pageSize]);

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
    const value = opts!.value;
    setCountry(value);
    setCurrentPage(0);
  };

  const SelectRegionOptions = (opts: any) => {
    const options = [...opts.map((x: any) => x.value)];
    setRegions(options);
    setCurrentPage(0);
  };

  const handleFAModal = (
    action: ModalAction,
    player: ProfessionalPlayer | NFLPlayer | NBAPlayer
  ) => {
    setModalPlayer(player);
    setModalAction(action);
    handleOpenModal();
  };

  const offerModal = useModal();

  const handleOfferModal = (
    action: OfferAction,
    player: ProfessionalPlayer | NFLPlayer | NBAPlayer
  ) => {
    setOfferAction(action);
    setModalPlayer(player);
    offerModal.handleOpenModal();
  };

  return {
    teamCapsheet,
    adjustedTeamCapsheet,
    modalAction,
    isModalOpen,
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
    handleFAModal,
    SelectArchetypeOptions,
    SelectCountryOption,
    SelectPositionOptions,
    SelectRegionOptions,
    country,
    regionOptions,
    pagedFreeAgents,
    freeAgentMap,
    waiverPlayerMap,
    teamFreeAgentOffers,
    teamWaiverOffers,
    offerMapByPlayerType,
    teamOfferMap,
    playerType,
    setPlayerType,
    offerAction,
    offerModal,
    handleOfferModal,
  };
};
