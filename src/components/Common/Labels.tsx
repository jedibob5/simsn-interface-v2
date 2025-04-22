import { FC } from "react";
import { Text } from "../../_design/Typography";
import { League } from "../../_constants/constants";
import { useDeepLink } from "../../context/DeepLinkContext";

interface TeamLabelProps {
  team: string;
  backgroundColor?: string;
  borderColor?: string;
  headerTextColorClass?: string;
}

export const TeamLabel: FC<TeamLabelProps> = ({
  team,
  backgroundColor,
  borderColor,
  headerTextColorClass,
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
        variant="h4"
        className={`font-semibold rounded-md py-1 ${headerTextColorClass}`}
      >
        {team}
      </Text>
    </div>
  );
};

interface ClickableTeamLabelProps {
  label: string;
  textColorClass: string;
  teamID: number;
  league: League;
}

export const ClickableTeamLabel: FC<ClickableTeamLabelProps> =({label, teamID, league, textColorClass}) => {
  const { goToTeamPage } = useDeepLink();
  return <Text
  variant="small"
  classes={`${textColorClass} font-semibold cursor-pointer`}
  className="pr-1">
  <span onClick={() => goToTeamPage(league, teamID, {})}>{label}</span>
</Text>
}