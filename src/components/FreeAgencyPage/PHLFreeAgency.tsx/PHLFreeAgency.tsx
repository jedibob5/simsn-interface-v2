import {
  Affiliate,
  Attributes,
  Contracts,
  CountryOptions,
  FreeAgent,
  HockeyArchetypeOptions,
  HockeyPositionOptions,
  International,
  Overview,
  Preferences,
  SimPHL,
  Waivers,
} from "../../../_constants/constants";
import { Border } from "../../../_design/Borders";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import { useLoadMessage } from "../../../_hooks/useLoadMessage";
import { useMobile } from "../../../_hooks/useMobile";
import { useModal } from "../../../_hooks/useModal";
import { useTeamColors } from "../../../_hooks/useTeamColors";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { Timestamp } from "../../../models/hockeyModels";
import { CategoryDropdown } from "../../Recruiting/Common/RecruitingCategoryDropdown";
import { FreeAgencySidebar } from "../Common/FreeAgencySidebar";
import { FreeAgentTable } from "../Common/FreeAgencyTable";
import { usePHLFreeAgency } from "./usePHLFreeAgency";

export const PHLFreeAgency = () => {
  const hkStore = useSimHCKStore();
  const { phlTeam, hck_Timestamp, phlTeamMap } = hkStore;
  const {
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
    pagedFreeAgents,
    freeAgentMap,
    waiverPlayerMap,
    teamFreeAgentOffers,
    teamWaiverOffers,
    offerMapByPlayerType,
    teamOfferMap,
    playerType,
    setPlayerType,
  } = usePHLFreeAgency();
  const [isMobile] = useMobile();
  const teamColors = useTeamColors(
    phlTeam?.ColorOne,
    phlTeam?.ColorTwo,
    phlTeam?.ColorThree
  );
  const helpModal = useModal();
  const aiSettingsModal = useModal();

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
        <div className="flex flex-col w-full max-[1024px]:gap-y-2">
          <div className="flex flex-col sm:flex-row gap-x-2">
            <Border
              direction="row"
              classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 p-4 items-center justify-center gap-x-2"
              styles={{
                borderColor: teamColors.One,
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
              {freeAgencyCategory === Overview && (
                <ButtonGroup classes="sm:flex sm:flex-auto sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant={playerType === FreeAgent ? "success" : "secondary"}
                    onClick={() => setPlayerType(FreeAgent)}
                  >
                    Free Agents
                  </Button>
                  <Button
                    type="button"
                    variant={playerType === Waivers ? "success" : "secondary"}
                    onClick={() => setPlayerType(Waivers)}
                  >
                    Waivers
                  </Button>
                  <Button
                    type="button"
                    variant={playerType === Affiliate ? "success" : "secondary"}
                    onClick={() => setPlayerType(Affiliate)}
                  >
                    Affiliate
                  </Button>
                  {/* <Button
                    type="button"
                    variant={
                      playerType === International ? "success" : "secondary"
                    }
                    onClick={() => setPlayerType(International)}
                  >
                    International
                  </Button> */}
                </ButtonGroup>
              )}
              <ButtonGroup classes="sm:flex sm:flex-auto sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant={
                    tableViewType === Attributes ? "success" : "secondary"
                  }
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
            </Border>
          </div>
          <Border
            direction="row"
            classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 p-4 items-center justify-center"
            styles={{
              borderColor: teamColors.One,
            }}
          >
            <div className="flex flex-row flex-wrap gap-x-1 sm:gap-x-2 gap-y-2 px-2 w-full">
              <CategoryDropdown
                label="Positions"
                options={HockeyPositionOptions}
                change={SelectPositionOptions}
                isMulti={true}
                isMobile={isMobile}
              />
              <CategoryDropdown
                label="Archetype"
                options={HockeyArchetypeOptions}
                change={SelectArchetypeOptions}
                isMulti={true}
                isMobile={isMobile}
              />
              <CategoryDropdown
                label="Country"
                options={CountryOptions}
                change={SelectCountryOption}
                isMulti={false}
                isMobile={isMobile}
              />
              {regionOptions.length > 0 && (
                <CategoryDropdown
                  label="Region"
                  options={regionOptions}
                  change={SelectRegionOptions}
                  isMulti={true}
                  isMobile={isMobile}
                />
              )}
            </div>
          </Border>
          {freeAgencyCategory === Overview && (
            <Border
              direction="col"
              classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 p-4 max-h-[50vh] overflow-y-auto"
              styles={{
                borderColor: teamColors.One,
              }}
            >
              <FreeAgentTable
                players={pagedFreeAgents}
                offersByPlayer={offerMapByPlayerType}
                teamOfferMap={teamOfferMap}
                colorOne={teamColors.One}
                colorTwo={teamColors.Two}
                colorThree={teamColors.Three}
                team={phlTeam!!}
                category={tableViewType}
                league={SimPHL}
                teamMap={phlTeamMap}
                openModal={handleOpenModal}
                isMobile={isMobile}
              />
              <div className="flex flex-row justify-center py-2">
                <ButtonGroup>
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                  >
                    Prev
                  </Button>
                  <Text variant="body-small" classes="flex items-center">
                    {currentPage + 1}
                  </Text>
                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </div>
            </Border>
          )}
        </div>
      </div>
    </>
  );
};
