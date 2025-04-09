import {
  Attributes,
  Contracts,
  Overview,
  Preferences,
  SimPHL,
} from "../../../_constants/constants";
import { Border } from "../../../_design/Borders";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { useLoadMessage } from "../../../_hooks/useLoadMessage";
import { useMobile } from "../../../_hooks/useMobile";
import { useModal } from "../../../_hooks/useModal";
import { useTeamColors } from "../../../_hooks/useTeamColors";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { Timestamp } from "../../../models/hockeyModels";
import { FreeAgencySidebar } from "../Common/FreeAgencySidebar";
import { usePHLFreeAgency } from "./usePHLFreeAgency";

export const PHLFreeAgency = () => {
  const hkStore = useSimHCKStore();
  const { freeAgency, phlTeam, hck_Timestamp } = hkStore;
  const {
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
    teamCapsheet,
  } = usePHLFreeAgency();
  const [isMobile] = useMobile();
  const teamColors = useTeamColors(
    phlTeam?.ColorOne,
    phlTeam?.ColorTwo,
    phlTeam?.ColorThree
  );
  const helpModal = useModal();
  const aiSettingsModal = useModal();
  const lockMessage = useLoadMessage([], 5000);

  return (
    <>
      <div className="grid grid-flow-row grid-auto-rows-auto w-full h-full max-[1024px]:grid-cols-1 max-[1024px]:gap-y-2 grid-cols-[2fr_10fr] max-[1024px]:gap-x-1 gap-x-2 mb-2">
        <FreeAgencySidebar
          Capsheet={teamCapsheet}
          Team={phlTeam!!}
          teamColors={teamColors}
          league={SimPHL}
          ts={hck_Timestamp as Timestamp}
        />
        <div className="flex flex-col sm:flex-row gap-x-2">
          <Border
            direction="row"
            classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 p-4 items-center justify-center gap-x-2"
            styles={{
              backgroundColor: teamColors.One,
              borderColor: teamColors.Two,
            }}
          >
            <ButtonGroup classes="sm:flex sm:flex-auto sm:flex-1">
              <Button
                type="button"
                variant={
                  freeAgencyCategory === Overview ? "success" : "secondary"
                }
                onClick={() => setFreeAgencyCategory(Overview)}
              >
                Overview
              </Button>
              <Button
                type="button"
                variant={
                  freeAgencyCategory === Contracts ? "success" : "secondary"
                }
                onClick={() => setFreeAgencyCategory(Contracts)}
              >
                Contracts
              </Button>
            </ButtonGroup>
            <ButtonGroup classes="sm:flex sm:flex-auto sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant={tableViewType === Attributes ? "success" : "secondary"}
                onClick={() => setTableViewType(Attributes)}
              >
                Attributes
              </Button>
              <Button
                type="button"
                variant={
                  tableViewType === Preferences ? "success" : "secondary"
                }
                onClick={() => setTableViewType(Preferences)}
              >
                Preferences
              </Button>
            </ButtonGroup>
          </Border>
          <Border
            direction="col"
            classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 p-4 items-center justify-center gap-x-8"
            styles={{
              backgroundColor: teamColors.One,
              borderColor: teamColors.Two,
            }}
          >
            <div className="sm:grid sm:grid-cols-2 w-full">
              <ButtonGroup classes="flex flex-row w-full justify-center sm:justify-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={helpModal.handleOpenModal}
                >
                  Help
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={aiSettingsModal.handleOpenModal}
                >
                  Settings
                </Button>
              </ButtonGroup>
            </div>
          </Border>
        </div>
      </div>
    </>
  );
};
