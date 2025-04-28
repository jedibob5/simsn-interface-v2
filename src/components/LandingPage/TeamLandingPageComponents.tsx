import { getLogo } from "../../_utility/getLogo";
import { Text } from "../../_design/Typography";
import { Logo } from "../../_design/Logo";
import { FC, useEffect, useRef } from "react";
import { getTextColorBasedOnBg } from "../../_utility/getBorderClass";
import { darkenColor } from "../../_utility/getDarkerColor";
import {
  GetBKCurrentWeek,
  RevealBBAResults,
  RevealHCKResults,
  RevealResults,
} from "../../_helper/teamHelper";
import { StandingsTable } from "../Common/Tables";
import { SectionCards } from "../../_design/SectionCards";
import { Button, ButtonGroup } from "../../_design/Buttons";
import {
  League,
  SimCBB,
  SimCHL,
  SimNBA,
  SimPHL,
} from "../../_constants/constants";
import PlayerPicture from "../../_utility/usePlayerFaces";
import { getLandingBoxStats } from "./TeamLandingPageHelper";
import { SimCFB, SimNFL } from "../../_constants/constants";
import { useNavigate } from "react-router-dom";
import routes from "../../_constants/routes";
import { useDeepLink } from "../../context/DeepLinkContext";
import { ClickableTeamLabel } from "../Common/Labels";

interface GamesBarProps {
  games: any[];
  league: League;
  team: any;
  ts: any;
  currentUser: any;
  backgroundColor: string;
  borderColor: string;
  headerColor: string;
}

