import { FC, useMemo } from "react";
import { Table } from "../../_design/Table";
import { Text } from "../../_design/Typography";
import { CollegePlayer as CHLPlayer, ProfessionalPlayer as PHLPlayer, ProContract as PHLContract } from "../../models/hockeyModels";
import { CollegePlayer as CFBPlayer, NFLPlayer, NFLContract, Timestamp } from "../../models/footballModels";
import { useMobile } from "../../_hooks/useMobile";
import { Attributes, Potentials, Contracts, Overview, ButtonGreen, TextGreen } from "../../_constants/constants";
import { getCHLAttributes, getPHLAttributes, getCFBAttributes, getNFLAttributes } from "./TeamPageUtils";
import { getTextColorBasedOnBg } from "../../_utility/getBorderClass";
import { useModal } from "../../_hooks/useModal";
import {
  Cut,
  InfoType,
  ModalAction,
  Promise,
  Redshirt,
} from "../../_constants/constants";
import { SelectDropdown } from "../../_design/Select";
import { CheckCircle, CrossCircle, ShieldCheck, User } from "../../_design/Icons";

interface CHLRosterTableProps {
  roster: CHLPlayer[];
  backgroundColor?: string;
  headerColor?: string;
  borderColor?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: CHLPlayer) => void;
}

