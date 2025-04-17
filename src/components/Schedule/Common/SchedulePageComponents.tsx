import { getLogo } from "../../../_utility/getLogo";
import { Text } from "../../../_design/Typography";
import { Logo } from "../../../_design/Logo";
import { darkenColor } from "../../../_utility/getDarkerColor";
import { RevealFBResults } from "../../../_helper/teamHelper";
import { StandingsTable } from "../../Common/Tables";
import { Button } from "../../../_design/Buttons";
import { League } from "../../../_constants/constants";
import { SectionCards } from "../../../_design/SectionCards";
import { InformationCircle } from "../../../_design/Icons";
import PlayerPicture from "../../../_utility/usePlayerFaces";

interface TeamScheduleProps {
  team: any;
  week: any;
  currentUser: any;
  league: League
  ts: any;
  schedule: any[];
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const TeamSchedule = ({
  team,
  currentUser,
  week,
  league,
  ts,
  schedule,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: TeamScheduleProps) => {
  const processedSchedule = schedule.map((game) => {
    const revealResult = RevealFBResults(game, ts, league);
    const isHomeGame = game.HomeTeamID === team.ID;
    const opponentLabel = isHomeGame ? game.AwayTeamAbbr : game.HomeTeamAbbr;
    const opponentLogo = getLogo(league, isHomeGame ? game.AwayTeamID : game.HomeTeamID, false);

    let userWin = false;
    let userLoss = false;
    let gameScore = "TBC";
    let headerGameScore = "TBC";

    if (revealResult) {
      const userTeamScore = isHomeGame ? game.HomeTeamScore : game.AwayTeamScore;
      const opponentScore = isHomeGame ? game.AwayTeamScore : game.HomeTeamScore;
      userWin = userTeamScore > opponentScore;
      userLoss = userTeamScore < opponentScore;

      if (game.HomeTeamScore === 0 && game.AwayTeamScore === 0) {
        gameScore = "TBC";
        headerGameScore = "TBC";
      } else {
        gameScore = `${game.HomeTeamScore} - ${game.AwayTeamScore}`;
        headerGameScore = `${userTeamScore} - ${opponentScore}`;
      }
    }

    return {
      ...game,
      opponentLabel,
      opponentLogo,
      userWin,
      userLoss,
      gameScore,
      headerGameScore,
      gameLocation: isHomeGame ? "vs" : "@",
    };
  });

  return (
    <SectionCards
      team={team}
      header={`${team.TeamAbbr} Schedule`}
      classes={`w-3/4 ${textColorClass}`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      textColorClass={textColorClass}
      darkerBackgroundColor={darkerBackgroundColor}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center items-center pb-2">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : (
        <div className="grid">
          <div
            className="grid grid-cols-4 font-semibold border-b-2 pb-2"
            style={{
              borderColor,
              gridTemplateColumns: "3fr 4fr 3fr 1.5fr",
            }}
          >
            <div className="text-left">
              <Text variant="xs" className={`${textColorClass}`}>
                Week
              </Text>
            </div>
            <div className="text-left">
              <Text variant="xs" className={`${textColorClass}`}>
                Opponent
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                Result
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                Actions
              </Text>
            </div>
          </div>
          {processedSchedule.map((game, index) => (
            <div
              key={index}
              className="grid grid-cols-4 py-1 border-b border-b-[#34455d] items-center"
              style={{
                gridTemplateColumns: "3fr 4fr 4fr 1fr",
                backgroundColor: index % 2 === 0 ? darkerBackgroundColor : backgroundColor,
              }}
            >
              <div className="text-left">
                <Text variant="xs" className="font-semibold">
                  Week {game.Week}
                </Text>
              </div>
              <div className="flex items-center justify-start text-center">
                <Text variant="xs" className="font-semibold text-center">
                    {game.gameLocation}
                </Text>
                <div className="flex pl-4">
                  <Logo
                      variant="xs"
                      classes="w-4 h-4 mr-2"
                      containerClass="flex-shrink-0 p-0"
                      url={game.opponentLogo}
                  />
                  <Text variant="xs" className="font-semibold text-center">
                    {game.opponentLabel}
                  </Text>
                </div>
              </div>
              <div className="text-center">
                <Text
                  variant="xs"
                  className={`font-semibold ${
                    game.userWin
                      ? "text-green-500"
                      : game.userLoss
                      ? "text-red-500"
                      : textColorClass
                  } ${game.gameScore === "TBC" ? "opacity-50" : ""}`}
                >
                  {game.headerGameScore}
                </Text>
              </div>
              <div className="text-center">
                <Button
                  size="sm"
                  classes={`flex bg-transparent rounded-full size-10 items-center ${
                    game.gameScore === "TBC" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={game.gameScore === "TBC"}
                >
                  <InformationCircle />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCards>
  );
};

interface TeamStandingsProps {
  standings: any[];
  team: any;
  league: League;
  currentUser: any;
  isLoadingTwo: boolean;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
}

export const TeamStandings = ({ standings, team, 
                                league, currentUser, isLoadingTwo, 
                                backgroundColor, headerColor, borderColor, textColorClass, darkerBackgroundColor }: 
                                TeamStandingsProps) => {
  
  return (
    <SectionCards
      team={team}
      header={`${team.Conference} Standings`}
      classes={`${textColorClass}, h-full`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      darkerBackgroundColor={darkerBackgroundColor}
      textColorClass={textColorClass}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center items-center">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : (
        <div className="grid">
          <div
            className="grid grid-cols-6 font-semibold border-b-2 pb-2"
            style={{
              borderColor,
            }}
          >
            <div className="text-left">
              <Text variant="xs" className={`${textColorClass}`}>
                Rank
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                Team
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                C.W
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                C.L
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                T.W
              </Text>
            </div>
            <div className="text-center">
              <Text variant="xs" className={`${textColorClass}`}>
                T.L
              </Text>
            </div>
          </div>
          {standings.map((standing, index) => (
            <div
              key={index}
              className="grid grid-cols-6 py-1 border-b border-b-[#34455d] items-center"
              style={{ backgroundColor: index % 2 === 0 ? darkerBackgroundColor : backgroundColor, }}
            >
              <div className="text-left pl-1 flex items-center">
                <Text variant="xs" className="font-semibold">
                  {standing.Rank}
                </Text>
              </div>
              <div className="flex text-left pl-1 items-center">
                <Logo
                  variant="xs"
                  classes="w-4 h-4 mr-2"
                  containerClass="flex-shrink-0 p-0"
                  url={getLogo(league, standing.TeamID, false)}
                />
                <Text variant="xs" className="font-semibold">
                  {standing.TeamAbbr}
                </Text>
              </div>
              <div className="text-center flex items-center justify-center">
                <Text variant="xs" className="font-semibold">
                  {standing.ConferenceWins}
                </Text>
              </div>
              <div className="text-center flex items-center justify-center">
                <Text variant="xs" className="font-semibold">
                  {standing.ConferenceLosses}
                </Text>
              </div>
              <div className="text-center flex items-center justify-center">
                <Text variant="xs" className="font-semibold">
                  {standing.TotalWins}
                </Text>
              </div>
              <div className="text-center flex items-center justify-center">
                <Text variant="xs" className="font-semibold">
                  {standing.TotalLosses}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCards>
  );
}

interface LeagueStatsProps {
  league: League;
  topPassers: any[];
  topRushers: any[];
  topReceivers: any[];
  titles: string[];
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const LeagueStats = ({
  league,
  topPassers,
  topRushers,
  topReceivers,
  titles,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: LeagueStatsProps) => {
  const renderStatCard = (title: string, stats: any[]) => (
    <SectionCards
      team={null}
      header={title}
      classes={`${textColorClass}`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      textColorClass={textColorClass}
      darkerBackgroundColor={darkerBackgroundColor}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center items-center min-h-[5em]">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : stats.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {stats.map((player, index) => (
            <div
              key={index}
              className="flex items-center p-2 rounded-lg border"
              style={{ borderColor: headerColor, backgroundColor: darkerBackgroundColor }}
            >
                <div className={`flex my-1 items-center justify-center 
                                    px-3 h-[2rem] min-h-[2rem] md:h-[4rem] w-[5rem] max-w-[5rem] rounded-lg border-2`} 
                                    style={{ borderColor: borderColor, backgroundColor: "white" }}>
                <PlayerPicture playerID={player.id} league={league} team={player.team} />
              </div>
              <div className="flex flex-col text-center items-center w-full">
                <Text variant="xs" classes={`${textColorClass} font-semibold`}>
                  {player.name} ({player.teamAbbr})
                </Text>
                <Text variant="xs" classes={`${textColorClass}`}>
                  {player.stat1}: {player.stat1Value}
                </Text>
                <Text variant="xs" classes={`${textColorClass}`}>
                  {player.stat2}: {player.stat2Value}
                </Text>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Text variant="small" classes={`${textColorClass} pt-2`}>
          No stats available.
        </Text>
      )}
    </SectionCards>
  );

  return (
    <div className="flex flex-col space-y-4">
      {renderStatCard(titles[0], topPassers)}
      {renderStatCard(titles[1], topRushers)}
      {renderStatCard(titles[2], topReceivers)}
    </div>
  );
};