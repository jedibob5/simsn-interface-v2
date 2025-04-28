import { FC } from "react";
import { League, ModalAction, StatsView } from "../../../_constants/constants";
import { CollegePlayer, ProfessionalPlayer } from "../../../models/hockeyModels";


interface HockeyStatsTableProps {
    teamColors: any;
    teamMap: any;
    team: any;
    playerMap: any;
    league: League;
    isMobile?: boolean;
    openModal: (
    action: ModalAction,
    player: CollegePlayer | ProfessionalPlayer
    ) => void;
    stats: any[];
}

export const HockeyStatsTable: FC<HockeyStatsTableProps> = ({}) => {

    return <></>;
}