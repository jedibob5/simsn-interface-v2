import { FC, useMemo, useState, useEffect } from "react";
import {
  League,
  ModalAction,
  SimCHL,
  SimPHL,
  SimCFB,
  SimNFL,
  PBP,
  BoxScore,
} from "../../../_constants/constants";
import { Modal } from "../../../_design/Modal";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import { Logo } from "../../../_design/Logo";
import FBAScheduleService from "../../../_services/scheduleService";
import {
  PlayerStats,
  GameResult,
  PlayByPlay,
  FilteredStats,
  HockeyFilteredStats,
  HockeyGameResult
} from "./GameModalInterfaces";
import { CollegePlayerGameStats as CHLPlayerGameStats, ProfessionalPlayerGameStats as PHLPlayerGameStats, GameResultsResponse } from "../../../models/hockeyModels";
import { darkenColor } from "../../../_utility/getDarkerColor";
import { getPasserRating } from "../../../_utility/getPasserRating";
import { useSimHCKStore } from "../../../context/SimHockeyContext";
import { ToggleSwitch } from "../../../_design/Inputs";

export interface SchedulePageGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  playerMap?: any;
  game: any;
  title: string;
}

export const SchedulePageGameModal: FC<SchedulePageGameModalProps> = ({
  league,
  isOpen,
  onClose,
  playerMap,
  game,
  title,
}) => {
  let isPro = false;

  if (league === SimPHL || league === SimNFL) {
    isPro = true;
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${title} Box Score`}
        classes="h-[80vh] sm:min-w-[1400px] overflow-auto"
      >
        {league === SimCHL && (
          <HockeyGameModal game={game} league={league} isPro={isPro} playerMap={playerMap} />
        )}
        {league === SimPHL && (
          <HockeyGameModal game={game} league={league} isPro={isPro} playerMap={playerMap} />
        )}
        {league === SimCFB && (
          <FootballGameModal game={game} league={league} isPro={isPro} />
        )}
        {league === SimNFL && (
          <FootballGameModal game={game} league={league} isPro={isPro} />
        )}
      </Modal>
    </>
  );
};

export interface GameModalProps {
  league: League;
  playerMap?: any;
  game: any;
  isPro: boolean;
}

export const FootballGameModal = ({ league, game, isPro }: GameModalProps) => {
  const scheduleService = new FBAScheduleService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [homePlayers, setHomePlayers] = useState<PlayerStats[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerStats[]>([]);
  const [viewableHomePlayers, setViewableHomePlayers] =
    useState<FilteredStats | null>(null);
  const [viewableAwayPlayers, setViewableAwayPlayers] =
    useState<FilteredStats | null>(null);
  const [playByPlays, setPlayByPlays] = useState<PlayByPlay[]>([]);
  const [view, setView] = useState<string>("Box Score");
  const [header, setHeader] = useState<string>("Box Score");
  const [score, setScore] = useState<any | null>(null);
  const backgroundColor = "#1f2937";
  const borderColor = darkenColor(backgroundColor, -5);

  useEffect(() => {
    if (!game || game.ID <= 0) return;
    GetMatchResults();
  }, [game]);

  const GetMatchResults = async (): Promise<void> => {
    setIsLoading(true);

    let response: GameResult;
    if (isPro) {
      response = await scheduleService.GetNFLGameResultData(game.ID);
    } else {
      response = await scheduleService.GetCFBGameResultData(game.ID);
      console.log(response)
    }

    const filteredHomePlayerList = FilterStatsData(response.HomePlayers);
    const filteredAwayPlayerList = FilterStatsData(response.AwayPlayers);

    setViewableHomePlayers(filteredHomePlayerList);
    setViewableAwayPlayers(filteredAwayPlayerList);
    setHomePlayers(response.HomePlayers);
    setAwayPlayers(response.AwayPlayers);

    const pbp: PlayByPlay[] = [...response.PlayByPlays];
    setPlayByPlays(pbp);
    setScore(response.Score);
    setIsLoading(false);
  };

  const FilterStatsData = (dataSet: PlayerStats[]): FilteredStats => {
    const obj: FilteredStats = {
      PassingStats: [],
      RushingStats: [],
      ReceivingStats: [],
      DefenseStats: [],
      SpecialTeamStats: [],
      OLineStats: [],
    };

    if (dataSet.length > 0) {
      obj.PassingStats = dataSet
      .filter((x) => x.PassAttempts && x.PassAttempts > 0)
      .sort((a, b) => (b.PassAttempts ?? 0) - (a.PassAttempts ?? 0));
      
      obj.RushingStats = dataSet.filter(
        (x) => x.RushAttempts && x.RushAttempts > 0
      );
      obj.ReceivingStats = dataSet.filter((x) => x.Targets && x.Targets > 0);
      obj.DefenseStats = dataSet.filter((x) =>
        ["ILB", "OLB", "DT", "DE", "CB", "FS", "SS", "QB"].includes(x.Position)
      );
      obj.SpecialTeamStats = dataSet.filter((x) =>
        ["P", "K", "QB"].includes(x.Position)
      );
      obj.OLineStats = dataSet.filter(
        (x) =>
          (x.Pancakes && x.Pancakes > 0) ||
          (x.SacksAllowed && x.SacksAllowed > 0)
      );
    }

    return obj;
  };

  return (
    <>
    {isLoading ? (
        <div className="flex justify-center items-center">
          <Text variant="small">
            Loading...
          </Text>
        </div>
      ) : (
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-around px-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <Logo url={game.HomeTeamLogo} classes="w-full h-full" />
              <div className="flex flex-col text-left">
            {!isPro && (
              <Text variant="small" classes="opacity-50">
                {game.HomeTeamRank > 0 ? `#${game.HomeTeamRank}` : "NR"}
              </Text>
            )}
                <Text variant="alternate">{game.HomeTeamName}</Text>
                <Text variant="h3">{game.HomeTeamMascot}</Text>
              </div>
              <Text variant="h1">{game.HomeTeamScore}</Text>
            </div>
            <div className="flex flex-col pt-2">
              <Text variant="xs">{score.HomeOffensiveScheme} | {score.HomeDefensiveScheme}</Text>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-center">
              <Text variant="body" classes="font-semibold">
                Final
              </Text>
            </div>
            <div className="grid">
              <div className="grid grid-cols-7 gap-4 border-b">
                <div className="text-center col-span-2"></div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">1</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">2</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">3</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">4</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">T</Text>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                <div className="text-left col-span-2">
                  <Text variant="body-small">{game.HomeTeamAbbr}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q1Home}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q2Home}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q3Home}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q4Home}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{game.HomeTeamScore}</Text>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                <div className="text-left col-span-2">
                  <Text variant="body-small">{game.AwayTeamAbbr}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q1Away}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q2Away}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q3Away}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{score.Q4Away}</Text>
                </div>
                <div className="text-center col-span-1">
                  <Text variant="body-small">{game.AwayTeamScore}</Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <Text variant="h1">{game.AwayTeamScore}</Text>
              <div className="flex flex-col text-right">
              {!isPro && (
                <Text variant="small" classes="opacity-50">
                  {game.AwayTeamRank > 0 ? `#${game.AwayTeamRank}` : "NR"}
                </Text>
              )}
                <Text variant="alternate">{game.AwayTeamName}</Text>
                <Text variant="h3">{game.AwayTeamMascot}</Text>
              </div>
              <Logo url={game.AwayTeamLogo} classes="w-full h-full" />
            </div>
            <div className="flex flex-col pt-2">
              <Text variant="xs">{score.AwayOffensiveScheme} | {score.AwayDefensiveScheme}</Text>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start rounded-lg p-2" style={{ backgroundColor: borderColor }}>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-start p-4 w-full">
              <div className="flex gap-2 items-center w-full pb-2">
                <Logo variant="tiny" classes="opacity-80" url={game.HomeTeamLogo} />
                <Text variant="body-small" classes="font-semibold">{game.HomeTeamName} Passing</Text>
              </div>
              <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                <div className="grid grid-cols-11 gap-2 font-semibold py-1 border-b">
                  <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                  <Text variant="xs">CMP</Text>
                  <Text variant="xs">ATT</Text>
                  <Text variant="xs">YDS</Text>
                  <Text variant="xs">YDS/ATT</Text>
                  <Text variant="xs">TD</Text>
                  <Text variant="xs">INT</Text>
                  <Text variant="xs">RTG</Text>
                  <Text variant="xs">SCK</Text>
                </div>
                {viewableHomePlayers?.PassingStats.map((player, index) => {
                  const passingYards = player.PassingYards ?? 0;
                  const passAttempts = player.PassAttempts ?? 0;
                  const passCompletions = player.PassCompletions ?? 0;
                  const passingTDs = player.PassingTDs ?? 0;
                  const interceptions = player.Interceptions ?? 0;
                  const sacks = player.Sacks ?? 0;

                  const yardsPerAttempt = passAttempts
                    ? (passingYards / passAttempts).toFixed(2)
                    : "0.00";

                  const qbr = getPasserRating(
                    isPro,
                    passCompletions,
                    passAttempts,
                    passingYards,
                    passingTDs,
                    interceptions
                  );

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-11 gap-2 text-sm border-b py-1"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? borderColor : "transparent",
                      }}
                    >
                      <Text variant="xs" classes="col-span-3 text-left">
                      {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                      </Text>
                      <Text variant="xs">{passCompletions}</Text>
                      <Text variant="xs">{passAttempts}</Text>
                      <Text variant="xs">{passingYards}</Text>
                      <Text variant="xs">{yardsPerAttempt}</Text>
                      <Text variant="xs">{passingTDs}</Text>
                      <Text variant="xs">{interceptions}</Text>
                      <Text variant="xs">{qbr}</Text>
                      <Text variant="xs">{sacks}</Text>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-start p-4 w-full">
              <div className="flex gap-2 items-center w-full pb-2">
                <Logo variant="tiny" classes="opacity-80" url={game.AwayTeamLogo} />
                <Text variant="body-small" classes="font-semibold">{game.AwayTeamName} Passing</Text>
              </div>
              <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                <div className="grid grid-cols-11 gap-2 font-semibold py-1 border-b">
                  <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                  <Text variant="xs">CMP</Text>
                  <Text variant="xs">ATT</Text>
                  <Text variant="xs">YDS</Text>
                  <Text variant="xs">YDS/ATT</Text>
                  <Text variant="xs">TD</Text>
                  <Text variant="xs">INT</Text>
                  <Text variant="xs">RTG</Text>
                  <Text variant="xs">SCK</Text>
                </div>
                {viewableAwayPlayers?.PassingStats.map((player, index) => {
                  const passingYards = player.PassingYards ?? 0;
                  const passAttempts = player.PassAttempts ?? 0;
                  const passCompletions = player.PassCompletions ?? 0;
                  const passingTDs = player.PassingTDs ?? 0;
                  const interceptions = player.Interceptions ?? 0;
                  const sacks = player.Sacks ?? 0;

                  const yardsPerAttempt = passAttempts
                    ? (passingYards / passAttempts).toFixed(2)
                    : "0.00";

                  const qbr = getPasserRating(
                    isPro,
                    passCompletions,
                    passAttempts,
                    passingYards,
                    passingTDs,
                    interceptions
                  );

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-11 gap-2 text-sm border-b py-1"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? borderColor : "transparent",
                      }}
                    >
                      <Text variant="xs" classes="col-span-3 text-left">
                      {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                      </Text>
                      <Text variant="xs">{passCompletions}</Text>
                      <Text variant="xs">{passAttempts}</Text>
                      <Text variant="xs">{passingYards}</Text>
                      <Text variant="xs">{yardsPerAttempt}</Text>
                      <Text variant="xs">{passingTDs}</Text>
                      <Text variant="xs">{interceptions}</Text>
                      <Text variant="xs">{qbr}</Text>
                      <Text variant="xs">{sacks}</Text>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export const HockeyGameModal = ({ league, game, isPro, playerMap }: GameModalProps) => {
  const scheduleService = new FBAScheduleService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [homePlayers, setHomePlayers] = useState<CHLPlayerGameStats[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<CHLPlayerGameStats[]>([]);
  const [viewableHomePlayers, setViewableHomePlayers] =
    useState<HockeyFilteredStats | null>(null);
  const [viewableAwayPlayers, setViewableAwayPlayers] =
    useState<HockeyFilteredStats | null>(null);
  const [playByPlays, setPlayByPlays] = useState<PlayByPlay[]>([]);
  const [view, setView] = useState<string>(BoxScore);
  const [header, setHeader] = useState<string>("Box Score");
  const [score, setScore] = useState<any | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const backgroundColor = "#1f2937";
  const borderColor = darkenColor(backgroundColor, -5);
  const homeScoreColor = game.HomeTeamScore > game.AwayTeamScore || game.HomeTeamShootoutScore > game.AwayTeamShootoutScore ? "#189E5B" : "#ef4444";
  const awayScoreColor = game.AwayTeamScore > game.HomeTeamScore || game.AwayTeamShootoutScore > game.HomeTeamShootoutScore ? "#189E5B" : "#ef4444";
  const shootoutScore = game.HomeTeamShootoutScore + game.AwayTeamShootoutScore;
  let isShootout = shootoutScore > 0 ? true : false;

  useEffect(() => {
    if (!game || game.ID <= 0) return;
    GetMatchResults();
  }, [game]);

  const GetMatchResults = async (): Promise<void> => {
    setIsLoading(true);
  
    let response: GameResultsResponse;
    if (isPro) {
      response = await scheduleService.GetPHLGameResultData(game.ID);
    } else {
      response = await scheduleService.GetCHLGameResultData(game.ID);
    }
  
    const filteredHomePlayerList = isPro
      ? FilterStatsData(response.PHLHomeStats)
      : FilterStatsData(response.CHLHomeStats);
  
    const filteredAwayPlayerList = isPro
      ? FilterStatsData(response.PHLAwayStats)
      : FilterStatsData(response.CHLAwayStats);
  
    setViewableHomePlayers(filteredHomePlayerList);
    setViewableAwayPlayers(filteredAwayPlayerList);
  
    if (isPro) {
      setHomePlayers(response.PHLHomeStats);
      setAwayPlayers(response.PHLAwayStats);
    } else {
      setHomePlayers(response.CHLHomeStats);
      setAwayPlayers(response.CHLAwayStats);
    }
  
    const pbp: PlayByPlay[] = isPro
      ? [...response.PHLPlayByPlays]
      : [...response.CHLPlayByPlays];
  
    setPlayByPlays(pbp);
    console.log(pbp)
    setScore(response.Score);
    setIsLoading(false);
  };

  const FilterStatsData = (dataSet: any[]): HockeyFilteredStats => {
    const obj: HockeyFilteredStats = {
      ForwardsStats: [],
      DefensemenStats: [],
      GoalieStats: [],
    };
  
    if (dataSet.length > 0) {
      obj.ForwardsStats = dataSet
        .filter((x) => x.TimeOnIce && x.TimeOnIce > 0)
        .filter((x) => {
          const playerDetails = playerMap[x.TeamID]?.[x.PlayerID];
          return playerDetails?.Position === "F" || playerDetails?.Position === "C";
        })
        .map((player) => {
          const playerDetails = playerMap[player.TeamID]?.[player.PlayerID];
          return {
            ...player,
            FirstName: playerDetails?.FirstName ?? "Unknown",
            LastName: playerDetails?.LastName ?? "Unknown",
            Position: playerDetails?.Position ?? "Unknown",
          };
        })
        .sort((a, b) => b.TimeOnIce - a.TimeOnIce);
    
      obj.DefensemenStats = dataSet
        .filter((x) => x.TimeOnIce && x.TimeOnIce > 0)
        .filter((x) => {
          const playerDetails = playerMap[x.TeamID]?.[x.PlayerID];
          return playerDetails?.Position === "D";
        })
        .map((player) => {
          const playerDetails = playerMap[player.TeamID]?.[player.PlayerID];
          return {
            ...player,
            FirstName: playerDetails?.FirstName ?? "Unknown",
            LastName: playerDetails?.LastName ?? "Unknown",
            Position: playerDetails?.Position ?? "Unknown",
          };
        })
        .sort((a, b) => b.TimeOnIce - a.TimeOnIce);
    
      obj.GoalieStats = dataSet
        .filter((x) => x.TimeOnIce && x.TimeOnIce > 0)
        .filter((x) => {
          const playerDetails = playerMap[x.TeamID]?.[x.PlayerID];
          return playerDetails?.Position === "G";
        })
        .map((player) => {
          const playerDetails = playerMap[player.TeamID]?.[player.PlayerID];
          return {
            ...player,
            FirstName: playerDetails?.FirstName ?? "Unknown",
            LastName: playerDetails?.LastName ?? "Unknown",
            Position: playerDetails?.Position ?? "Unknown",
          };
        })
        .sort((a, b) => b.TimeOnIce - a.TimeOnIce);
    }
  
    return obj;
  };

  return (
    <>
    {isLoading ? (
      <div className="flex justify-center items-center">
        <Text variant="small">
          Loading...
        </Text>
      </div>
      ) : (
      <div className="flex flex-col items-center">
        <div className="flex flex-col sm:gap-2">  
          <div className="flex w-full justify-around px-2">
            <div className="flex flex-col items-center w-1/3">
              <div className="flex items-center h-full gap-1 sm:gap-4">
                <Logo url={game.HomeTeamLogo} classes="w-full h-full" />
                <div className="flex flex-col text-left sm:pr-8">
                  <Text variant="small" classes="opacity-50">
                    {game.HomeTeamRank > 0 ? `#${game.HomeTeamRank}` : "NR"}
                  </Text>
                  <Text variant="alternate">{game.HomeTeamName}</Text>
                  <Text variant="h3-alt" classes="font-semibold">{game.HomeTeamMascot}</Text>
                </div>
                <div className="flex flex-col pr-2 sm:pr-0">
                {isShootout && (
                  <Text variant="xs" style={{ color: homeScoreColor }}>{`(${game.HomeTeamShootoutScore})`}</Text>
                )}
                  <Text variant="h1-alt" style={{ color: homeScoreColor }}>{game.HomeTeamScore}</Text>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-center">
                <Text variant="body" classes="font-semibold">
                  Final
                </Text>
              </div>
              <div className="grid">
              <div
                className={`grid ${
                  (score.HomeShootoutScore > 0 || score.AwayShootoutScore > 0 || score.OTHome > 0 || score.OTAway > 0)
                    ? "grid-cols-7"
                    : "grid-cols-6"
                } gap-4 border-b`}
              >
                <div className="text-center col-span-2"></div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">1</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">2</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">3</Text>
                  </div>
                  {score.OTHome > 0 || score.OTAway > 0 ? (
                  <div className="text-center col-span-1">
                    <Text variant="body-small">OT</Text>
                  </div>
                ) : score.HomeShootoutScore > 0 || score.AwayShootoutScore > 0 ? (
                  <div className="text-center col-span-1">
                    <Text variant="body-small">SO</Text>
                  </div>
                ) : null}
                  <div className="text-center col-span-1">
                    <Text variant="body-small">T</Text>
                  </div>
                </div>
                <div
                  className={`grid ${
                    score.OTHome > 0 || score.OTAway > 0 || score.HomeShootoutScore > 0 || score.AwayShootoutScore > 0
                      ? "grid-cols-7"
                      : "grid-cols-6"
                  } gap-3`}
                >
                  <div className="text-left col-span-2">
                    <Text variant="body-small">{game.HomeTeamAbbr}</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{score.P1Home}</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{score.P2Home}</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{score.P3Home}</Text>
                  </div>
                  {score.OTHome > 0 || score.OTAway > 0 ? (
                    <div className="text-center col-span-1">
                      <Text variant="body-small">{score.OTHome}</Text>
                    </div>
                  ) : score.HomeShootoutScore > 0 || score.AwayShootoutScore > 0 ? (
                    <div className="text-center col-span-1">
                      <Text variant="body-small">{score.HomeShootoutScore}</Text>
                    </div>
                  ) : null}
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{game.HomeTeamScore}</Text>
                  </div>
                </div>

                <div
                  className={`grid ${
                    score.OTHome > 0 || score.OTAway > 0 || score.HomeShootoutScore > 0 || score.AwayShootoutScore > 0
                      ? "grid-cols-7"
                      : "grid-cols-6"
                  } gap-3`}
                >
                  <div className="text-left col-span-2">
                    <Text variant="body-small">{game.AwayTeamAbbr}</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{score.P1Away}</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{score.P2Away}</Text>
                  </div>
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{score.P3Away}</Text>
                  </div>
                  {score.OTHome > 0 || score.OTAway > 0 ? (
                    <div className="text-center col-span-1">
                      <Text variant="body-small">{score.OTAway}</Text>
                    </div>
                  ) : score.HomeShootoutScore > 0 || score.AwayShootoutScore > 0 ? (
                    <div className="text-center col-span-1">
                      <Text variant="body-small">{score.AwayShootoutScore}</Text>
                    </div>
                  ) : null}
                  <div className="text-center col-span-1">
                    <Text variant="body-small">{game.AwayTeamScore}</Text>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-2 py-2">
                <ToggleSwitch
                  onChange={(checked) => {
                    setView(checked ? PBP : BoxScore);
                    setIsChecked(checked);
                  }}
                  checked={isChecked}
                />
                <Text variant="small">Play By Play</Text>
              </div>
            </div>
            <div className="flex flex-col items-center w-1/3">
              <div className="flex items-center h-full gap-1 sm:gap-4">
                <div className="flex flex-col pl-2 sm:pl-0">
                {isShootout && (
                  <Text variant="xs" style={{ color: awayScoreColor }}>{`(${game.AwayTeamShootoutScore})`}</Text>
                )}
                  <Text variant="h1-alt" style={{ color: awayScoreColor }}>{game.AwayTeamScore}</Text>
                </div>
                <div className="flex flex-col text-right sm:pl-8">
                  <Text variant="small" classes="opacity-50">
                    {game.AwayTeamRank > 0 ? `#${game.AwayTeamRank}` : "NR"}
                  </Text>
                  <Text variant="alternate">{game.AwayTeamName}</Text>
                  <Text variant="h3-alt" classes="font-semibold">{game.AwayTeamMascot}</Text>
                </div>
                <Logo url={game.AwayTeamLogo} classes="w-full h-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-lg p-2 justify-start w-full"  
               style={{ backgroundColor: borderColor }}>
          {view === BoxScore && (
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-4">
                <div className="flex flex-col items-center justify-start w-full">
                  <div className="flex flex-col p-2 sm:p-4 w-full">
                    <div className="flex gap-2 w-full pb-2">
                      <Logo variant="tiny" classes="opacity-80" url={game.HomeTeamLogo} />
                      <Text variant="body-small" classes="font-semibold">{game.HomeTeamName} Forwards</Text>
                    </div>
                    <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                      <div className="grid grid-cols-12 gap-2 font-semibold py-1 border-b">
                        <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                        <Text variant="xs">G</Text>
                        <Text variant="xs">A</Text>
                        <Text variant="xs">P</Text>
                        <Text variant="xs">+/-</Text>
                        <Text variant="xs">TOI</Text>
                        <Text variant="xs">PPG</Text>
                        <Text variant="xs">BLK</Text>
                        <Text variant="xs">HITS</Text>
                        <Text variant="xs">FO%</Text>
                      </div>
                      {viewableHomePlayers?.ForwardsStats.map((player, index) => {
                        const goals = player.Goals ?? 0;
                        const assists = player.Assists ?? 0;
                        const points = player.Points ?? 0;
                        const plusminus = player.PlusMinus ?? 0;
                        const penaltysecs = player.PenaltyMinutes ?? 0;
                        const toiSeconds = player.TimeOnIce ?? 0;
                        const ppg = player.PowerPlayGoals ?? 0;
                        const shots = player.Shots ?? 0;
                        const blocks = player.ShotsBlocked ?? 0;
                        const hits = (player.BodyChecks ?? 0) + (player.StickChecks ?? 0);
                        const faceoff = player.FaceOffWinPercentage.toFixed(1);
                        const minutes = Math.floor(toiSeconds / 60);
                        const seconds = toiSeconds % 60;
                        const toi = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 text-sm border-b py-1"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? borderColor : "transparent",
                            }}
                          >
                            <Text variant="xs" classes="col-span-3 text-left">
                            {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                            </Text>
                            <Text variant="xs">{goals}</Text>
                            <Text variant="xs">{assists}</Text>
                            <Text variant="xs">{points}</Text>
                            <Text variant="xs">{plusminus}</Text>
                            <Text variant="xs">{toi}</Text>
                            <Text variant="xs">{ppg}</Text>
                            <Text variant="xs">{blocks}</Text>
                            <Text variant="xs">{hits}</Text>
                            <Text variant="xs">{faceoff}</Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col p-2 sm:p-4 w-full">
                    <div className="flex gap-2 items-center w-full pb-2">
                      <Logo variant="tiny" classes="opacity-80" url={game.AwayTeamLogo} />
                      <Text variant="body-small" classes="font-semibold">{game.AwayTeamName} Fowards</Text>
                    </div>
                    <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                      <div className="grid grid-cols-12 gap-2 font-semibold py-1 border-b">
                        <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                        <Text variant="xs">G</Text>
                        <Text variant="xs">A</Text>
                        <Text variant="xs">P</Text>
                        <Text variant="xs">+/-</Text>
                        <Text variant="xs">TOI</Text>
                        <Text variant="xs">PPG</Text>
                        <Text variant="xs">BLK</Text>
                        <Text variant="xs">HITS</Text>
                        <Text variant="xs">FO%</Text>
                      </div>
                      {viewableAwayPlayers?.ForwardsStats.map((player, index) => {
                        const goals = player.Goals ?? 0;
                        const assists = player.Assists ?? 0;
                        const points = player.Points ?? 0;
                        const plusminus = player.PlusMinus ?? 0;
                        const penaltymins = player.PenaltyMinutes ?? 0;
                        const toiSeconds = player.TimeOnIce ?? 0;
                        const ppg = player.PowerPlayGoals ?? 0;
                        const shots = player.Shots ?? 0;
                        const blocks = player.ShotsBlocked ?? 0;
                        const hits = (player.BodyChecks ?? 0) + (player.StickChecks ?? 0);
                        const faceoff = player.FaceOffWinPercentage.toFixed(1);
                        const minutes = Math.floor(toiSeconds / 60);
                        const seconds = toiSeconds % 60;
                        const toi = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 text-sm border-b py-1"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? borderColor : "transparent",
                            }}
                          >
                            <Text variant="xs" classes="col-span-3 text-left">
                            {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                            </Text>
                            <Text variant="xs">{goals}</Text>
                            <Text variant="xs">{assists}</Text>
                            <Text variant="xs">{points}</Text>
                            <Text variant="xs">{plusminus}</Text>
                            <Text variant="xs">{toi}</Text>
                            <Text variant="xs">{ppg}</Text>
                            <Text variant="xs">{blocks}</Text>
                            <Text variant="xs">{hits}</Text>
                            <Text variant="xs">{faceoff}</Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col p-2 sm:p-4 w-full">
                    <div className="flex gap-2 items-center w-full pb-2">
                      <Logo variant="tiny" classes="opacity-80" url={game.HomeTeamLogo} />
                      <Text variant="body-small" classes="font-semibold">{game.HomeTeamName} Defensemen</Text>
                    </div>
                    <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                      <div className="grid grid-cols-12 gap-2 font-semibold py-1 border-b">
                        <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                        <Text variant="xs">G</Text>
                        <Text variant="xs">A</Text>
                        <Text variant="xs">P</Text>
                        <Text variant="xs">+/-</Text>
                        <Text variant="xs">TOI</Text>
                        <Text variant="xs">PPG</Text>
                        <Text variant="xs">BLK</Text>
                        <Text variant="xs">HITS</Text>
                        <Text variant="xs">FO%</Text>
                      </div>
                      {viewableHomePlayers?.DefensemenStats.map((player, index) => {
                        const goals = player.Goals ?? 0;
                        const assists = player.Assists ?? 0;
                        const points = player.Points ?? 0;
                        const plusminus = player.PlusMinus ?? 0;
                        const penaltysecs = player.PenaltyMinutes ?? 0;
                        const toiSeconds = player.TimeOnIce ?? 0;
                        const ppg = player.PowerPlayGoals ?? 0;
                        const shots = player.Shots ?? 0;
                        const blocks = player.ShotsBlocked ?? 0;
                        const hits = (player.BodyChecks ?? 0) + (player.StickChecks ?? 0);
                        const faceoff = player.FaceOffWinPercentage.toFixed(1);
                        const minutes = Math.floor(toiSeconds / 60);
                        const seconds = toiSeconds % 60;
                        const toi = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 text-sm border-b py-1"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? borderColor : "transparent",
                            }}
                          >
                            <Text variant="xs" classes="col-span-3 text-left w-full">
                            {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                            </Text>
                            <Text variant="xs">{goals}</Text>
                            <Text variant="xs">{assists}</Text>
                            <Text variant="xs">{points}</Text>
                            <Text variant="xs">{plusminus}</Text>
                            <Text variant="xs">{toi}</Text>
                            <Text variant="xs">{ppg}</Text>
                            <Text variant="xs">{blocks}</Text>
                            <Text variant="xs">{hits}</Text>
                            <Text variant="xs">{faceoff}</Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col p-2 sm:p-4 w-full">
                    <div className="flex gap-2 items-center w-full pb-2">
                      <Logo variant="tiny" classes="opacity-80" url={game.AwayTeamLogo} />
                      <Text variant="body-small" classes="font-semibold">{game.AwayTeamName} Defensemen</Text>
                    </div>
                    <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                      <div className="grid grid-cols-12 gap-2 font-semibold py-1 border-b">
                        <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                        <Text variant="xs">G</Text>
                        <Text variant="xs">A</Text>
                        <Text variant="xs">P</Text>
                        <Text variant="xs">+/-</Text>
                        <Text variant="xs">TOI</Text>
                        <Text variant="xs">PPG</Text>
                        <Text variant="xs">BLK</Text>
                        <Text variant="xs">HITS</Text>
                        <Text variant="xs">FO%</Text>
                      </div>
                      {viewableAwayPlayers?.DefensemenStats.map((player, index) => {
                        const goals = player.Goals ?? 0;
                        const assists = player.Assists ?? 0;
                        const points = player.Points ?? 0;
                        const plusminus = player.PlusMinus ?? 0;
                        const penaltysecs = player.PenaltyMinutes ?? 0;
                        const toiSeconds = player.TimeOnIce ?? 0;
                        const ppg = player.PowerPlayGoals ?? 0;
                        const shots = player.Shots ?? 0;
                        const blocks = player.ShotsBlocked ?? 0;
                        const hits = (player.BodyChecks ?? 0) + (player.StickChecks ?? 0);
                        const faceoff = player.FaceOffWinPercentage.toFixed(1);
                        const minutes = Math.floor(toiSeconds / 60);
                        const seconds = toiSeconds % 60;
                        const toi = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 text-sm border-b py-1"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? borderColor : "transparent",
                            }}
                          >
                            <Text variant="xs" classes="col-span-3 text-left w-full">
                            {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                            </Text>
                            <Text variant="xs">{goals}</Text>
                            <Text variant="xs">{assists}</Text>
                            <Text variant="xs">{points}</Text>
                            <Text variant="xs">{plusminus}</Text>
                            <Text variant="xs">{toi}</Text>
                            <Text variant="xs">{ppg}</Text>
                            <Text variant="xs">{blocks}</Text>
                            <Text variant="xs">{hits}</Text>
                            <Text variant="xs">{faceoff}</Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col p-2 sm:p-4 w-full">
                    <div className="flex gap-2 items-center w-full pb-2">
                      <Logo variant="tiny" classes="opacity-80" url={game.HomeTeamLogo} />
                      <Text variant="body-small" classes="font-semibold">{game.HomeTeamName} Goalies</Text>
                    </div>
                    <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                      <div className="grid grid-cols-10 gap-2 font-semibold py-1 border-b">
                        <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                        <Text variant="xs">SA</Text>
                        <Text variant="xs">GA</Text>
                        <Text variant="xs">SV</Text>
                        <Text variant="xs">SV%</Text>
                        <Text variant="xs">+/-</Text>
                        <Text variant="xs">TOI</Text>
                      </div>
                      {viewableHomePlayers?.GoalieStats.map((player, index) => {
                        const shotsagainst = player.ShotsAgainst ?? 0;
                        const goalsagainst = player.GoalsAgainst ?? 0;
                        const saves = player.Saves ?? 0;
                        const savepercentage = player.SavePercentage.toFixed(3) ?? 0;
                        const plusminus = player.PlusMinus ?? 0;
                        const toiSeconds = player.TimeOnIce ?? 0;
                        const minutes = Math.floor(toiSeconds / 60);
                        const seconds = toiSeconds % 60;
                        const toi = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-10 gap-2 text-sm border-b py-1"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? borderColor : "transparent",
                            }}
                          >
                            <Text variant="xs" classes="col-span-3 text-left w-full">
                            {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                            </Text>
                            <Text variant="xs">{shotsagainst}</Text>
                            <Text variant="xs">{goalsagainst}</Text>
                            <Text variant="xs">{saves}</Text>
                            <Text variant="xs">{savepercentage}</Text>
                            <Text variant="xs">{plusminus}</Text>
                            <Text variant="xs">{toi}</Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col p-2 sm:p-4 w-full">
                    <div className="flex gap-2 items-center w-full pb-2">
                      <Logo variant="tiny" classes="opacity-80" url={game.AwayTeamLogo} />
                      <Text variant="body-small" classes="font-semibold">{game.AwayTeamName} Goalies</Text>
                    </div>
                    <div className="grid rounded-lg border-t px-1" style={{ backgroundColor }}>
                      <div className="grid grid-cols-10 gap-2 font-semibold py-1 border-b">
                        <Text variant="xs" classes="col-span-3 text-left">Player</Text>
                        <Text variant="xs">SA</Text>
                        <Text variant="xs">GA</Text>
                        <Text variant="xs">SV</Text>
                        <Text variant="xs">SV%</Text>
                        <Text variant="xs">+/-</Text>
                        <Text variant="xs">TOI</Text>
                      </div>
                      {viewableAwayPlayers?.GoalieStats.map((player, index) => {
                        const shotsagainst = player.ShotsAgainst ?? 0;
                        const goalsagainst = player.GoalsAgainst ?? 0;
                        const saves = player.Saves ?? 0;
                        const savepercentage = player.SavePercentage.toFixed(3) ?? 0;
                        const plusminus = player.PlusMinus ?? 0;
                        const toiSeconds = player.TimeOnIce ?? 0;
                        const minutes = Math.floor(toiSeconds / 60);
                        const seconds = toiSeconds % 60;
                        const toi = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-10 gap-2 text-sm border-b py-1"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? borderColor : "transparent",
                            }}
                          >
                            <Text variant="xs" classes="col-span-3 text-left w-full">
                            {player.Position ?? "N/A"} {player.FirstName ?? ""} {player.LastName ?? ""}
                            </Text>
                            <Text variant="xs">{shotsagainst}</Text>
                            <Text variant="xs">{goalsagainst}</Text>
                            <Text variant="xs">{saves}</Text>
                            <Text variant="xs">{savepercentage}</Text>
                            <Text variant="xs">{plusminus}</Text>
                            <Text variant="xs">{toi}</Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          {view === PBP && (
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-2 font-semibold py-1 border-b">
                <Text variant="xs" classes="text-center">#</Text>
                <Text variant="xs" classes="text-center">Period</Text>
                <Text variant="xs" classes="text-center">Time</Text>
                <Text variant="xs" classes="text-center">Event</Text>
                <Text variant="xs" classes="col-span-2 text-center">Zone</Text>
                <Text variant="xs" classes="col-span-4 text-center">Description</Text>
                <Text variant="xs" classes="col-span-2 text-center">Score</Text>
              </div>
          {playByPlays.map((play, index) => {
            const nextPlay = playByPlays[index + 1];
            const isScoreChange =
              nextPlay &&
              (play.HomeTeamScore !== nextPlay.HomeTeamScore ||
                play.AwayTeamScore !== nextPlay.AwayTeamScore);
            const score = `${play.HomeTeamScore}-${play.AwayTeamScore}`;
            const bgColor = isScoreChange ? "#189E5B" : index % 2 === 0 ? backgroundColor : "transparent";
            const textColor = isScoreChange ? { color: backgroundColor, fontWeight: "700" } : { color: "inherit" };
            return (
              <div
                key={play.PlayNumber}
                className="grid grid-cols-12 gap-2 text-sm border-b py-1"
                style={{ backgroundColor: bgColor }}
              >
                <Text variant="xs" classes="text-center" style={textColor}>{play.PlayNumber}</Text>
                <Text variant="xs" classes="text-center" style={textColor}>{play.Period}</Text>
                <Text variant="xs" classes="text-center" style={textColor}>{play.TimeOnClock}</Text>
                <Text variant="xs" classes="text-center" style={textColor}>{play.Event}</Text>
                <Text variant="xs" classes="col-span-2 text-center" style={textColor}>{play.Zone}</Text>
                <Text variant="xs" classes="col-span-4 text-left" style={textColor}>{play.Result}</Text>
                <Text variant="xs" classes="col-span-2 text-center" style={textColor}>{score}</Text>
              </div>
            );
          })}
            </div>
          )}
          </div>
        </div>
      </div>
      )}
    </>
  );
};
