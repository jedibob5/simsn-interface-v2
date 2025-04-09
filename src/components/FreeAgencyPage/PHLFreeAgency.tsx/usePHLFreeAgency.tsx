import { useMemo, useState } from "react";
import { useModal } from "../../../_hooks/useModal";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import {
  Attributes,
  InfoType,
  ModalAction,
} from "../../../_constants/constants";
import {
  ProfessionalPlayer as PHLPlayer,
  ProCapsheet,
} from "../../../models/hockeyModels";
import { NFLPlayer } from "../../../models/footballModels";
import { NBAPlayer } from "../../../models/basketballModels";

export const usePHLFreeAgency = () => {
  const hkStore = useSimHCKStore();
  const { capsheetMap, phlTeamMap, phlTeam } = hkStore;
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const [freeAgencyCategory, setFreeAgencyCategory] = useState("");
  const [tableViewType, setTableViewType] = useState<string>(Attributes);
  const [modalPlayer, setModalPlayer] = useState<
    PHLPlayer | NFLPlayer | NBAPlayer
  >({} as PHLPlayer);
  const [modalAction, setModalAction] = useState<ModalAction>(InfoType);

  const teamCapsheet = useMemo(() => {
    if (phlTeam) {
      return capsheetMap[phlTeam.ID];
    }
    return {} as ProCapsheet;
  }, [phlTeam, capsheetMap]);

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
    modalPlayer,
    setModalPlayer,
  };
};
