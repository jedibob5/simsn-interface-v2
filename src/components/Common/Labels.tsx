import { FC } from "react";
import { Text, TextVariant } from "../../_design/Typography";
import { League } from "../../_constants/constants";
import { useDeepLink } from "../../context/DeepLinkContext";

interface TeamLabelProps {
  team: string;
  backgroundColor?: string;
  borderColor?: string;
  headerTextColorClass?: string;
  variant?: TextVariant;
}

export const TeamLabel: FC<TeamLabelProps> = ({
  team,
  backgroundColor,
  borderColor,
  headerTextColorClass,
  variant = "h4",
}) => {
  return (
    <div
      className="mb-1 rounded-md text-center"
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <Text
        variant={variant}
        className={`font-semibold rounded-md py-1 ${headerTextColorClass}`}
      >
        {team}
      </Text>
    </div>
  );
};

interface ClickableTeamLabelProps {
  label: string;
  textColorClass?: string;
  teamID: number;
  league: League;
  textVariant?: TextVariant;
}

export const ClickableTeamLabel: FC<ClickableTeamLabelProps> = ({
  label,
  teamID,
  league,
  textColorClass = "",
  textVariant = "small",
}) => {
  const { goToTeamPage } = useDeepLink();
  return (
    <Text
      variant={textVariant}
      classes={`${textColorClass} font-semibold cursor-pointer hover:text-blue-500`}
      className="pr-1"
    >
      <span onClick={() => goToTeamPage(league, teamID, {})}>{label}</span>
    </Text>
  );
};

interface ClickableGameLabelProps {
  label: string;
  textColorClass?: string;
  openModal: () => void;
  disable: boolean;
  borderColor?: string;
  variant?: TextVariant;
}

export const ClickableGameLabel: FC<ClickableGameLabelProps> = ({
  label,
  variant = "xs",
  textColorClass = "",
  openModal,
  disable,
  borderColor,
}) => {
  const open = () => {
    if (disable) return;
    openModal();
  };
  return (
    <Text
      variant={variant}
      classes={`${textColorClass} font-semibold cursor-pointer hover:text-blue-500`}
      className="pr-1"
      style={{
        textShadow: borderColor
          ? `0.5px 0.5px 0 ${borderColor}, 
                      -0.5px -0.5px 0 ${borderColor}, 
                      0.5px -0.5px 0 ${borderColor}, 
                      -0.5px 0.5px 0 ${borderColor}`
          : "",
      }}
    >
      <span onClick={open}>{label}</span>
    </Text>
  );
};
