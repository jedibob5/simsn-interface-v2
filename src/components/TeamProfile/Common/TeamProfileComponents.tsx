import { useState } from "react";
import { getLogo } from "../../../_utility/getLogo";
import { Text } from "../../../_design/Typography";
import { Logo } from "../../../_design/Logo";
import { FC, useEffect, useRef } from "react";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";
import { darkenColor } from "../../../_utility/getDarkerColor";
import {
  GetBKCurrentWeek,
  RevealBBAResults,
  RevealHCKResults,
  RevealResults,
} from "../../../_helper/teamHelper";
import { SectionCards } from "../../../_design/SectionCards";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import {
  League,
  SimCBB,
  SimCHL,
  SimNBA,
  SimPHL,
  SimCFB,
  SimNFL,
  statsOptions,
  StatsCategory
} from "../../../_constants/constants";
import PlayerPicture from "../../../_utility/usePlayerFaces";
import { TeamProfileCards } from "./TeamProfileCards";
import { Table, TableCell } from "../../../_design/Table";
import { SelectDropdown } from "../../../_design/Select";
import { SelectOption } from "../../../_hooks/useSelectStyles";
import { SingleValue } from "react-select";
import { getFBAStatColumns, processTopPlayers } from "./TeamProfileHelper";

interface TeamProfileComponentsProps {
  league: League;
  team: any;
  data: any;
  wins?: number;
  losses?: number;
  playerMap?: any;
  title?: string;
  backgroundColor: string;
  borderColor: string;
  headerColor: string;
  darkerBackgroundColor: string;
  textColorClass: string;
}

