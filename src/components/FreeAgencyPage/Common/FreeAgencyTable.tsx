import { FC, ReactNode, useMemo } from "react";
import {
  FreeAgencyOffer as PHLFreeAgencyOffer,
  ProfessionalPlayer as PHLPlayer,
  WaiverOffer as PHLWaiverOffer,
} from "../../../models/hockeyModels";
import { NFLPlayer } from "../../../models/footballModels";
import { NBAPlayer } from "../../../models/basketballModels";
import {
  AddFreeAgentType,
  Attributes,
  InfoType,
  League,
  ModalAction,
  SimPHL,
} from "../../../_constants/constants";
import { Table, TableCell } from "../../../_design/Table";
import { Text } from "../../../_design/Typography";
import { getPHLAttributes } from "../../Team/TeamPageUtils";
import { Button } from "../../../_design/Buttons";
import { ActionLock, Plus } from "../../../_design/Icons";

interface FreeAgentTableProps {
  players: PHLPlayer[] | NFLPlayer[] | NBAPlayer[];
  offersByPlayer:
    | Record<number, PHLWaiverOffer[]>
    | Record<number, PHLFreeAgencyOffer[]>;
  teamOfferMap:
    | Record<number, PHLWaiverOffer>
    | Record<number, PHLFreeAgencyOffer>;
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  teamMap: any;
  team: any;
  category: string;
  openModal: (
    action: ModalAction,
    player: PHLPlayer | NFLPlayer | NBAPlayer
  ) => void;
  league: League;
  isMobile?: boolean;
}

export const FreeAgentTable: FC<FreeAgentTableProps> = ({
  players,
  colorOne,
  teamMap,
  teamOfferMap,
  offersByPlayer,
  team,
  category,
  openModal,
  league,
  isMobile = false,
}) => {
  const backgroundColor = colorOne;
  const rosterColumns = useMemo(() => {
    let columns = [
      { header: "Name", accessor: "LastName" },
      { header: "Pos", accessor: "Position" },
      { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
      { header: "Exp", accessor: "Year" },
      { header: "Ovr", accessor: "Overall" },
    ];

    if (!isMobile && category === Attributes) {
      columns = columns.concat([
        { header: "Agi", accessor: "Agility" },
        { header: "FO", accessor: "Faceoffs" },
        { header: "LSA", accessor: "LongShotAccuracy" },
        { header: "LSP", accessor: "LongShotPower" },
        { header: "CSA", accessor: "CloseShotAccuracy" },
        { header: "CSP", accessor: "CloseShotPower" },
        { header: "Pass", accessor: "Passing" },
        { header: "PH", accessor: "PuckHandling" },
        { header: "Str", accessor: "Strength" },
        { header: "BChk", accessor: "BodyChecking" },
        { header: "SChk", accessor: "StickChecking" },
        { header: "SB", accessor: "ShotBlocking" },
        { header: "GK", accessor: "Goalkeeping" },
        { header: "GV", accessor: "GoalieVision" },
        { header: "Sta", accessor: "Stamina" },
        { header: "Inj", accessor: "Injury" },
      ]);
    }

    columns.push({ header: "Min. Value", accessor: "minimum value" });
    columns.push({ header: "Interest", accessor: "LeadingTeams" });
    columns.push({ header: "Actions", accessor: "actions" });
    return columns;
  }, [isMobile, category]);

  const NFLRowRenderer = (
    item: NFLPlayer,
    index: number,
    backgroundColor: string
  ) => <></>;

  const PHLRowRenderer = (
    item: PHLPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const attributes = getPHLAttributes(item, isMobile, category!, null);
    const offers = offersByPlayer[item.ID];
    const actionVariant = !teamOfferMap[item.ID] ? "success" : "secondary";

    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-left`}
        style={{ backgroundColor }}
      >
        {attributes.map((attr, idx) => (
          <TableCell
            key={idx}
            classes={`min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
        text-wrap sm:max-w-full ${
          category === Attributes && idx === 6
            ? "text-left"
            : idx !== 0
            ? "text-center"
            : ""
        }`}
          >
            {attr.label === "Name" ? (
              <span
                className={`cursor-pointer font-semibold`}
                onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
                  (e.target as HTMLElement).style.color = "#fcd53f";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLSpanElement>) => {
                  (e.target as HTMLElement).style.color = "";
                }}
                onClick={() => openModal(InfoType, item)}
              >
                <Text variant="small">{attr.value}</Text>
              </span>
            ) : (
              <Text variant="small">{attr.value}</Text>
            )}
          </TableCell>
        ))}
        <TableCell>{item.MinimumValue}</TableCell>
        <TableCell classes="w-[5em] min-[430px]:w-[10em]">
          {!offers || offers.length === 0 ? "None" : "???"}
        </TableCell>
        <TableCell classes="w-[5em] min-[430px]:w-[6em] sm:w-[6em]">
          <Button
            variant={actionVariant}
            size="xs"
            onClick={() => openModal(AddFreeAgentType, item as PHLPlayer)}
            disabled={!!teamOfferMap[item.ID]}
          >
            {teamOfferMap[item.ID] ? <ActionLock /> : <Plus />}
          </Button>
        </TableCell>
      </div>
    );
  };

  const rowRenderer = (
    league: League
  ): ((item: any, index: number, backgroundColor: string) => ReactNode) => {
    if (league === SimPHL) {
      return PHLRowRenderer;
    }
    return NFLRowRenderer;
  };

  return (
    <Table
      columns={rosterColumns}
      data={players as PHLPlayer[]}
      rowRenderer={rowRenderer(SimPHL)}
      backgroundColor={backgroundColor}
      team={team}
    />
  );
};
