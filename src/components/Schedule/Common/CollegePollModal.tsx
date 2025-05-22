import { FC } from "react";
import { League } from "../../../_constants/constants";

interface CollegePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  teamMap?: any;
  standingsMap?: any;
  officialPolls?: any[];
  timestamp: any;
}

export const CollegePollModal: FC<CollegePollModalProps> = ({}) => {
  return <></>;
};