export const TeamRivalry = ({
  league,
  team,
  data,
  backgroundColor,
  borderColor,
  headerColor,
  darkerBackgroundColor,
  textColorClass
}: TeamProfileComponentsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rivalsArray = Array.isArray(data) ? data : Object.values(data ?? {});
  const rivals = rivalsArray.length;
  const rival = rivalsArray[currentIndex] || {};

  const handlePrev = () => setCurrentIndex((prev) => prev === 0 ? rivals - 1 : prev - 1);
  const handleNext = () => setCurrentIndex((prev) => prev === rivals - 1 ? 0 : prev + 1);
  const winsColor = "#189E5B";

  if (!rivals || rivals === 0) {
    return (
      <TeamProfileCards
        team={team}
        header="Rivalries"
        classes={`${textColorClass} h-full`}
        backgroundColor={backgroundColor}
        headerColor={headerColor}
        borderColor={borderColor}
        darkerBackgroundColor={darkerBackgroundColor}
        textColorClass={textColorClass}
      >
        <Text variant="small" classes={textColorClass}>No rivalries found.</Text>
      </TeamProfileCards>
    );
  }

  return (
    <TeamProfileCards
      team={team}
      header="Rivalries"
      classes={`${textColorClass} h-full`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      darkerBackgroundColor={darkerBackgroundColor}
      textColorClass={textColorClass}
    >
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex w-full items-center justify-between gap-4">
          {rivals > 1 && (
            <button onClick={handlePrev} aria-label="Previous Rival"
              className="flex size-8 items-center justify-center rounded-full"
              style={{ backgroundColor: darkerBackgroundColor, borderColor: headerColor, color: borderColor }}>
              {"<"}
            </button>
          )}
          <Logo
            url={getLogo(league, rival.opponentTeamId, false)}
            variant="large"
          />
          {rivals > 1 && (
            <button onClick={handleNext} aria-label="Next Rival"
              className="flex size-8 items-center justify-center rounded-full"
              style={{ backgroundColor: darkerBackgroundColor, borderColor: headerColor, color: borderColor }}>
              {">"}
            </button>
          )}
        </div>
        <Text variant="h4" classes={textColorClass}>vs {rival.opponentTeamName}</Text>
        <div className="flex justify-around items-center w-full">
          <div className="flex flex-col pl-4">
            <Text variant="h1-alt" 
                  classes={rival.selectedTeamWins > rival.selectedTeamLosses 
                    ? `text-[${winsColor}] w-1/3` 
                    : rival.selectedTeamWins < rival.selectedTeamLosses 
                      ? `text-red-500 w-1/3`
                      : `${textColorClass}`
                  }>
              {rival.selectedTeamWins}
            </Text>
            <Text variant="small">Wins</Text>
          </div>
          <div className="flex flex-col">
            <Text variant="body" 
                  classes={rival.selectedTeamWins > rival.selectedTeamLosses 
                    ? `text-[${winsColor}] font-semibold` 
                    : rival.selectedTeamWins < rival.selectedTeamLosses 
                      ? `text-red-500 font-semibold`
                      : `${textColorClass} font-semibold`
                  }>
              {rival.rivalryTie
                ? "Tied"
                : rival.selectedTeamLeads
                  ? `${rival.selectedTeamName} leads`
                  : `${rival.opponentTeamName} leads`
              }
            </Text>
          </div>
          <div className="flex flex-col pr-4">
            <Text variant="h1-alt" 
                  classes={rival.selectedTeamWins > rival.selectedTeamLosses 
                    ? `text-[${winsColor}] w-1/3` 
                    : rival.selectedTeamWins < rival.selectedTeamLosses 
                      ? `text-red-500 w-1/3`
                      : `${textColorClass}`
                  }>
              {rival.selectedTeamLosses}
            </Text>
            <Text variant="small">Losses</Text>
          </div>
        </div>
        <div className="flex justify-between w-full border-t border-b" style={{ borderColor }} >
          <div className="flex w-[40%] flex-col items-center justify-center py-2">
            <Text
              variant="h3-alt"
              classes={`font-semibold ${rival.latestResultColor}`}
            >
              {rival.latestResultScore}
            </Text>
            <Text variant="small">Latest Result ({rival.latestResultSeason})</Text>
          </div>
          <div className="flex justify-center w-[20%]">
            <div className="border" style={{ borderColor }} />
          </div>
          <div className="flex flex-col w-[40%] items-center justify-center py-2">
            <Text variant="h3-alt"                   
                  classes={rival.CurrentStreak > 0 
                    ? `${rival.streakColor} font-semibold` 
                    : `${textColorClass}`
                  }>
              {rival.streakText}
            </Text>
            <Text variant="small" classes={``}>Current Streak</Text>
          </div>
        </div>
        <Text variant="xs" classes={textColorClass}>
          Rival {currentIndex + 1} of {rivals}
        </Text>
      </div>
    </TeamProfileCards>
  );
};

export const TeamPlayerCareerStats = ({
  league,
  team,
  data,
  playerMap,
  title,
  backgroundColor,
  borderColor,
  headerColor,
  darkerBackgroundColor,
  textColorClass,
}: TeamProfileComponentsProps ) => {

  const [statsCategory, setStatsCategory] = useState<StatsCategory>("Passing");
  const selectStatsOption = (opts: SingleValue<SelectOption>) => {
    if (opts?.value) setStatsCategory(opts.value as StatsCategory);
  };
  const statColumns = getFBAStatColumns(statsCategory);
  const {
    topPassing,
    topRushing,
    topReceiving,
    topTackles,
    topSacks,
    topINTs,
  } = processTopPlayers(data, playerMap);

  let stats: any[] = [];
  switch (statsCategory) {
    case "Passing":
      stats = topPassing;
      break;
    case "Rushing":
      stats = topRushing;
      break;
    case "Receiving":
      stats = topReceiving;
      break;
    case "Tackles":
      stats = topTackles;
      break;
    case "Sacks":
      stats = topSacks;
      break;
    case "Interceptions":
      stats = topINTs;
      break;
    default:
      stats = [];
  }

  const statsLength = stats.length;
  const topThree = stats.slice(0, 3);

    const borderColors = [
      "#FFD700",
      "#C0C0C0",
      "#CD7F32",
    ];

  if (!stats || statsLength === 0) {
    return (
      <TeamProfileCards
        team={team}
        header={title || "All-Time Stats Leaders"}
        classes={`${textColorClass} h-full`}
        backgroundColor={backgroundColor}
        headerColor={headerColor}
        borderColor={borderColor}
        darkerBackgroundColor={darkerBackgroundColor}
        textColorClass={textColorClass}
      >
        <Text variant="small" classes={textColorClass}>No stats leader found.</Text>
      </TeamProfileCards>
    );
  }

  return (
    <TeamProfileCards
      team={team}
      header={title || "All-Time Stats Leaders"}
      classes={`${textColorClass} h-full overflow-y-auto`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      darkerBackgroundColor={darkerBackgroundColor}
      textColorClass={textColorClass}
    >
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row justify-center items-end gap-4 mb-4">
          {topThree.map((player, idx) => (
            <div
              key={player.CollegePlayerID || idx}
              className="flex flex-col items-center pt-2"
            >
              <div className="rounded-lg mb-2 border h-[5em] w-[5em]"
                style={{
                  border: `4px solid ${borderColors[idx]}`,
                  background: "#242424"
                }}
              >
                <PlayerPicture
                  playerID={player.CollegePlayerID}
                  team={team}
                  league={league}
                />
              </div>
              <Text variant="body" classes="font-bold">{player.Position}</Text>
              <Text variant="body-small" classes="text-center">
                {player.FirstName} {player.LastName}
              </Text>
              <Text variant="xs" classes="font-semibold mt-1">
                {idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd"}
              </Text>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <SelectDropdown
            options={statsOptions}
            onChange={selectStatsOption}
            className=""
          />
        </div>
        <Table
          columns={statColumns}
          data={stats}
          team={team}
          rowRenderer={(item, index, bg) => (
            <div className="table-row text-left text-lg" style={{ backgroundColor: bg }}>
              {statColumns.map((col) => (
                <TableCell key={col.accessor}>
                  {col.render ? col.render(item, index) : item[col.accessor]}
                </TableCell>
              ))}
            </div>
          )}
          rowBgColor={backgroundColor}
          darkerRowBgColor={darkerBackgroundColor}
          league={league}
        />
      </div>
    </TeamProfileCards>
  );
};

export const TeamSeasonHistory = ({
  league,
  team,
  data,
  wins,
  losses,
  backgroundColor,
  borderColor,
  headerColor,
  darkerBackgroundColor,
  textColorClass
}: TeamProfileComponentsProps) => {
  const winsColor = "#189E5B";
  const lossesColor = "text-red-500";
  if (!data || data === 0) {
    return (
      <TeamProfileCards
        team={team}
        header="Seasons History"
        classes={`${textColorClass} h-full`}
        backgroundColor={backgroundColor}
        headerColor={headerColor}
        borderColor={borderColor}
        darkerBackgroundColor={darkerBackgroundColor}
        textColorClass={textColorClass}
      >
        <Text variant="small" classes={textColorClass}>No season data found.</Text>
      </TeamProfileCards>
    );
  }

  return (
    <TeamProfileCards
      team={team}
      header="Past Seasons"
      classes={`${textColorClass} w-full`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      darkerBackgroundColor={darkerBackgroundColor}
      textColorClass={textColorClass}
    >
      <div className="flex flex-col justify-center gap-4 items-center py-2">
        <div className="flex flex-col gap-2 font-semibold">
          <Text variant="h3-alt" classes={`${textColorClass}`}>
            Overall Record
          </Text>
        </div>          
      {wins && losses && (
        <div className="flex gap-2 font-semibold pb-2">
          <Text variant="h2-alt" 
                classes={
                  wins > losses
                    ? `text-[${winsColor}]`
                    : wins < losses
                      ? `text-red-500`
                      : textColorClass
                }>
            {wins}
          </Text>
          <Text variant="h2-alt" 
                classes={
                  wins > losses
                    ? `text-[${winsColor}]`
                    : wins < losses
                      ? `text-red-500`
                      : textColorClass
                }>
            -
          </Text>
          <Text variant="h2-alt" 
                classes={
                  wins > losses
                    ? `text-[${winsColor}]`
                    : wins < losses
                      ? `text-red-500`
                      : textColorClass
                }>
            {losses}
          </Text>
        </div> 
      )}
      </div>
      <div className="flex justify-between gap-8 items-center py-2">
        <div className="flex flex-col gap-2 w-1/3 font-semibold">
          <Text variant="h3-alt" classes={`${textColorClass}`}>
            Season
          </Text>
        </div>
        <div className="flex flex-col gap-2 w-1/3 font-semibold">
          <Text variant="h3-alt" classes={`${textColorClass}`}>
            Coach
          </Text>
        </div>
        <div className="flex flex-col gap-2 w-1/3 font-semibold">
          <Text variant="h3-alt" classes={`${textColorClass}`}>
            Record
          </Text>
        </div>
      </div>
    {data.length > 0 ? (
      data.map((season: any, index: number) => (
        <div key={index} className="p-2">
          <div className="flex justify-between gap-8 items-center">
            <div className="flex flex-col w-1/3">
              <Text variant="h3-alt" classes={`${textColorClass}`}>
                {season.Season}
              </Text>
            </div>
            <div className="flex flex-col w-1/3">
              <Text variant="h3-alt" classes={`${textColorClass}`}>
                {season.Coach}
              </Text>
            </div>
            <div className="flex w-1/3 justify-center">
              <Text variant="h3-alt" 
                    classes={season.TotalWins > season.TotalLosses 
                      ? `text-[${winsColor}] w-1/3` 
                      : `text-red-500 w-1/3`}>
                {season.TotalWins}
              </Text>
              <Text variant="h3-alt" 
                    classes={season.TotalWins > season.TotalLosses 
                      ? `text-[${winsColor}] w-1/5` 
                      : `text-red-500 w-1/5`}>
                -
              </Text>
              <Text variant="h3-alt" 
                    classes={season.TotalWins > season.TotalLosses 
                      ? `text-[${winsColor}] w-1/3` 
                      : `text-red-500 w-1/3`}>
                {season.TotalLosses}
              </Text>
            </div>
          </div>
        </div>
      ))
    ) : (
      <Text variant="small" classes={`${textColorClass} pt-2 pb-2`}>
        No season data
      </Text>
    )}
    </TeamProfileCards>
  );
};