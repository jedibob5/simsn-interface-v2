import { FC, useMemo, useState, useEffect } from "react";
import {
  League,
  ModalAction,
  SimCHL,
  SimPHL,
  SimCFB,
  SimNFL
} from "../../../_constants/constants";
import { Modal } from "../../../_design/Modal";
import { Button, ButtonGroup } from "../../../_design/Buttons";
import { Text } from "../../../_design/Typography";
import { Logo } from "../../../_design/Logo";
import FBAScheduleService from "../../../_services/scheduleService";
import { PlayerStats, GameResult, PlayByPlay, FilteredStats } from "./GameModalInterfaces";

export interface SchedulePageGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League;
  game: any;
  title: string;
}

export const SchedulePageGameModal: FC<SchedulePageGameModalProps> = ({ league, isOpen, onClose, game, title }) => {
  let isPro = false;

  if (league === SimPHL || league === SimNFL){
    isPro = true;
  }

  return (
    <>
      <Modal isOpen={isOpen}
             onClose={onClose}
             title={`${title} Box Score`}
             classes="h-[60vh] min-w-[1200px]">
        {league === SimCHL && (
          <HockeyGameModal game={game} league={league} isPro={isPro} />
        )}
        {league === SimPHL && (
          <HockeyGameModal game={game} league={league} isPro={isPro} />
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
  game: any;
  isPro: boolean;
}

export const FootballGameModal = ({
  league,
  game,
  isPro,
}: GameModalProps) => {

  const scheduleService = new FBAScheduleService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [homePlayers, setHomePlayers] = useState<PlayerStats[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerStats[]>([]);
  const [viewableHomePlayers, setViewableHomePlayers] = useState<FilteredStats | null>(null);
  const [viewableAwayPlayers, setViewableAwayPlayers] = useState<FilteredStats | null>(null);
  const [playByPlays, setPlayByPlays] = useState<PlayByPlay[]>([]);
  const [view, setView] = useState<string>("Box Score");
  const [header, setHeader] = useState<string>("Box Score");
  const [score, setScore] = useState<string | null>(null);

    useEffect(() => {
      if (game !== null) {
          GetMatchResults();
      }
  }, [game]);

  const GetMatchResults = async (): Promise<void> => {
    setIsLoading(true);

    let response: GameResult;
    if (isPro) {
      response = await scheduleService.GetNFLGameResultData(game.ID);
    } else {
      response = await scheduleService.GetCFBGameResultData(game.ID);
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
      obj.PassingStats = dataSet.filter((x) => x.PassAttempts && x.PassAttempts > 0);
      obj.RushingStats = dataSet.filter((x) => x.RushAttempts && x.RushAttempts > 0);
      obj.ReceivingStats = dataSet.filter((x) => x.Targets && x.Targets > 0);
      obj.DefenseStats = dataSet.filter((x) =>
        ["ILB", "OLB", "DT", "DE", "CB", "FS", "SS", "QB"].includes(x.Position)
      );
      obj.SpecialTeamStats = dataSet.filter((x) =>
        ["P", "K", "QB"].includes(x.Position)
      );
      obj.OLineStats = dataSet.filter(
        (x) => (x.Pancakes && x.Pancakes > 0) || (x.SacksAllowed && x.SacksAllowed > 0)
      );
    }

    return obj;
  };

  return (
    <>
      <div className="flex w-full justify-around px-2">
        <div className="flex items-center gap-4">
          <Logo url={game.HomeTeamLogo} classes="w-full h-full" />
          <div className="flex flex-col text-left">
          {game.HomeTeamRank > 0 && (
            <Text variant="small" classes="opacity-50">#{game.HomeTeamRank}</Text>
          )}
            <Text variant="alternate">{game.HomeTeamName}</Text>
            <Text variant="h3">{game.HomeTeamMascot}</Text>
          </div>
          <Text variant="h1">{game.HomeTeamScore}</Text>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Text variant="small" classes="font-semibold">Final</Text>
          </div>
          <div className="grid">
            <div className="grid grid-cols-7 gap-4 border-b">
              <div className="text-center col-span-2">
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">1</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">2</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">3</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">4</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">T</Text>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              <div className="text-left col-span-2">
                <Text variant="xs">{game.HomeTeamAbbr}</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              <div className="text-left col-span-2">
                <Text variant="xs">{game.AwayTeamAbbr}</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Text variant="h1">{game.AwayTeamScore}</Text>
          <div className="flex flex-col text-right">
          {game.AwayTeamRank > 0 && (
            <Text variant="small" classes="opacity-50">#{game.AwayTeamRank}</Text>
          )}
            <Text variant="alternate">{game.AwayTeamName}</Text>
            <Text variant="h3">{game.AwayTeamMascot}</Text>
          </div>
          <Logo url={game.AwayTeamLogo} classes="w-full h-full" />
        </div>
      </div>
    </>
  )
}

export const HockeyGameModal = ({
  league,
  game,
}: GameModalProps) => {

  return (
    <>
      <div className="flex w-full justify-around px-2">
        <div className="flex items-center gap-4">
          <Logo url={game.HomeTeamLogo} classes="w-full h-full" />
          <div className="flex flex-col text-left">
          {game.HomeTeamRank > 0 && (
            <Text variant="small" classes="opacity-50">#{game.HomeTeamRank}</Text>
          )}
            <Text variant="alternate">{game.HomeTeamName}</Text>
            <Text variant="h3">{game.HomeTeamMascot}</Text>
          </div>
          <Text variant="h1">{game.HomeTeamScore}</Text>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Text variant="small" classes="font-semibold">Final</Text>
          </div>
          <div className="grid">
            <div className="grid grid-cols-6 gap-4 border-b">
              <div className="text-center col-span-2">
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">1</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">2</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">3</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">T</Text>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3">
              <div className="text-left col-span-2">
                <Text variant="xs">{game.HomeTeamAbbr}</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3">
              <div className="text-left col-span-2">
                <Text variant="xs">{game.AwayTeamAbbr}</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
              <div className="text-center col-span-1">
                <Text variant="xs">-</Text>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Text variant="h1">{game.AwayTeamScore}</Text>
          <div className="flex flex-col text-right">
          {game.AwayTeamRank > 0 && (
            <Text variant="small" classes="opacity-50">#{game.AwayTeamRank}</Text>
          )}
            <Text variant="alternate">{game.AwayTeamName}</Text>
            <Text variant="h3">{game.AwayTeamMascot}</Text>
          </div>
          <Logo url={game.AwayTeamLogo} classes="w-full h-full" />
        </div>
      </div>
    </>
  )
}