import { FC, useMemo, useState } from "react";
import { League, SimCBB, SimCFB, SimCHL } from "../../../_constants/constants";
import { Modal } from "../../../_design/Modal";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import {
  RecruitingTeamProfile as HockeyTeamProfile,
  UpdateRecruitingBoardDTO as HockeyUpdateBoardDto,
} from "../../../models/hockeyModels";
import {
  RecruitingTeamProfile as FootballTeamProfile,
  UpdateRecruitingBoardDTO,
} from "../../../models/footballModels";
import { Input, ToggleSwitch } from "../../../_design/Inputs";

interface RecruitAISettingsProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  teamProfile: HockeyTeamProfile | FootballTeamProfile | null;
  SaveSettings: (dto: any) => Promise<void>;
}

export const RecruitingAISettingsModal: FC<RecruitAISettingsProps> = ({
  isOpen,
  onClose,
  league,
  teamProfile,
  SaveSettings,
}) => {
  const [configBoard, setConfigBoard] = useState<
    HockeyTeamProfile | FootballTeamProfile
  >(teamProfile!!);

  const ChangeNumericInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let numericValue = Number(value);
    if (isNaN(numericValue)) return;
    if (numericValue < 0) {
      numericValue = 0;
    }
    let rp = { ...configBoard };
    rp[name] = numericValue;
    if (league === SimCHL) {
      setConfigBoard(rp as HockeyTeamProfile);
    } else if (league === SimCFB) {
      setConfigBoard(rp as FootballTeamProfile);
    }
  };
  const HandleAIToggle = () => {
    let rp = { ...configBoard };
    rp.IsAI = !rp.IsAI;
    if (league === SimCHL) {
      setConfigBoard(rp as HockeyTeamProfile);
    } else if (league === SimCFB) {
      setConfigBoard(rp as FootballTeamProfile);
    }
  };
  const isValid = useMemo(() => {
    if (configBoard.AIMaxThreshold > 20) {
      return false;
    }
    if (configBoard.AIMinThreshold < 0) {
      return false;
    }
    const thresholdDiff = Math.abs(
      configBoard.AIMaxThreshold - configBoard.AIMinThreshold
    );
    if (thresholdDiff < 5) return false;
    if (configBoard.AIStarMax > 20) {
      return false;
    }
    if (configBoard.AIStarMin < 0) {
      return false;
    }
    const starDiff = Math.abs(configBoard.AIStarMax - configBoard.AIStarMin);
    if (starDiff < 2) return false;

    return true;
  }, [configBoard]);
  const confirm = async () => {
    const dto = {
      Profile: configBoard,
    };
    onClose();
    return await SaveSettings(dto as HockeyUpdateBoardDto);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="AI Settings"
        actions={
          <>
            <ButtonGroup>
              <Button size="sm" variant="primary" onClick={onClose}>
                <Text variant="small">Close</Text>
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={confirm}
                disabled={!isValid}
              >
                <Text variant="small">Confirm</Text>
              </Button>
            </ButtonGroup>
          </>
        }
      >
        {league === SimCHL && (
          <>
            <div className="flex flex-row mb-2 gap-x-2">
              <Text>AI Toggle</Text>
              <ToggleSwitch
                checked={configBoard.IsAI}
                onChange={HandleAIToggle}
              />
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-y-2 w-[12rem]">
                <Input
                  label="AI Star Min"
                  classes="ml-2"
                  name="AIStarMin"
                  value={configBoard.AIStarMin}
                  onChange={ChangeNumericInput}
                />
                <Input
                  label="AI Star Max"
                  classes="ml-2"
                  name="AIStarMax"
                  value={configBoard.AIStarMax}
                  onChange={ChangeNumericInput}
                />
              </div>
              <div className="flex flex-col gap-y-2 w-[12rem]">
                <Input
                  label="AI Points Min"
                  classes="ml-2"
                  name="AIMinThreshold"
                  value={configBoard.AIMinThreshold}
                  onChange={ChangeNumericInput}
                />
                <Input
                  label="AI Points Max"
                  classes="ml-2"
                  name="AIMaxThreshold"
                  value={configBoard.AIMaxThreshold}
                  onChange={ChangeNumericInput}
                />
              </div>
            </div>
          </>
        )}
        {league === SimCFB && <></>}
        {league === SimCBB && <></>}
      </Modal>
    </>
  );
};
