import { FC } from "react";
import { StatsPageProps } from "../StatsPage";
import { useHockeyStats } from "./useHockeyStatsPage";
import { useTeamColors } from "../../../_hooks/useTeamColors";
import { ActionModal } from "../../Common/ActionModal";
import { Border } from "../../../_design/Borders";
import { navyBlueColor, PLAYER_VIEW, SEASON_VIEW, TEAM_VIEW, WEEK_VIEW } from "../../../_constants/constants";
import { TeamLabel } from "../../Common/Labels";
import { StatsSidebar } from "../StatsSidebar";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { useModal } from "../../../_hooks/useModal";
import { CategoryDropdown } from "../../Recruiting/Common/RecruitingCategoryDropdown";
import { useResponsive } from "../../../_hooks/useMobile";
import { ToggleSwitch } from "../../../_design/Inputs";
import { Text } from "../../../_design/Typography";

export const HockeyStatsPage: FC<StatsPageProps> = ({ league }) => {
  const {
    team,
    modalAction,
    modalPlayer,
    isModalOpen,
    playerMap,
    pagedStats,
    weekOptions,
    seasonOptions,
    teamOptions,
    conferenceOptions,
    totalPages,
    statsType,
    statsView,
    gameType,
    viewGoalieStats,
    ChangeGoalieView,
    goToPreviousPage,
    goToNextPage,
    handleCloseModal,
    ChangeStatsType,
    ChangeGameType,
    ChangeStatsView,
    handlePlayerModal,
    SelectConferenceOptions,
    SelectTeamOptions,
    SelectWeekOption,
    SelectSeasonOption,
    Search,
    Export,
  } = useHockeyStats();
  const {isMobile} = useResponsive();
  const helpModal = useModal();
  const teamColors = useTeamColors(team?.ColorOne, team?.ColorTwo, team?.ColorThree);
  return (
    <>
      {modalPlayer && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          playerID={modalPlayer.ID}
          playerLabel={`${modalPlayer.Position} ${modalPlayer.Archetype} ${modalPlayer.FirstName} ${modalPlayer.LastName}`}
          league={league}
          teamID={modalPlayer.PreviousTeamID}
          modalAction={modalAction}
          player={modalPlayer}
        />
      )}
      <div className="grid grid-flow-row grid-auto-rows-auto w-full h-full max-[1024px]:grid-cols-1 max-[1024px]:gap-y-2 grid-cols-[2fr_10fr] max-[1024px]:gap-x-1 gap-x-2 mb-2">
        <StatsSidebar 
          team={team!!}
          teamColors={teamColors} 
          league={league} 
          statsView={statsView}
          statsType={statsType}
          ChangeStatsView={ChangeStatsView}
          ChangeStatsType={ChangeStatsType}
          HandleHelpModal={helpModal.handleOpenModal}
          weekOptions={weekOptions}
          seasonOptions={seasonOptions}
          SelectWeekOption={SelectWeekOption}
          SelectSeasonOption={SelectSeasonOption}
          Search={Search}
          Export={Export}
        />
        <div className="flex flex-col w-full max-[1024px]:gap-y-2">
          <div className="flex flex-col sm:flex-row gap-x-2">
            <Border
              direction="row"
              classes="w-full max-[1024px]:px-2 max-[1024px]:pb-4 p-4 items-center justify-start gap-x-8"
              styles={{
                borderColor: teamColors.One,
                backgroundColor: navyBlueColor,
              }}
            >
              <div className="flex flex-col">
                <Text variant="h4">Goalie Stats</Text>
                <ToggleSwitch
                  checked={viewGoalieStats}
                  onChange={ChangeGoalieView}
                />
              </div>
              <CategoryDropdown
                label="Teams"
                options={teamOptions}
                change={SelectTeamOptions}
                isMulti={true}
                isMobile={isMobile}
              />
              <CategoryDropdown
                  label="Conferences"
                  options={conferenceOptions}
                  change={SelectConferenceOptions}
                  isMulti={true}
                  isMobile={isMobile}
              />
            </Border>
          </div>
          <div className="flex flex-col">
            
          </div>
        </div>
      </div>
    </>
  );
};
