import { useMemo, useState } from "react";
import { useModal } from "../../../_hooks/useModal";
import { useSimFBAStore } from "../../../context/SimFBAContext";
import {
  Attributes,
  ModalAction,
  Overview,
  RecruitInfoType,
  RecruitingCategory,
} from "../../../_constants/constants";
import { Croot as FootballCroot } from "../../../models/footballModels";
import { Croot as BasketballCroot } from "../../../models/basketballModels";
import { Croot as HockeyCroot } from "../../../models/hockeyModels";
export const useCFBRecruiting = () => {
  const fbStore = useSimFBAStore();
  const {
    recruits,
    teamProfileMap,
    cfbTeam,
    cfbTeams,
    cfbTeamMap,
    recruitProfiles,
    cfb_Timestamp,
  } = fbStore;
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const [recruitingCategory, setRecruitingCategory] =
    useState<RecruitingCategory>(Overview);
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
    if (cfb_Timestamp) {
      return cfb_Timestamp.IsRecruitingLocked;
    }
    return false;
  }, [cfb_Timestamp]);
};