export const CHLRosterTable: FC<CHLRosterTableProps> = ({
  roster,
  backgroundColor,
  headerColor,
  borderColor,
  team,
  category,
  openModal,
}) => {

  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  let rosterColumns = useMemo(() => {
    let columns = [
      { header: "Name", accessor: "LastName" },
      { header: "Pos", accessor: "Position" },
      { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
      { header: "Yr", accessor: "Year" },
      { header: "⭐", accessor: "Stars" },
      { header: "Ovr", accessor: "Overall" },
    ];

    if (!isMobile && category === Overview) {
      columns = columns.concat([
        { header: "Health", accessor: "isInjured" },
        { header: "Injury", accessor: "InjuryType" },
        { header: "Redshirt", accessor: "isRedshirting" },
        { header: "Mood", accessor: "TransferStatus" },
      ]);
    }

    if (!isMobile  && category === Attributes || category === Potentials) {
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
    columns.push({ header: "Actions", accessor: "actions" });
  return columns;
  }, [isMobile, category]);

  const sortedRoster = useMemo(() => {
    return [...roster].sort((a, b) => b.Overall - a.Overall);
  }, [roster]);

  const rowRenderer = (
    item: CHLPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const attributes = getCHLAttributes(item, isMobile, category!);
    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-left`}
        style={{ backgroundColor }}
      >
        {attributes.map((attr, idx) => (
        <div
        key={idx}
        className={`table-cell 
        align-middle 
        min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
        text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
          category === Overview && idx === 7
            ? "text-left"
            : idx !== 0
            ? "text-center"
            : ""
        }`}
      >
          {attr.label === "Redshirt" ? (
          <>
            {attr.value === true ? (
              <CheckCircle textColorClass={`w-full text-center ${TextGreen}`} />
            ) : (
              <CrossCircle textColorClass="w-full text-center text-red-500" />
            )}
          </>
        ) : attr.label === "Health" ? (
          <>
            {attr.value === true ? (
              <User textColorClass="w-full text-center text-red-500" />
            ) : (
              <User textColorClass={`w-full text-center ${TextGreen}`} />
            )}
          </>
        ) : attr.label === "TransferStatus" ? (
          <>
            {attr.value === 0 ? (
              <ShieldCheck textColorClass={`w-full text-center ${TextGreen}`} />
            ) : (
              <ShieldCheck textColorClass="w-full text-center text-red-500" />
            )}
          </>
        ) : attr.label === "Name" ? (
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
          </div>
        ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <SelectDropdown
            placeholder={isMobile ? "Action" : "Select an action"}
            options={[
              { value: "cut", label: `Cut - ${item.FirstName} ${item.LastName}` },
              ...(item.IsRedshirting || item.IsRedshirt
                ? []
                : [{ value: "redshirt", label: `Redshirt - ${item.FirstName} ${item.LastName}` }]),
              ...(item.TransferStatus === 0
                ? []
                : [{ value: "promise", label: `Send Promise - ${item.FirstName} ${item.LastName}` }]),
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.value === "cut") {
                openModal(Cut, item);
              }
              if (selectedOption?.value === "redshirt") {
                openModal(Redshirt, item);
              } 
              if (selectedOption?.value === "promise"){
                openModal(Promise, item);
              }
              else {
                console.log(`Action selected: ${selectedOption?.value}`);
              }
            }}
          />
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
  contracts?: PHLContract[] | null;
  ts: any;
  backgroundColor?: string;
  headerColor?: string;
  borderColor?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: PHLPlayer) => void;
}

export const PHLRosterTable: FC<PHLRosterTableProps> = ({
  roster = [],
  contracts,
  ts,
  backgroundColor,
  headerColor,
  borderColor,
  team,
  category,
  openModal,
}) => {
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  const rosterColumns = useMemo(() => {
    let columns = [
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
    { header: "Exp", accessor: "Year" },
    { header: "Ovr", accessor: "Overall" },
  ];

  if (!isMobile && category === Overview) {
    columns = columns.concat([
      { header: "Health", accessor: "isInjured" },
      { header: "Injury", accessor: "InjuryType" },
      { header: `${ts.Season} $`, accessor: "Y1BaseSalary" },
      { header: "Yrs Left", accessor: "ContractLength" },
      { header: "NTC", accessor: "NoTradeClause" },
      { header: "NMC", accessor: "NoMovementClause" },
    ]);
  }

  if (!isMobile && category === Attributes || category === Potentials) {
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

  if (!isMobile && category === Contracts) {
    columns = columns.concat([
      { header: "Y1 S", accessor: "Y1BaseSalary" },
      { header: "Y2 S", accessor: "Y2BaseSalary" },
      { header: "Y3 S", accessor: "Y3BaseSalary" },
      { header: "Y4 S", accessor: "Y4BaseSalary" },
      { header: "Y5 S", accessor: "Y5BaseSalary" },
      { header: "Yrs", accessor: "ContractLength" },
      { header: "NTC", accessor: "NoTradeClause" },
      { header: "NMC", accessor: "NoMovementClause" },
    ]);
  }

  columns.push({ header: "Actions", accessor: "actions" });
  return columns;
}, [isMobile, category]);

  const sortedRoster = useMemo(() => {
    return [...roster].sort((a, b) => b.Overall - a.Overall);
  }, [roster]);

  const rowRenderer = (
    item: PHLPlayer,
    index: number,
    backgroundColor: string
  ) => {
    const playerContract = contracts?.find(contract => contract.PlayerID === item.ID);
    const attributes = getPHLAttributes(item, isMobile, category!, playerContract);
    return (
      <div
    key={item.ID}
    className={`table-row border-b dark:border-gray-700 text-left`}
    style={{ backgroundColor }}
  >
    {attributes.map((attr, idx) => (
        <div
        key={idx}
        className={`table-cell 
        align-middle 
        min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
        text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
          category === Overview && idx === 6
            ? "text-left"
            : idx !== 0
            ? "text-center"
            : ""
        }`}
      >
        {attr.label === "NTC" || attr.label === "NMC" ? (
          <>
            {attr.value === true ? (
              <CheckCircle textColorClass={`w-full text-center ${TextGreen}`} />
            ) : (
              <CrossCircle textColorClass="w-full text-center text-red-500" />
            )}
          </>
        ) : attr.label === "Health" ? (
          <>
            {attr.value === true ? (
              <User textColorClass="w-full text-center text-red-500" />
            ) : (
              <User textColorClass={`w-full text-center ${TextGreen}`} />
            )}
          </>
        ) : attr.label === "Name" ? (
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
      </div>
    ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <SelectDropdown
            placeholder={isMobile ? "Action" : "Select an action"}
            options={[
              { value: "cut", label: `Cut - ${item.FirstName} ${item.LastName}` },
              { value: "extension", label: `Offer Extension - ${item.FirstName} ${item.LastName}` },
              { value: "franchise", label: `Franchise Tag - ${item.FirstName} ${item.LastName}` },
              { value: "injuredReserve", label: `Send to Injured Reserve - ${item.FirstName} ${item.LastName}` },
              { value: "practiceSquad", label: `Demote to Practice Squad - ${item.FirstName} ${item.LastName}` },
              { value: "tradeBlock", label: `Trade Block - ${item.FirstName} ${item.LastName}` },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.value === "cut") {
                openModal(Cut, item);
              } else {
                console.log(`Action selected: ${selectedOption?.value}`);
              }
            }}
          />
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
  backgroundColor?: string;
  headerColor?: string;
  borderColor?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: CFBPlayer) => void;
}

export const CFBRosterTable: FC<CFBRosterTableProps> = ({
  roster,
  backgroundColor,
  headerColor,
  borderColor,
  team,
  category,
  openModal,
}) => {
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  let rosterColumns = useMemo(() => {
    let columns = [
    { header: "Name", accessor: "LastName" },
    { header: "Pos", accessor: "Position" },
    { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
    { header: "Yr", accessor: "Year" },
    { header: "⭐", accessor: "Stars" },
    { header: "Ovr", accessor: "Overall" },
  ];

  if (!isMobile && category === Overview) {
    columns = columns.concat([
      { header: "Pot", accessor: "PotentialGrade" },
      { header: "Health", accessor: "isInjured" },
      { header: "Injury", accessor: "InjuryType" },
      { header: "Redshirt", accessor: "isRedshirting" },
      { header: "Mood", accessor: "TransferStatus" },
    ]);
  }

  if (!isMobile && category === Attributes) {
    columns = columns.concat([
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
    columns.push({ header: "Actions", accessor: "actions" });
  return columns;
  }, [isMobile, category]);

  const sortedRoster = useMemo(() => {
    return [...roster].sort((a, b) => b.Overall - a.Overall);
  }, [roster]);

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
          category === Overview && idx === 8
            ? "text-left"
            : idx !== 0
            ? "text-center"
            : ""
        }`}
      >
          {attr.label === "Redshirt" ? (
          <>
            {attr.value === true ? (
              <CheckCircle textColorClass={`w-full text-center ${TextGreen}`} />
            ) : (
              <CrossCircle textColorClass="w-full text-center text-red-500" />
            )}
          </>
        ) : attr.label === "Health" ? (
          <>
            {attr.value === true ? (
              <User textColorClass="w-full text-center text-red-500" />
            ) : (
              <User textColorClass={`w-full text-center ${TextGreen}`} />
            )}
          </>
        ) : attr.label === "TransferStatus" ? (
          <>
            {attr.value === 0 ? (
              <ShieldCheck textColorClass={`w-full text-center ${TextGreen}`} />
            ) : (
              <ShieldCheck textColorClass="w-full text-center text-red-500" />
            )}
          </>
        ) : attr.label === "Name" ? (
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
          </div>
        ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <SelectDropdown
            placeholder={isMobile ? "Action" : "Select an action"}
            options={[
              { value: "cut", label: `Cut - ${item.FirstName} ${item.LastName}` },
              ...(item.IsRedshirting || item.IsRedshirt
                ? []
                : [{ value: "redshirt", label: `Redshirt - ${item.FirstName} ${item.LastName}` }]),
              ...(item.TransferStatus === 0
                ? []
                : [{ value: "promise", label: `Send Promise - ${item.FirstName} ${item.LastName}` }]),
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.value === "cut") {
                openModal(Cut, item);
              }
              if (selectedOption?.value === "redshirt") {
                openModal(Redshirt, item);
              } 
              if (selectedOption?.value === "promise"){
                openModal(Promise, item);
              }
              else {
                console.log(`Action selected: ${selectedOption?.value}`);
              }
            }}
          />
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
  contracts?: NFLContract[] | null;
  ts: any;
  backgroundColor?: string;
  headerColor?: string;
  borderColor?: string;
  team?: any;
  category?: string;
  openModal: (action: ModalAction, player: NFLPlayer) => void;
}

export const NFLRosterTable: FC<NFLRosterTableProps> = ({
  roster,
  contracts,
  ts,
  backgroundColor,
  headerColor,
  borderColor,
  team,
  category,
  openModal,
}) => {

  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const [isMobile] = useMobile();

  const rosterColumns = useMemo(() => {
    let columns = [
      { header: "Name", accessor: "LastName" },
      { header: "Pos", accessor: "Position" },
      { header: isMobile ? "Arch" : "Archetype", accessor: "Archetype" },
      { header: "Exp", accessor: "Year" },
      { header: "Ovr", accessor: "Overall" },
    ];

    if (!isMobile && category === Overview) {
      columns = columns.concat([
        { header: "Pot", accessor: "PotentialGrade" },
        { header: "Health", accessor: "isInjured" },
        { header: "Injury", accessor: "InjuryType" },
        { header: `${ts.Season} S`, accessor: "Y1BaseSalary" },
        { header: `${ts.Season} B`, accessor: "Y1Bonus" },
        { header: "Yrs Left", accessor: "ContractLength" },
        { header: "Tagged", accessor: "isTagged" },
      ]);
    }

    if (!isMobile && category === Attributes) {
      columns = columns.concat([
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

    if (!isMobile && category === Contracts) {
      columns = columns.concat([
        { header: "Y1 B", accessor: "Y1Bonus" },
        { header: "Y1 S", accessor: "Y1BaseSalary" },
        { header: "Y2 B", accessor: "Y2Bonus" },
        { header: "Y2 S", accessor: "Y2BaseSalary" },
        { header: "Y3 B", accessor: "Y3Bonus" },
        { header: "Y3 S", accessor: "Y3BaseSalary" },
        { header: "Y4 B", accessor: "Y4Bonus" },
        { header: "Y4 S", accessor: "Y4BaseSalary" },
        { header: "Y5 B", accessor: "Y5Bonus" },
        { header: "Y5 S", accessor: "Y5BaseSalary" },
        { header: "Yrs", accessor: "ContractLength" },
      ]);
    }

    columns.push({ header: "Actions", accessor: "actions" });
    return columns;
  }, [isMobile, category]);

  const sortedRoster = useMemo(() => {
    return [...roster].sort((a, b) => b.Overall - a.Overall);
  }, [roster]);

  const rowRenderer = (
    item: NFLPlayer,
    index: number,
    backgroundColor: string,
  ) => {
    const playerContract = contracts?.find(contract => contract.PlayerID === item.ID);
    const attributes = getNFLAttributes(item, isMobile, category!, item.ShowLetterGrade, playerContract);
    return (
      <div
        key={item.ID}
        className={`table-row border-b dark:border-gray-700 text-left`}
        style={{ backgroundColor }}
      >
      {attributes.map((attr, idx) => (
        <div
          key={idx}
          className={`table-cell 
          align-middle 
          min-[360px]:max-w-[6em] min-[380px]:max-w-[8em] min-[430px]:max-w-[10em] 
          text-wrap sm:max-w-full px-1 sm:px-1.5 py-1 sm:whitespace-nowrap ${
            category === Overview && idx === 7
              ? "text-left"
              : idx !== 0
              ? "text-center"
              : ""
          }`}
        >
      {attr.label === "Is Tagged" ? (
        <>
          {attr.value === true ? (
            <CheckCircle textColorClass={`w-full text-center ${TextGreen}`} />
          ) : (
            <CrossCircle textColorClass="w-full text-center text-red-500" />
          )}
        </>
      ) : attr.label === "Health" ? (
        <>
          {attr.value === true ? (
            <User textColorClass="w-full text-center text-red-500" />
          ) : (
            <User textColorClass={`w-full text-center ${TextGreen}`} />
          )}
        </>
      ) : attr.label === "Name" ? (
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
    </div>
  ))}
        <div className="table-cell align-middle w-[5em] min-[430px]:w-[6em] sm:w-full flex-wrap sm:flex-nowrap sm:px-2 pb-1 sm:py-1 whitespace-nowrap">
          <SelectDropdown
            placeholder={isMobile ? "Action" : "Select an action"}
            options={[
              { value: "cut", label: `Cut - ${item.FirstName} ${item.LastName}` },
              { value: "extension", label: `Offer Extension - ${item.FirstName} ${item.LastName}` },
              { value: "franchise", label: `Franchise Tag - ${item.FirstName} ${item.LastName}` },
              { value: "injuredReserve", label: `Send to Injured Reserve - ${item.FirstName} ${item.LastName}` },
              { value: "practiceSquad", label: `Demote to Reserves - ${item.FirstName} ${item.LastName}` },
              { value: "tradeBlock", label: `Trade Block - ${item.FirstName} ${item.LastName}` },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.value === "cut") {
                openModal(Cut, item);
              } else {
                console.log(`Action selected: ${selectedOption?.value}`);
              }
            }}
          />
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

