import { FC } from "react";
import { StatsPageProps } from "../StatsPage";
import { useHockeyStats } from "./useHockeyStatsPage";

export const HockeyStatsPage: FC<StatsPageProps> = ({ league }) => {
  const {} = useHockeyStats();
  return <></>;
};