export const GamesBar = ({
  games,
  league,
  team,
  ts,
  currentUser,
  backgroundColor,
  borderColor,
  headerColor,
}: GamesBarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && games.length > 0) {
      const lastCompletedGameIndex = games.findIndex(
        (game) => !game.GameComplete
      );
      const gameWidth = scrollContainerRef.current.scrollWidth / games.length;
      const scrollPosition =
        gameWidth * (lastCompletedGameIndex - 1) -
        scrollContainerRef.current.clientWidth / 2 +
        gameWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [games]);

  if (!games || games.length === 0) {
    return <div></div>;
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const rowRenderer = (item: any, index: number) => {
    const isHomeGame = item.HomeTeamID === team.ID;
    const opponentAbbr = isHomeGame ? item.AwayTeamAbbr : item.HomeTeamAbbr;
    const opponentLogoUrl = getLogo(
      league,
      isHomeGame ? item.AwayTeamID : item.HomeTeamID,
      currentUser.isRetro
    );
    const gameDetails = item.isNeutral
      ? `vs ${opponentAbbr}`
      : isHomeGame
      ? `vs ${opponentAbbr}`
      : `at ${opponentAbbr}`;
    let resultColor = "";

    let revealResult = false;
    if (league === SimCHL || league === SimPHL) {
      revealResult = RevealHCKResults(item, ts);
    } else if (league === SimCBB || league === SimNBA) {
      revealResult = RevealBBAResults(item, ts, GetBKCurrentWeek(league, ts));
    } else {
      revealResult = RevealResults(item, ts, league);
    }

    if (revealResult) {
      if (isHomeGame) {
        resultColor = item.HomeTeamWin ? "bg-[#189E5B]" : "bg-red-500";
      } else {
        resultColor = item.AwayTeamWin ? "bg-[#189E5B]" : "bg-red-500";
      }
      if (!item.HomeTeamWin && !item.AwayTeamWin) {
        resultColor = "";
      }
    }

    const gameScore = revealResult
      ? isHomeGame
        ? `${item.HomeTeamScore}-${item.AwayTeamScore}`
        : `${item.AwayTeamScore}-${item.HomeTeamScore}`
      : "-";

    return (
      <div
        key={index}
        className={`flex flex-col rounded-lg items-center border pb-1 px-2 md:w-28 3xl:w-48 ${resultColor}`}
        style={{ borderColor: headerColor }}
      >
        <div className="flex-col px-2 overflow-auto">
          <div className="flex-col items-center justify-center">
            <Logo
              variant="xs"
              containerClass="pb-1 max-w-[4em] p-4"
              url={opponentLogoUrl}
            />
            <Text variant="small">{gameScore}</Text>
            <Text variant="small" classes="">
              {gameDetails}
            </Text>
          </div>
          <Text variant="xs" classes="pt-1">
            Week {item.Week}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div className="flex pb-1">
      <div className="flex w-[90vw] sm:w-full max-w-[1400px] justify-center">
        <div className="relative flex items-center w-[92vw] md:w-[72.6em] 3xl:w-full pb-1">
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 p-2 rounded-full border-1"
            style={{
              backgroundColor: backgroundColor,
              color: borderColor,
              borderColor: headerColor,
            }}
          >
            &lt;
          </button>
          <div
            ref={scrollContainerRef}
            className="flex flex-row overflow-hidden w-full"
          >
            {games.map((game, index) => (
              <div key={index} className="flex flex-col items-center mx-2">
                {rowRenderer(game, index)}
              </div>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 p-2 rounded-full border-1"
            style={{
              backgroundColor: backgroundColor,
              color: borderColor,
              borderColor: headerColor,
            }}
          >
            &gt;
          </button>
        </div>
      </div>
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

export const TeamStandings = ({
  standings,
  team,
  league,
  currentUser,
  isLoadingTwo,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
}: TeamStandingsProps) => {
  return (
    <SectionCards
      team={team}
      header={`${team.Conference} Standings`}
      classes={`${textColorClass}, h-full max-w-[30rem]`}
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
        <StandingsTable
          standings={standings}
          league={league}
          team={team}
          currentUser={currentUser}
          rowBgColor={backgroundColor}
          darkerRowBgColor={darkerBackgroundColor}
          textColorClass={textColorClass}
        />
      )}
    </SectionCards>
  );
};

interface TeamMatchUpProps {
  team: any;
  week: any;
  league: League;
  ts: any;
  matchUp: any[];
  homeLogo: string;
  awayLogo: string;
  homeLabel: string;
  awayLabel: string;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const TeamMatchUp = ({
  team,
  week,
  league,
  ts,
  matchUp,
  homeLogo,
  awayLogo,
  homeLabel,
  awayLabel,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: TeamMatchUpProps) => {
  let revealResult = false;
  if (matchUp.length > 0) {
    if (league === SimCFB || league === SimNFL) {
      revealResult = RevealResults(matchUp[0], ts, league);
    } else if (league === SimCBB || league === SimNBA) {
      revealResult = RevealBBAResults(
        matchUp[0],
        ts,
        GetBKCurrentWeek(league, ts)
      );
    } else if (league === SimCHL || league === SimPHL) {
      revealResult = RevealHCKResults(matchUp[0], ts);
    }
  }
  let resultColor = "";
  let gameScore = "";
  let gameLocation = "";
  let coaches: string[] = [];
  let isHomeGame = false;
  const navigate = useNavigate();
  let homeID = 0;
  let awayID = 0;
  if (matchUp?.length > 0) {
    const userGame = matchUp[0];
    isHomeGame = matchUp[0].HomeTeamID === team.ID;
    coaches = isHomeGame
      ? [userGame.HomeTeamCoach, userGame.AwayTeamCoach]
      : [userGame.AwayTeamCoach, userGame.HomeTeamCoach];
    homeID = isHomeGame ? userGame.HomeTeamID : userGame.AwayTeamID;
    awayID = isHomeGame ? userGame.AwayTeamID : userGame.HomeTeamID;
    gameLocation = isHomeGame ? "VS" : "AT";

    if (revealResult) {
      const userTeamScore = isHomeGame
        ? matchUp[0].HomeTeamScore
        : matchUp[0].AwayTeamScore;
      const opponentScore = isHomeGame
        ? matchUp[0].AwayTeamScore
        : matchUp[0].HomeTeamScore;
      resultColor =
        userTeamScore > opponentScore ? "text-green-500" : "text-red-500";
      gameScore = `${userTeamScore} - ${opponentScore}`;
    }
  }

  const navigateToFBGameplan = () => {
    if (league === SimCFB) {
      navigate(routes.CFB_GAMEPLAN);
    } else {
      navigate(routes.NFL_GAMEPLAN);
    }
  };

  const navigateToBBGameplan = () => {
    if (league === SimCBB) {
      navigate(routes.CBB_GAMEPLAN);
    } else {
      navigate(routes.NBA_GAMEPLAN);
    }
  };

  const navigateToHCKGameplan = () => {
    if (league === SimCHL) {
      navigate(routes.CHL_GAMEPLAN);
    } else {
      navigate(routes.PHL_GAMEPLAN);
    }
  };

  return (
    <SectionCards
      team={team}
      header={`Next Game`}
      classes={`${textColorClass}`}
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
      ) : matchUp.length > 0 ? (
        <>
          <div className="grid grid-cols-7 items-center text-center pb-4">
            <div className="flex justify-end col-span-3">
              <div className="flex flex-col items-center">
                <Logo
                  variant="large"
                  containerClass="max-w-24 w-24 p-4"
                  url={homeLogo}
                />
                <ClickableTeamLabel
                  label={homeLabel}
                  teamID={homeID}
                  textColorClass={textColorClass}
                  league={league}
                />
                <Text variant="xs" classes="opacity-70">
                  {`HC ${coaches[0]}`}
                </Text>
              </div>
            </div>
            <div className="flex flex-col col-span-1 items-center">
              <Text variant="small" classes={`${textColorClass} font-semibold`}>
                {gameLocation}
              </Text>
            </div>
            <div className="flex justify-start col-span-3">
              <div className="flex flex-col items-center">
                <Logo
                  variant="large"
                  containerClass="max-w-24 w-24 p-4"
                  url={awayLogo}
                />
                <ClickableTeamLabel
                  label={awayLabel}
                  teamID={awayID}
                  textColorClass={textColorClass}
                  league={league}
                />
                <Text variant="xs" classes="opacity-70">
                  {`HC ${coaches[1]}`}
                </Text>
              </div>
            </div>
          </div>
          <div className="flex-col items-center">
            {revealResult && (
              <Text
                variant="h6"
                classes={`${resultColor} font-semibold`}
                style={{
                  textShadow: `0.5px 0.5px 0 ${borderColor}, 
                              -0.5px -0.5px 0 ${borderColor}, 
                              0.5px -0.5px 0 ${borderColor}, 
                              -0.5px 0.5px 0 ${borderColor}`,
                }}
              >
                {`${gameScore}`}
              </Text>
            )}
            <Text variant="small">{`Week ${week}`}</Text>
            <Text variant="small">
              {matchUp[0].IsConference
                ? matchUp[0].IsDivisional
                  ? "Conference Divisional Game"
                  : "Conference Game"
                : "Non-Conference Game"}
            </Text>
            {(league === SimCFB || league === SimNFL) && (
              <div className="flex justify-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={navigateToFBGameplan}
                >
                  Gameplan
                </Button>
              </div>
            )}
            {(league === SimCHL || league === SimPHL) && (
              <div className="flex justify-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={navigateToHCKGameplan}
                >
                  Set Lineup
                </Button>
              </div>
            )}
            {(league === SimCBB || league === SimNBA) && (
              <div className="flex justify-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={navigateToBBGameplan}
                >
                  Set Gameplan
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <Text variant="small" classes={`${textColorClass} pt-2`}>
          You don't have a game coming up.
        </Text>
      )}
    </SectionCards>
  );
};

interface TeamOverviewProps {
  team: any;
  league: League;
  ts: any;
  currentUser: any;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const TeamOverview = ({
  team,
  league,
  ts,
  currentUser,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: TeamOverviewProps) => {
  return (
    <SectionCards
      team={team}
      header="Team Grades"
      classes={`${textColorClass} h-full`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      textColorClass={textColorClass}
      darkerBackgroundColor={darkerBackgroundColor}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center items-center">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : (
        <div className="flex-col p-1 md:p-3">
          <div className="flex flex-col sm:flex-row justify-center sm:items-end sm:gap-4">
            <div className="flex flex-col py-1 pb-4 sm:pb-1 items-center">
              <div
                className={`flex items-center justify-center 
                              size-12 md:size-16 rounded-full border-2`}
                style={{
                  borderColor: headerColor,
                  backgroundColor: darkerBackgroundColor,
                }}
              >
                <Text
                  variant="body"
                  classes={`${textColorClass} font-semibold`}
                >
                  {team.OverallGrade ? team.OverallGrade : "-"}
                </Text>
              </div>
              <Text
                variant="alternate"
                classes={`${textColorClass} font-semibold 
                        whitespace-nowrap`}
              >
                OVR
              </Text>
            </div>
            <div className="flex md:flex-row flex-col py-1 gap-4 justify-center">
              <div className="flex flex-col py-1 items-center">
                <div
                  className={`flex items-center justify-center size-8 md:size-12
                               rounded-full border-2`}
                  style={{
                    borderColor: headerColor,
                    backgroundColor: darkerBackgroundColor,
                  }}
                >
                  <Text
                    variant="small"
                    classes={`${textColorClass} font-semibold`}
                  >
                    {team.OffenseGrade ? team.OffenseGrade : "-"}
                  </Text>
                </div>
                <Text
                  variant="small"
                  classes={`${textColorClass} font-semibold whitespace-nowrap`}
                >
                  OFF
                </Text>
              </div>
              <div className="flex flex-col py-1 items-center">
                <div
                  className={`flex items-center justify-center 
                                size-8 md:size-12 rounded-full border-2`}
                  style={{
                    borderColor: headerColor,
                    backgroundColor: darkerBackgroundColor,
                  }}
                >
                  <Text
                    variant="small"
                    classes={`${textColorClass} font-semibold`}
                  >
                    {team.DefenseGrade ? team.DefenseGrade : "-"}
                  </Text>
                </div>
                <Text
                  variant="small"
                  classes={`${textColorClass} 
                          font-semibold whitespace-nowrap`}
                >
                  DEF
                </Text>
              </div>
              {team.SpecialTeamsGrade && (
                <div className="flex flex-col py-1 items-center">
                  <div
                    className={`flex items-center justify-center 
                                size-8 md:size-12 rounded-full border-2`}
                    style={{
                      borderColor: headerColor,
                      backgroundColor: darkerBackgroundColor,
                    }}
                  >
                    <Text
                      variant="small"
                      classes={`${textColorClass} font-semibold`}
                    >
                      {team.SpecialTeamsGrade ? team.SpecialTeamsGrade : "-"}
                    </Text>
                  </div>
                  <Text
                    variant="small"
                    classes={`${textColorClass} font-semibold 
                          whitespace-nowrap`}
                  >
                    STU
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionCards>
  );
};

interface TeamMailboxProps {
  team: any;
  notifications: any[];
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const TeamMailbox = ({
  team,
  notifications,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: TeamMailboxProps) => {
  return (
    <SectionCards
      team={team}
      header="Team Inbox"
      classes={`${textColorClass} h-full`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      textColorClass={textColorClass}
      darkerBackgroundColor={darkerBackgroundColor}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center items-center">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="mb-2">
            <Text variant="small" classes={`${textColorClass}`}>
              {notification.Subject}
            </Text>
            <Text variant="small" classes={`${textColorClass}`}>
              {notification.Message}
            </Text>
          </div>
        ))
      ) : (
        <Text variant="small" classes={`${textColorClass} pt-2`}>
          Your Inbox is Empty
        </Text>
      )}
    </SectionCards>
  );
};

interface TeamStatsProps {
  team: any;
  league: League;
  header: string;
  teamStats: any;
  titles: any;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const TeamStats = ({
  team,
  league,
  header,
  teamStats,
  titles,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: TeamStatsProps) => {
  const { boxOne, boxTwo, boxThree } = getLandingBoxStats(league, teamStats);
  console.log({ boxOne, boxTwo, boxThree });
  return (
    <SectionCards
      team={team}
      header={header}
      classes={`${textColorClass}`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      textColorClass={textColorClass}
      darkerBackgroundColor={darkerBackgroundColor}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center min-h-[10em]">
          <Text variant="small" classes={`${textColorClass} h-full`}>
            Loading...
          </Text>
        </div>
      ) : Object.keys(teamStats).length > 0 ? (
        <div className="flex-col items-center justify-center py-3 space-y-2 md:space-y-4">
          {boxOne.id !== undefined && (
            <TopPlayer
              box={boxOne}
              team={team}
              league={league}
              title={titles[0]}
              stat1={titles[3]}
              stat2={titles[4]}
              headerColor={headerColor}
              darkerBackgroundColor={darkerBackgroundColor}
              backgroundColor={backgroundColor}
              textColorClass={textColorClass}
              borderColor={borderColor}
            />
          )}
          {boxTwo.id !== undefined && (
            <TopPlayer
              box={boxTwo}
              team={team}
              league={league}
              title={titles[1]}
              stat1={titles[5]}
              stat2={titles[6]}
              headerColor={headerColor}
              darkerBackgroundColor={darkerBackgroundColor}
              backgroundColor={backgroundColor}
              textColorClass={textColorClass}
              borderColor={borderColor}
            />
          )}
          {boxThree.id !== undefined && (
            <TopPlayer
              box={boxThree}
              team={team}
              league={league}
              title={titles[2]}
              stat1={titles[7]}
              stat2={titles[8]}
              headerColor={headerColor}
              darkerBackgroundColor={darkerBackgroundColor}
              backgroundColor={backgroundColor}
              textColorClass={textColorClass}
              borderColor={borderColor}
            />
          )}
        </div>
      ) : (
        <Text variant="small" classes={`${textColorClass} pt-2`}>
          No stats to show
        </Text>
      )}
    </SectionCards>
  );
};

interface TopPlayerProps {
  box: any;
  team: any;
  title: string;
  stat1: string;
  stat2: string;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  league: League;
}

const TopPlayer: FC<TopPlayerProps> = ({
  box,
  team,
  title,
  stat1,
  stat2,
  headerColor,
  darkerBackgroundColor,
  textColorClass,
  borderColor,
  league,
}) => {
  return (
    <div
      className={`flex-col items-center p-2 rounded-lg border-2`}
      style={{
        borderColor: headerColor,
        backgroundColor: darkerBackgroundColor,
      }}
    >
      <div className="flex">
        <div
          className={`flex my-1 items-center justify-center 
      px-3 h-[3rem] min-h-[3rem] max-w-[3rem] md:h-[7rem] md:max-h-[8rem] md:max-w-[8rem] rounded-lg border-2`}
          style={{ borderColor: borderColor, backgroundColor: "white" }}
        >
          <PlayerPicture team={team} playerID={box.id} league={league} />
        </div>
        <div className="flex-col w-3/4">
          <Text variant="body" classes={`${textColorClass} font-semibold`}>
            {title}
          </Text>
          <div
            className="flex w-3/4 py-0.5 border-b mx-auto"
            style={{ borderColor }}
          />
          <div className="flex space-x-1 justify-center">
            <Text variant="small" classes={`${textColorClass} opacity-85`}>
              {`${box.position}`}
            </Text>
            <Text
              variant="small"
              classes={`${textColorClass} font-semibold text-center`}
            >
              {`${box.firstName}`}
            </Text>
            <Text
              variant="small"
              classes={`${textColorClass} font-semibold text-center`}
            >
              {`${box.lastName}`}
            </Text>
          </div>
          <Text variant="alternate" classes={`${textColorClass}`}>
            {`${box.topStat} ${stat1}`}
          </Text>
          <Text variant="alternate" classes={`${textColorClass}`}>
            {`${box.bottomStat} ${stat2}`}
          </Text>
        </div>
      </div>
    </div>
  );
};

interface TeamNewsProps {
  team: any;
  teamNews: any[];
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
  isLoadingTwo: boolean;
}

export const TeamNews = ({
  team,
  teamNews,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
  isLoadingTwo,
}: TeamNewsProps) => {
  return (
    <SectionCards
      team={team}
      header="Team News"
      classes={`${textColorClass} h-full`}
      backgroundColor={backgroundColor}
      headerColor={headerColor}
      borderColor={borderColor}
      textColorClass={textColorClass}
      darkerBackgroundColor={darkerBackgroundColor}
    >
      {isLoadingTwo ? (
        <div className="flex justify-center items-center">
          <Text variant="small" classes={`${textColorClass}`}>
            Loading...
          </Text>
        </div>
      ) : Object.keys(teamNews).length > 0 ? (
        teamNews.map((news, index) => (
          <div key={index} className="flex-col py-1">
            <Text variant="small" classes={`${textColorClass} pr-1`}>
              {news.Message}
            </Text>
            <Text
              variant="small"
              classes={`${textColorClass} text-right opacity-70 pr-2`}
            >
              {`Week ${news.Week} | ${news.MessageType} news`}
            </Text>
          </div>
        ))
      ) : (
        <Text variant="small" classes={`${textColorClass} pt-2`}>
          No News to Show
        </Text>
      )}
    </SectionCards>
  );
};

interface TeamQuickLinksProps {
  league: League;
  team: any;
  backgroundColor: string;
  headerColor: string;
  borderColor: string;
  textColorClass: string;
  darkerBackgroundColor: string;
}

export const TeamQuickLinks: FC<TeamQuickLinksProps> = ({
  team,
  league,
  backgroundColor,
  headerColor,
  borderColor,
  textColorClass,
  darkerBackgroundColor,
}) => {
  const navigate = useNavigate();
  const { goToTeamPage } = useDeepLink();
  return (
    <>
      <SectionCards
        team={team}
        header="Quick Links"
        classes={`${textColorClass} h-full`}
        backgroundColor={backgroundColor}
        headerColor={headerColor}
        borderColor={borderColor}
        textColorClass={textColorClass}
        darkerBackgroundColor={darkerBackgroundColor}
      >
        <ButtonGroup classes="p-1 md:p-3 mt-4">
          {league === SimCFB && (
            <>
              <Button size="sm" onClick={() => goToTeamPage(league)}>
                Roster
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CFB_RECRUITING)}>
                Recruiting
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CFB_SCHEDULE)}>
                Schedule
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CFB_STATS)}>
                Stats
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CFB_TRANSFER)}>
                Portal
              </Button>
            </>
          )}
          {league === SimNFL && (
            <>
              <Button size="sm" onClick={() => goToTeamPage(league)}>
                Roster
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(routes.NFL_FREE_AGENCY)}
              >
                Free Agency
              </Button>
              <Button size="sm" onClick={() => navigate(routes.NFL_SCHEDULE)}>
                Schedule
              </Button>
              <Button size="sm" onClick={() => navigate(routes.NFL_STATS)}>
                Stats
              </Button>
              <Button size="sm" onClick={() => navigate(routes.NFL_DRAFT_ROOM)}>
                Draft
              </Button>
            </>
          )}
          {league === SimCBB && (
            <>
              <Button size="sm" onClick={() => goToTeamPage(league)}>
                Roster
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CBB_RECRUITING)}>
                Recruiting
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CBB_SCHEDULE)}>
                Schedule
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CBB_STATS)}>
                Stats
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CBB_TRANSFER)}>
                Portal
              </Button>
            </>
          )}
          {league === SimNBA && (
            <>
              <Button size="sm" onClick={() => goToTeamPage(league)}>
                Roster
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(routes.NBA_FREE_AGENCY)}
              >
                Free Agency
              </Button>
              <Button size="sm" onClick={() => navigate(routes.NBA_SCHEDULE)}>
                Schedule
              </Button>
              <Button size="sm" onClick={() => navigate(routes.NBA_STATS)}>
                Stats
              </Button>
              <Button size="sm" onClick={() => navigate(routes.NBA_DRAFT_ROOM)}>
                Draft
              </Button>
            </>
          )}
          {league === SimCHL && (
            <>
              <Button size="sm" onClick={() => goToTeamPage(league)}>
                Roster
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CHL_RECRUITING)}>
                Recruiting
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CHL_SCHEDULE)}>
                Schedule
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CHL_STATS)}>
                Stats
              </Button>
              <Button size="sm" onClick={() => navigate(routes.CHL_TRANSFER)}>
                Portal
              </Button>
            </>
          )}
          {league === SimPHL && (
            <>
              <Button size="sm" onClick={() => goToTeamPage(league)}>
                Roster
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(routes.PHL_FREE_AGENCY)}
              >
                Free Agency
              </Button>
              <Button size="sm" onClick={() => navigate(routes.PHL_SCHEDULE)}>
                Schedule
              </Button>
              <Button size="sm" onClick={() => navigate(routes.PHL_STATS)}>
                Stats
              </Button>
              <Button size="sm" onClick={() => navigate(routes.PHL_DRAFT_ROOM)}>
                Draft
              </Button>
            </>
          )}
        </ButtonGroup>
      </SectionCards>
    </>
  );
};
