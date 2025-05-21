import { FC, useEffect, useMemo, useState } from "react";
import {
  League,
  SimCHL,
  SimPHL,
  SimCFB,
  SimNFL,
  SimCBB,
  SimNBA
} from "../../_constants/constants";
import { Border } from "../../_design/Borders";
import { PageContainer } from "../../_design/Container";
import { useAuthStore } from "../../context/AuthContext";
import { useLeagueStore } from "../../context/LeagueContext";
import { useSimHCKStore } from "../../context/SimHockeyContext";
import { SelectDropdown } from "../../_design/Select";
import { SingleValue } from "react-select";
import { SelectOption } from "../../_hooks/useSelectStyles";
import {
  CollegePlayer as CFBPlayer,
  NFLPlayer,
  CollegeStandings as CFBStandings,
  FlexComparisonModel as CFBFlexComparisonModel,
  CollegePlayerSeasonStats as CFBPlayerSeasonStats,
  CollegeTeamProfileData as CFBTeamProfileData,
} from "../../models/footballModels";
import { useTeamColors } from "../../_hooks/useTeamColors";
import { useSimFBAStore } from "../../context/SimFBAContext";
import { isBrightColor } from "../../_utility/isBrightColor";
import { useResponsive } from "../../_hooks/useMobile";
import { darkenColor } from "../../_utility/getDarkerColor";
import { useParams } from "react-router-dom";
import { useSimBBAStore } from "../../context/SimBBAContext";
import FBATeamHistoryService from "../../_services/teamHistoryService";
import { getTextColorBasedOnBg } from "../../_utility/getBorderClass";
import { TeamRivalry, TeamPlayerCareerStats } from "./Common/TeamProfileComponents";
import { LoadSpinner } from "../../_design/LoadSpinner";
import { getLogo } from "../../_utility/getLogo";
import { Logo } from "../../_design/Logo";
import { processRivalries, processTopPlayers } from "./Common/TeamProfileHelper";

interface TeamProfilePageProps {
  league: League;
}

export const TeamProfilePage: FC<TeamProfilePageProps> = ({ league }) => {
  const { currentUser } = useAuthStore();
  const leagueStore = useLeagueStore();
  const { selectedLeague, setSelectedLeague, ts } = leagueStore;
  const { chlTeam, phlTeam } = useSimHCKStore();
  const { cfbTeam, nflTeam } = useSimFBAStore();
  const { cbbTeam, nbaTeam } = useSimBBAStore();

  useEffect(() => {
    if (selectedLeague !== league) {
      setSelectedLeague(league);
    }
  }, [selectedLeague]);

  const isLoading = useMemo(() => {
    if (selectedLeague === SimCHL && chlTeam) {
      return false;
    }
    if (selectedLeague === SimPHL && phlTeam) {
      return false;
    }
    if (selectedLeague === SimCFB && cfbTeam) {
      return false;
    }
    if (selectedLeague === SimNFL && nflTeam) {
      return false;
    }
    if (selectedLeague === SimCBB && cbbTeam) {
      return false;
    }
    if (selectedLeague === SimNBA && nbaTeam) {
      return false;
    }
    return true;
  }, [chlTeam, phlTeam, cfbTeam, nflTeam, cbbTeam, nbaTeam, selectedLeague]);
  return (
    <>
      <PageContainer direction="col" isLoading={isLoading} title="Team Profile">
        {selectedLeague === SimCFB && cfbTeam && (
          <CFBTeamProfilePage league={league} />
        )}
      </PageContainer>
    </>
  );
};

