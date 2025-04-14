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

    const isUserTeam = game.HomeTeamID === team.ID || game.AwayTeamID === team.ID;

    const homeLogo = getLogo(league, game.HomeTeamID, currentUser?.isRetro);
    const awayLogo = getLogo(league, game.AwayTeamID, currentUser?.isRetro);

    const homeLabel = game.HomeTeamAbbr;
    const awayLabel = game.AwayTeamAbbr;

    let resultColor = "";
    let gameScore = "";

    if (revealResult) {
      const userTeamScore = game.HomeTeamID === team.ID ? game.HomeTeamScore : game.AwayTeamScore;
      const opponentScore = game.HomeTeamID === team.ID ? game.AwayTeamScore : game.HomeTeamScore;

      resultColor = userTeamScore > opponentScore ? "text-green-500" : "text-red-500";
      gameScore = `${game.HomeTeamScore} - ${game.AwayTeamScore}`;
    }

    return {
      ...game,
      revealResult,
      isUserTeam,
      homeLogo,
      awayLogo,
      homeLabel,
      awayLabel,
      resultColor,
      gameScore,
      gameLocation: "VS",
    };
  });

  return (
    <div className="w-full flex flex-wrap gap-4">
      {isLoadingTwo ? (
        <div className="flex justify-center items-center pb-2">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : processedSchedule.length > 0 ? (
        processedSchedule.map((game, index) => (
          <SectionCards
            key={index}
            team={team}
            header={`Week ${game.Week}`}
            classes={`w-[30em] max-h-[24em] ${textColorClass}`}
            backgroundColor={backgroundColor}
            headerColor={headerColor}
            borderColor={borderColor}
            textColorClass={textColorClass}
            darkerBackgroundColor={darkerBackgroundColor}
          >
            <div className="flex justify-center">
              <div className="flex-col pb-2">
                <Logo variant="large" containerClass="max-w-24 w-24" url={game.homeLogo} />
                <Text
                  variant="small"
                  classes={`${textColorClass} font-semibold`}
                  className="pr-1"
                >
                  {game.homeLabel}
                </Text>
              </div>
              <Text
                variant="small"
                classes={`${textColorClass} self-center font-semibold`}
              >
                {game.gameLocation}
              </Text>
              <div className="flex-col">
                <Logo variant="large" containerClass="max-w-24" url={game.awayLogo} />
                <Text
                  variant="small"
                  classes={`${textColorClass} font-semibold`}
                  className="pl-1"
                >
                  {game.awayLabel}
                </Text>
              </div>
            </div>
            <div className="flex-col items-center">
              {game.revealResult && (
                <Text
                  variant="h6"
                  classes={`${game.resultColor} font-semibold`}
                  style={{
                    textShadow: `0.5px 0.5px 0 ${borderColor}, 
                                 -0.5px -0.5px 0 ${borderColor}, 
                                 0.5px -0.5px 0 ${borderColor}, 
                                 -0.5px 0.5px 0 ${borderColor}`,
                  }}
                >
                  {`${game.gameScore}`}
                </Text>
              )}
              {!game.revealResult && (
                <Text
                  variant="h6"
                  classes={`${game.resultColor} font-semibold`}
                  style={{
                    textShadow: `0.5px 0.5px 0 ${borderColor}, 
                                 -0.5px -0.5px 0 ${borderColor}, 
                                 0.5px -0.5px 0 ${borderColor}, 
                                 -0.5px 0.5px 0 ${borderColor}`,
                  }}
                >
                  {`--`}
                </Text>
              )}
              <Text variant="small">
                {game.IsConference
                  ? game.IsDivisional
                    ? "Conference Divisional Game"
                    : "Conference Game"
                  : "Non-Conference Game"}
              </Text>
              <Text variant="xs">{game.Stadium}, {game.State}</Text>
              <div className="flex justify-center gap-2 py-2">
                <Button size="sm" classes="bg-transparent">
                  <InformationCircle />
                </Button>
              </div>
            </div>
          </SectionCards>
        ))
      ) : (
        <Text variant="small" classes={`${textColorClass} pt-2`}>
          No games available.
        </Text>
      )}
    </div>
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
  
  return(
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
            <Text variant="small" 
                  classes={`${textColorClass}`}>
              Loading...
            </Text>
          </div>
        ) : (
          <StandingsTable standings={standings} 
                          league={league} 
                          team={team} 
                          currentUser={currentUser}
                          rowBgColor={backgroundColor}
                          darkerRowBgColor={darkerBackgroundColor}
                          textColorClass={textColorClass} />
        )}
      </SectionCards>
  )
}