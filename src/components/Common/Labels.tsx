import { FC } from "react";
import { Text } from "../../_design/Typography";

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