const CFBTeamProfilePage = ({ league }: TeamProfilePageProps) => {
  const { teamId } = useParams<{ teamId?: string }>();
  const { currentUser } = useAuthStore();
  const fbStore = useSimFBAStore();
  const {
    cfbTeam,
    cfbTeamMap,
    cfbTeamOptions,
  } = fbStore;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [careerStats, setCareerStats] = useState<CFBPlayerSeasonStats[]>([]);
  const [collegeStandings, setCollegeStandings] = useState<CFBStandings[]>([]);
  const [rivalries, setRivalries] = useState<any[]>([]);
  const [playerMap, setPlayerMap] = useState<{ [key: number]: CFBPlayer }>({});
  const teamHistoryService = new FBATeamHistoryService();
  let selectedTeamLogo = "";
  const [allTeamHistory, setAllTeamHistory] = useState<{ [key: number]: CFBTeamProfileData }>({});

  useEffect(() => {
    const fetchAllHistory = async () => {
      const response = await teamHistoryService.GetCFBTeamHistory();
      setAllTeamHistory(response);
    };
    fetchAllHistory();
  }, []);

  const [selectedTeam, setSelectedTeam] = useState(() => {
    if (teamId && cfbTeamMap) {
      const id = Number(teamId);
      return cfbTeamMap[id];
    }
    return cfbTeam;
  });
  const teamColors = useTeamColors(
    selectedTeam?.ColorOne,
    selectedTeam?.ColorTwo,
    selectedTeam?.ColorThree
  );
  let backgroundColor = "#1f2937";
  let headerColor = teamColors.One;
  let borderColor = teamColors.Two;
  if (isBrightColor(headerColor)) {
    [headerColor, borderColor] = [borderColor, headerColor];
  }
  let darkerBackgroundColor = darkenColor(backgroundColor, -5);
  let textColorClass = getTextColorBasedOnBg(backgroundColor);

  const { isDesktop } = useResponsive();

  const selectTeamOption = (opts: SingleValue<SelectOption>) => {
    const value = Number(opts?.value);
    const nextTeam = cfbTeamMap ? cfbTeamMap[value] : null;
    setSelectedTeam(nextTeam);
  };

  if (selectedTeam){
    selectedTeamLogo = getLogo(league, selectedTeam?.ID, currentUser?.isRetro);
  }

useEffect(() => {
  if (!selectedTeam || !allTeamHistory || Object.keys(allTeamHistory).length === 0) {
    setIsLoading(true);
    return;
  }

  setIsLoading(true);

  const teamProfile = allTeamHistory[selectedTeam.ID];
  if (!teamProfile) {
    setCareerStats([]);
    setCollegeStandings([]);
    setPlayerMap({});
    setRivalries([]);
    setIsLoading(false);
    return;
  }

  const orderedCollegeStandings = Array.isArray(teamProfile.CollegeStandings)
    ? [...teamProfile.CollegeStandings].sort((a, b) => b.SeasonID - a.SeasonID)
    : [];
  const processedRivalries = processRivalries(teamProfile, selectedTeam, cfbTeamMap);

  setCareerStats(Array.isArray(teamProfile.CareerStats) ? teamProfile.CareerStats : []);
  setCollegeStandings(orderedCollegeStandings);
  setPlayerMap(teamProfile.PlayerMap || {});
  setRivalries(processedRivalries);
  setIsLoading(false);
}, [selectedTeam, allTeamHistory, cfbTeamMap]);

const {
  topPassing,
  topRushing,
  topReceiving,
  topTackles,
  topSacks,
  topINTs,
} = processTopPlayers(careerStats, playerMap);

  return (
    <>
      <div className="flex w-full">
        {isLoading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <LoadSpinner />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full min-h-[40em]">
          <div className="flex flex-col items-center">
            <TeamPlayerCareerStats
              league={league}
              team={selectedTeam}
              data={topPassing}
              title="Top Passing"
              backgroundColor={backgroundColor}
              borderColor={borderColor}
              headerColor={headerColor}
              darkerBackgroundColor={darkerBackgroundColor}
              textColorClass={textColorClass}
              statColumns={[
                { header: "Name", accessor: "FullName" },
                { header: "Position", accessor: "Position" },
                { header: "Yards", accessor: "PassingYards" },
                { header: "TD", accessor: "PassingTD" },
              ]}
            />
          </div>
          <div className="flex flex-col items-center">
            <Border
              direction="col"
              classes="w-full p-2 gap-2 items-center justify-center"
              styles={{
                backgroundColor: backgroundColor,
                borderColor: headerColor,
              }}
            >
              <Logo url={selectedTeamLogo} variant="large" classes="h-[20em]" />
              <div className="flex justify-center w-full">
                <SelectDropdown
                  options={cfbTeamOptions}
                  onChange={selectTeamOption}
                />
              </div>
            </Border>
            <div className="w-full mt-4">
              <TeamRivalry
                league={league}
                team={selectedTeam}
                data={rivalries}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
                headerColor={headerColor}
                darkerBackgroundColor={darkerBackgroundColor}
                textColorClass={textColorClass}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <TeamPlayerCareerStats
              league={league}
              team={selectedTeam}
              data={topPassing}
              title="Top Passing"
              backgroundColor={backgroundColor}
              borderColor={borderColor}
              headerColor={headerColor}
              darkerBackgroundColor={darkerBackgroundColor}
              textColorClass={textColorClass}
              statColumns={[
                {
                  header: "Name",
                  accessor: "Name",
                  render: (row: any) => `${row.FirstName} ${row.LastName}`,
                },
                { header: "Position", accessor: "Position" },
                { header: "Yards", accessor: "PassingYards" },
                { header: "TD", accessor: "PassingTDs" },
              ]}
            />
          </div>
        </div>
      )}
      </div>
    </>
  );
};