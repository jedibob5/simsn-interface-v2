import { FC } from "react";
import { Table } from "../../_design/Table";
import { Text } from "../../_design/Typography";
import { CollegePlayer as CHLPlayer, ProfessionalPlayer as PHLPlayer } from "../../models/hockeyModels";
import { CollegePlayer as CFBPlayer, NFLPlayer, Timestamp } from "../../models/footballModels";
import { useMobile } from "../../_hooks/useMobile";
import { getCHLAttributes, getPHLAttributes, getCFBAttributes, getNFLAttributes } from "./TeamPageUtils";
import { getTextColorBasedOnBg } from "../../_utility/getBorderClass";
import { Button, ButtonGroup } from "../../_design/Buttons";
import {
  CurrencyDollar,
  Info,
  ScissorIcon,
  ShieldCheck,
  ShieldExclamation,
  Tag,
  User,
  UserPlus,
} from "../../_design/Icons";
import { useModal } from "../../_hooks/useModal";
import {
  Cut,
  InfoType,
  ModalAction,
  Promise,
  Redshirt,
} from "../../_constants/constants";

interface CHLRosterTableProps {
  roster: CHLPlayer[];
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: CHLPlayer) => void;
}

export const CHLRosterTable: FC<CHLRosterTableProps> = ({
  roster,
  colorOne,
  colorTwo,
  colorThree,
  team,
  category,
  openModal,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  let rosterColumns = [
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
    { header: "Yr", accessor: "Year" },
    { header: "⭐", accessor: "Stars" },
    { header: "Ovr", accessor: "Overall" },
  ];

  if (!isMobile) {
    rosterColumns = rosterColumns.concat([
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
  rosterColumns.push({ header: "Actions", accessor: "actions" });

  const sortedRoster = [...roster].sort((a, b) => b.Overall - a.Overall);

  const rowRenderer = (
    item: CHLPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const attributes = getCHLAttributes(item, isMobile, category!);
    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-start`}
        style={{ backgroundColor }}
      >
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className={`table-cell 
            align-middle 
            min-[360px]:max-w-[5em] min-[380px]:max-w-[7em] min-[430px]:max-w-[10em] 
            text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
              idx === 4 ? "text-center" : ""
            }`}
          >
            <Text variant="small">{attr.value}</Text>
          </div>
        ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <ButtonGroup>
            <Button size="xs" onClick={() => openModal(InfoType, item)}>
              <Info />
            </Button>
            <Button size="xs" onClick={() => openModal(Cut, item)}>
              <ScissorIcon />
            </Button>
            <Button
              size="xs"
              variant={`${item.IsRedshirting ? "danger" : "primary"}`}
              disabled={item.IsRedshirting}
              onClick={() => openModal(Redshirt, item)}
            >
              {item.IsRedshirt ? <User /> : <UserPlus />}
            </Button>
            <Button
              size="xs"
              variant={item.TransferStatus === 0 ? "success" : "warning"}
              onClick={() => openModal(Promise, item)}
              disabled={item.TransferStatus === 0}
            >
              <ShieldCheck />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Table
      columns={rosterColumns}
      data={sortedRoster}
      rowRenderer={rowRenderer}
      backgroundColor={backgroundColor}
      team={team}
    />
  );
};

interface PHLRosterTableProps {
  roster: PHLPlayer[] | undefined;
  contracts?: any;
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: PHLPlayer) => void;
}

export const PHLRosterTable: FC<PHLRosterTableProps> = ({
  roster = [],
  contracts = {},
  colorOne,
  colorTwo,
  colorThree,
  team,
  category,
  openModal,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  let rosterColumns = [
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
    { header: "Yr", accessor: "Year" },
    { header: "Ovr", accessor: "Overall" },
  ];

  if (!isMobile) {
    rosterColumns = rosterColumns.concat([
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
  rosterColumns.push({ header: "Actions", accessor: "actions" });

  const sortedRoster = [...roster].sort((a, b) => b.Overall - a.Overall);

  const rowRenderer = (
    item: PHLPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const attributes = getPHLAttributes(item, isMobile, category!);
    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-start`}
        style={{ backgroundColor }}
      >
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className={`table-cell 
            align-middle 
            min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
            text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
              idx === 4 ? "text-center" : ""
            }`}
          >
            <Text variant="small">{attr.value}</Text>
          </div>
        ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <ButtonGroup>
            <Button size="xs" onClick={() => openModal(InfoType, item)}>
              <Info />
            </Button>
            <Button size="xs" onClick={() => openModal(Cut, item)}>
              <ScissorIcon />
            </Button>
            {/* <Button
              size="xs"
              variant={`${item.IsRedshirting ? "danger" : "primary"}`}
              disabled={item.IsRedshirting}
              onClick={() => openModal(Redshirt, item)}
            >
              {item.IsRedshirt ? <User /> : <UserPlus />}
            </Button>
            <Button
              size="xs"
              variant={item.TransferStatus === 0 ? "success" : "warning"}
              onClick={() => openModal(Promise, item)}
              disabled={item.TransferStatus === 0}
            >
              <ShieldCheck />
            </Button> */}
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Table
      columns={rosterColumns}
      data={sortedRoster}
      rowRenderer={rowRenderer}
      backgroundColor={backgroundColor}
      team={team}
    />
  );
};


interface CFBRosterTableProps {
  roster: CFBPlayer[];
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: CFBPlayer) => void;
}

export const CFBRosterTable: FC<CFBRosterTableProps> = ({
  roster,
  colorOne,
  colorTwo,
  colorThree,
  team,
  category,
  openModal,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  let rosterColumns = [
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
    { header: "Yr", accessor: "Year" },
    { header: "⭐", accessor: "Stars" },
    { header: "Ovr", accessor: "Overall" },
  ];

  if (!isMobile) {
    rosterColumns = rosterColumns.concat([
      { header: "Pot", accessor: "PotentialGrade" },
      { header: "FIQ", accessor: "FootballIQ" },
      { header: "SPD", accessor: "Speed" },
      { header: "AGI", accessor: "Agility" },
      { header: "CAR", accessor: "Carrying" },
      { header: "CTH", accessor: "Catching" },
      { header: "RTE", accessor: "RouteRunning" },
      { header: "THP", accessor: "ThrowPower" },
      { header: "THA", accessor: "ThrowAccuracy" },
      { header: "PBK", accessor: "PassBlock" },
      { header: "RBK", accessor: "RunBlock" },
      { header: "STR", accessor: "Strength" },
      { header: "TKL", accessor: "Tackle" },
      { header: "ZCV", accessor: "ZoneCoverage" },
      { header: "MCV", accessor: "ManCoverage" },
      { header: "RSH", accessor: "PassRush" },
      { header: "RDF", accessor: "RunDefense" },
      { header: "KP", accessor: "KickPower" },
      { header: "KA", accessor: "KickAccuracy" },
      { header: "PP", accessor: "PuntPower" },
      { header: "PA", accessor: "PuntAccuracy" },
      { header: "STA", accessor: "Stamina" },
      { header: "INJ", accessor: "Injury" },
    ]);
  }
  rosterColumns.push({ header: "Actions", accessor: "actions" });

  const sortedRoster = [...roster].sort((a, b) => b.Overall - a.Overall);

  const rowRenderer = (
    item: CFBPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const attributes = getCFBAttributes(item, isMobile, category!);
    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-start`}
        style={{ backgroundColor }}
      >
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className={`table-cell 
            align-middle 
            min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
            text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
              idx === 4 ? "text-center" : ""
            }`}
          >
            <Text variant="small">{attr.value}</Text>
          </div>
        ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <ButtonGroup>
            <Button size="xs" onClick={() => openModal(InfoType, item)}>
              <Info />
            </Button>
            <Button size="xs" onClick={() => openModal(Cut, item)}>
              <ScissorIcon />
            </Button>
            <Button
              size="xs"
              variant={`${item.IsRedshirting ? "danger" : "primary"}`}
              disabled={item.IsRedshirting}
              onClick={() => openModal(Redshirt, item)}
            >
              {item.IsRedshirt ? <User /> : <UserPlus />}
            </Button>
            <Button
              size="xs"
              variant={item.TransferStatus === 0 ? "success" : "warning"}
              onClick={() => openModal(Promise, item)}
              disabled={item.TransferStatus === 0}
            >
              <ShieldCheck />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Table
      columns={rosterColumns}
      data={sortedRoster}
      rowRenderer={rowRenderer}
      backgroundColor={backgroundColor}
      team={team}
    />
  );
};


interface NFLRosterTableProps {
  roster: NFLPlayer[];
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: NFLPlayer) => void;
}

export const NFLRosterTable: FC<NFLRosterTableProps> = ({
  roster,
  colorOne,
  colorTwo,
  colorThree,
  team,
  category,
  openModal,
}) => {
  const backgroundColor = colorOne;
  const borderColor = colorTwo;
  const secondaryBorderColor = colorThree;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  let rosterColumns = [
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
    { header: "Yr", accessor: "Year" },
    { header: "Ovr", accessor: "Overall" },
  ];

  if (!isMobile) {
    rosterColumns = rosterColumns.concat([
      { header: "Pot", accessor: "PotentialGrade" },
      { header: "FIQ", accessor: "FootballIQ" },
      { header: "SPD", accessor: "Speed" },
      { header: "AGI", accessor: "Agility" },
      { header: "CAR", accessor: "Carrying" },
      { header: "CTH", accessor: "Catching" },
      { header: "RTE", accessor: "RouteRunning" },
      { header: "THP", accessor: "ThrowPower" },
      { header: "THA", accessor: "ThrowAccuracy" },
      { header: "PBK", accessor: "PassBlock" },
      { header: "RBK", accessor: "RunBlock" },
      { header: "STR", accessor: "Strength" },
      { header: "TKL", accessor: "Tackle" },
      { header: "ZCV", accessor: "ZoneCoverage" },
      { header: "MCV", accessor: "ManCoverage" },
      { header: "RSH", accessor: "PassRush" },
      { header: "RDF", accessor: "RunDefense" },
      { header: "KP", accessor: "KickPower" },
      { header: "KA", accessor: "KickAccuracy" },
      { header: "PP", accessor: "PuntPower" },
      { header: "PA", accessor: "PuntAccuracy" },
      { header: "STA", accessor: "Stamina" },
      { header: "INJ", accessor: "Injury" },
    ]);
  }
  rosterColumns.push({ header: "Actions", accessor: "actions" });

  const sortedRoster = [...roster].sort((a, b) => b.Overall - a.Overall);

  const rowRenderer = (
    item: NFLPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const attributes = getNFLAttributes(item, isMobile, category!);
    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-start`}
        style={{ backgroundColor }}
      >
        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className={`table-cell 
            align-middle 
            min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
            text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
              idx === 4 ? "text-center" : ""
            }`}
          >
            <Text variant="small">{attr.value}</Text>
          </div>
        ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <ButtonGroup>
            <Button size="xs" onClick={() => openModal(InfoType, item)}>
              <Info />
            </Button>
            <Button size="xs" onClick={() => openModal(Cut, item)}>
              <ScissorIcon />
            </Button>
            <Button
              size="xs"
            >
              <CurrencyDollar />
              </Button>
            <Button
              size="xs"
            >
              <Tag />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Table
      columns={rosterColumns}
      data={sortedRoster}
      rowRenderer={rowRenderer}
      backgroundColor={backgroundColor}
      team={team}
    />
  );
};

