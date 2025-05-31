import {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthStore } from "./AuthContext";
import { BootstrapService } from "../_services/bootstrapService";
import {
  CollegeGame,
  CollegePlayer,
  CollegeStandings,
  CollegeTeam,
  CollegeTeamDepthChart,
  Croot,
  NewsLog,
  NFLCapsheet,
  NFLDepthChart,
  NFLGame,
  NFLPlayer,
  NFLStandings,
  NFLTeam,
  Notification,
  RecruitingTeamProfile,
  Timestamp,
  FaceDataResponse,
  NFLContract,
  NFLExtensionOffer,
  FreeAgencyOffer,
  NFLWaiverOffer,
  CollegeTeamProfileData as CFBTeamProfileData,
} from "../models/footballModels";
import { useLeagueStore } from "./LeagueContext";
import { useWebSockets } from "../_hooks/useWebsockets";
import { fba_ws } from "../_constants/urls";
import { SimFBA } from "../_constants/constants";
import { PlayerService } from "../_services/playerService";
import { useSnackbar } from "notistack";
import FBATeamHistoryService from "../_services/teamHistoryService";

// ✅ Define Types for Context
interface SimFBAContextProps {
  cfb_Timestamp: Timestamp | null;
  isLoading: boolean;
  isLoadingTwo: boolean;
  isLoadingThree: boolean;
  isLoadingFour: boolean;
  cfbTeam: CollegeTeam | null;
  cfbTeams: CollegeTeam[];
  cfbTeamMap: Record<number, CollegeTeam> | null;
  cfbTeamOptions: { label: string; value: string }[];
  cfbConferenceOptions: { label: string; value: string }[];
  currentCFBStandings: CollegeStandings[];
  cfbStandingsMap: Record<number, CollegeStandings> | null;
  cfbRosterMap: Record<number, CollegePlayer[]> | null;
  recruits: Croot[];
  teamProfileMap: Record<number, RecruitingTeamProfile> | null;
  portalPlayers: CollegePlayer[];
  collegeInjuryReport: CollegePlayer[];
  allCFBStandings: CollegeStandings[];
  allCollegeGames: CollegeGame[];
  currentCollegeSeasonGames: CollegeGame[];
  collegeTeamsGames: CollegeGame[];
  collegeNews: NewsLog[];
  collegeNotifications: Notification[];
  cfbDepthchartMap: Record<number, CollegeTeamDepthChart> | null;
  nflTeam: NFLTeam | null;
  nflTeams: NFLTeam[];
  nflTeamOptions: { label: string; value: string }[];
  proTeamMap: Record<number, NFLTeam> | null;
  allProStandings: NFLStandings[];
  currentProStandings: NFLStandings[];
  nflConferenceOptions: { label: string; value: string }[];
  proStandingsMap: Record<number, NFLStandings> | null;
  nflDepthchartMap: Record<number, NFLDepthChart> | null;
  proRosterMap: {
    [key: number]: NFLPlayer[];
  } | null;
  freeAgentOffers: FreeAgencyOffer[];
  waiverOffers: NFLWaiverOffer[];
  capsheetMap: Record<number, NFLCapsheet> | null;
  proInjuryReport: NFLPlayer[];
  practiceSquadPlayers: NFLPlayer[];
  proNews: NewsLog[];
  allProGames: NFLGame[];
  currentProSeasonGames: NFLGame[];
  proNotifications: Notification[];
  topCFBPassers: CollegePlayer[];
  topCFBRushers: CollegePlayer[];
  topCFBReceivers: CollegePlayer[];
  topNFLPassers: NFLPlayer[];
  topNFLRushers: NFLPlayer[];
  topNFLReceivers: NFLPlayer[];
  cutCFBPlayer: (playerID: number, teamID: number) => Promise<void>;
  cutNFLPlayer: (playerID: number, teamID: number) => Promise<void>;
  redshirtPlayer: (playerID: number, teamID: number) => Promise<void>;
  promisePlayer: (playerID: number, teamID: number) => Promise<void>;
  updateCFBRosterMap: (newMap: Record<number, CollegePlayer[]>) => void;
  playerFaces: {
    [key: number]: FaceDataResponse;
  };
  proContractMap: Record<number, NFLContract> | null;
  proExtensionMap: Record<number, NFLExtensionOffer> | null;
  allCFBTeamHistory: { [key: number]: CFBTeamProfileData };
}

// ✅ Initial Context State
const defaultContext: SimFBAContextProps = {
  cfb_Timestamp: null,
  isLoading: true,
  isLoadingTwo: true,
  isLoadingThree: true,
  isLoadingFour: true,
  cfbTeam: null,
  cfbTeams: [],
  cfbTeamOptions: [],
  cfbTeamMap: {},
  cfbConferenceOptions: [],
  allCFBStandings: [],
  currentCFBStandings: [],
  cfbStandingsMap: {},
  cfbRosterMap: {},
  recruits: [],
  teamProfileMap: {},
  portalPlayers: [],
  collegeInjuryReport: [],
  currentCollegeSeasonGames: [],
  collegeTeamsGames: [],
  allCollegeGames: [],
  cfbDepthchartMap: {},
  collegeNews: [],
  collegeNotifications: [],
  nflTeam: null,
  nflTeams: [],
  nflTeamOptions: [],
  nflConferenceOptions: [],
  nflDepthchartMap: {},
  proTeamMap: {},
  allProStandings: [],
  currentProStandings: [],
  proStandingsMap: {},
  proRosterMap: {},
  freeAgentOffers: [],
  waiverOffers: [],
  practiceSquadPlayers: [],
  capsheetMap: {},
  proInjuryReport: [],
  proNews: [],
  allProGames: [],
  currentProSeasonGames: [],
  proNotifications: [],
  topCFBPassers: [],
  topCFBRushers: [],
  topCFBReceivers: [],
  topNFLPassers: [],
  topNFLRushers: [],
  topNFLReceivers: [],
  cutCFBPlayer: async () => {},
  cutNFLPlayer: async () => {},
  redshirtPlayer: async () => {},
  promisePlayer: async () => {},
  updateCFBRosterMap: () => {},
  playerFaces: {},
  proContractMap: {},
  proExtensionMap: {},
  allCFBTeamHistory: {},
};

export const SimFBAContext = createContext<SimFBAContextProps>(defaultContext);

// ✅ Define Props for Provider
interface SimFBAProviderProps {
  children: ReactNode;
}

export const SimFBAProvider: React.FC<SimFBAProviderProps> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuthStore();
  const { cfb_Timestamp } = useWebSockets(fba_ws, SimFBA);
  const isFetching = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTwo, setIsLoadingTwo] = useState<boolean>(true);
  const [isLoadingThree, setIsLoadingThree] = useState<boolean>(true);
  const [isLoadingFour, setIsLoadingFour] = useState<boolean>(true);
  const [cfbTeam, setCFBTeam] = useState<CollegeTeam | null>(null);
  const [cfbTeams, setCFBTeams] = useState<CollegeTeam[]>([]);
  const [cfbTeamMap, setCFBTeamMap] = useState<Record<number, CollegeTeam>>({});
  const [cfbDepthchartMap, setCFBDepthchartMap] = useState<Record<
    number,
    CollegeTeamDepthChart
  > | null>({});
  const [cfbTeamOptions, setCFBTeamOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cfbConferenceOptions, setCFBConferenceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [allCFBStandings, setAllCFBStandings] = useState<CollegeStandings[]>(
    []
  );
  const [currentCFBStandings, setCurrentCFBStandings] = useState<
    CollegeStandings[]
  >([]);
  const [cfbStandingsMap, setCFBStandingsMap] = useState<Record<
    number,
    CollegeStandings
  > | null>({});
  const [cfbRosterMap, setCFBRosterMap] = useState<Record<
    number,
    CollegePlayer[]
  > | null>({});
  const [recruits, setRecruits] = useState<Croot[]>([]);
  const [teamProfileMap, setTeamProfileMap] = useState<Record<
    number,
    RecruitingTeamProfile
  > | null>({});
  const [portalPlayers, setPortalPlayers] = useState<CollegePlayer[]>([]);
  const [collegeInjuryReport, setCollegeInjuryReport] = useState<
    CollegePlayer[]
  >([]);
  const [collegeNews, setCollegeNews] = useState<NewsLog[]>([]);
  const [allCollegeGames, setAllCollegeGames] = useState<CollegeGame[]>([]);
  const [currentCollegeSeasonGames, setCurrentCollegeSeasonGames] = useState<
    CollegeGame[]
  >([]);
  const [collegeTeamsGames, setCollegeTeamsGames] = useState<CollegeGame[]>([]);
  const [collegeNotifications, setCollegeNotifications] = useState<
    Notification[]
  >([]);
  const [topCFBPassers, setTopCFBPassers] = useState<CollegePlayer[]>([]);
  const [topCFBRushers, setTopCFBRushers] = useState<CollegePlayer[]>([]);
  const [topCFBReceivers, setTopCFBReceivers] = useState<CollegePlayer[]>([]);
  const [topNFLPassers, setTopNFLPassers] = useState<NFLPlayer[]>([]);
  const [topNFLRushers, setTopNFLRushers] = useState<NFLPlayer[]>([]);
  const [topNFLReceivers, setTopNFLReceivers] = useState<NFLPlayer[]>([]);
  const [nflTeam, setNFLTeam] = useState<NFLTeam | null>(null);
  const [nflTeams, setNFLTeams] = useState<NFLTeam[]>([]);
  const [nflTeamOptions, setNFLTeamOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [nflConferenceOptions, setNFLConferenceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [proTeamMap, setProTeamMap] = useState<Record<number, NFLTeam> | null>(
    {}
  );
  const [nflDepthchartMap, setNFLDepthchartMap] = useState<Record<
    number,
    NFLDepthChart
  > | null>({});
  const [allProStandings, setAllProStandings] = useState<NFLStandings[]>([]);
  const [currentProStandings, setCurrentProStandings] = useState<
    NFLStandings[]
  >([]);
  const [proStandingsMap, setProStandingsMap] = useState<Record<
    number,
    NFLStandings
  > | null>({});
  const [proRosterMap, setProRosterMap] = useState<{
    [key: number]: NFLPlayer[];
  } | null>({});
  const [freeAgentOffers, setFreeAgentOffers] = useState<FreeAgencyOffer[]>([]);
  const [waiverOffers, setWaiverOffers] = useState<NFLWaiverOffer[]>([]);
  const [capsheetMap, setCapsheetMap] = useState<Record<
    number,
    NFLCapsheet
  > | null>({});
  const [proInjuryReport, setProInjuryReport] = useState<NFLPlayer[]>([]);
  const [practiceSquadPlayers, setPracticeSquadPlayers] = useState<NFLPlayer[]>(
    []
  );
  const [proNews, setProNews] = useState<NewsLog[]>([]);
  const [allProGames, setAllProGames] = useState<NFLGame[]>([]);
  const [currentProSeasonGames, setCurrentProSeasonGames] = useState<NFLGame[]>(
    []
  );
  const [proTeamsGames, setProTeamsGames] = useState<NFLGame[]>([]);
  const [proNotifications, setProNotifications] = useState<Notification[]>([]);
  const [playerFaces, setPlayerFaces] = useState<{
    [key: number]: FaceDataResponse;
  }>({});
  const [proContractMap, setProContractMap] = useState<Record<
    number,
    NFLContract
  > | null>({});
  const [proExtensionMap, setProExtensionMap] = useState<Record<
    number,
    NFLExtensionOffer
  > | null>({});
  const [allCFBTeamHistory, setAllCFBTeamHistory] = useState<{ [key: number]: CFBTeamProfileData }>({});

  useEffect(() => {
    getBootstrapTeamData();
  }, []);

  const getBootstrapTeamData = async () => {
    const res = await BootstrapService.GetFBABootstrapTeamData();
    setCFBTeams(res.AllCollegeTeams);
    setNFLTeams(res.AllProTeams);

    if (res.AllCollegeTeams.length > 0) {
      const sortedCollegeTeams = res.AllCollegeTeams.sort((a, b) =>
        a.TeamName.localeCompare(b.TeamName)
      );
      const teamOptionsList = sortedCollegeTeams.map((team) => ({
        label: team.TeamName,
        value: team.ID.toString(),
      }));
      const conferenceOptions = Array.from(
        new Map(
          sortedCollegeTeams.map((team) => [
            team.ConferenceID,
            { label: team.Conference, value: team.ConferenceID.toString() },
          ])
        ).values()
      ).sort((a, b) => a.label.localeCompare(b.label));
      setCFBTeamOptions(teamOptionsList);
      setCFBConferenceOptions(conferenceOptions);
      const collegeTeamMap = Object.fromEntries(
        sortedCollegeTeams.map((team) => [team.ID, team])
      );
      setCFBTeamMap(collegeTeamMap);
    }
    if (res.AllProTeams.length > 0) {
      const sortedNFLTeams = res.AllProTeams.sort((a, b) =>
        a.TeamName.localeCompare(b.TeamName)
      );
      const nflTeamOptions = sortedNFLTeams.map((team) => ({
        label: `${team.TeamName}${
          [4, 16, 18, 30].includes(team.ID) ? ` ${team.Mascot}` : ""
        }`,
        value: team.ID.toString(),
      }));
      const nflConferenceOptions = Array.from(
        new Map(
          sortedNFLTeams.map((team) => [
            team.ConferenceID,
            { label: team.Conference, value: team.ConferenceID.toString() },
          ])
        ).values()
      ).sort((a, b) => a.label.localeCompare(b.label));
      setNFLTeamOptions(nflTeamOptions);
      setNFLConferenceOptions(nflConferenceOptions);
      const nflMap = Object.fromEntries(
        sortedNFLTeams.map((team) => [team.ID, team])
      );
      setProTeamMap(nflMap);
    }
  };

  useEffect(() => {
    if (currentUser && !isFetching.current) {
      isFetching.current = true;
      bootstrapAllData();
    }
  }, [currentUser]);

  const bootstrapAllData = async () => {
    await getFirstBootstrapData();
    await new Promise((resolve) => setTimeout(resolve, 3500)); // Wait 5 seconds
    await getSecondBootstrapData();
    await new Promise((resolve) => setTimeout(resolve, 3500)); // Wait 5 seconds
    await getThirdBootstrapData();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fetchAllHistory();
    isFetching.current = false;
  };

  const getFirstBootstrapData = async () => {
    let cfbID = 0;
    let nflID = 0;
    if (currentUser && currentUser.teamId) {
      cfbID = currentUser.teamId;
    }
    if (currentUser && currentUser.NFLTeamID) {
      nflID = currentUser.NFLTeamID;
    }
    const res = await BootstrapService.GetFBABootstrapData(cfbID, nflID);
    setCFBTeam(res.CollegeTeam);
    setNFLTeam(res.ProTeam);
    setCollegeInjuryReport(res.CollegeInjuryReport);
    if (res.CollegeNotifications) {
      setCollegeNotifications(res.CollegeNotifications);
      setTopCFBPassers(res.TopCFBPassers);
      setTopCFBRushers(res.TopCFBRushers);
      setTopCFBReceivers(res.TopCFBReceivers);
      setCFBRosterMap(res.CollegeRosterMap);
      setPortalPlayers(res.PortalPlayers);
    }

    if (res.ProNotifications) {
      setProNotifications(res.ProNotifications);
    }

    setPlayerFaces(res.FaceData);
    setIsLoading(false);
  };

  const getSecondBootstrapData = async () => {
    let cfbID = 0;
    let nflID = 0;
    if (currentUser && currentUser.teamId) {
      cfbID = currentUser.teamId;
    }
    if (currentUser && currentUser.NFLTeamID) {
      nflID = currentUser.NFLTeamID;
    }
    const res = await BootstrapService.GetSecondFBABootstrapData(cfbID, nflID);
    if (res.CollegeNews) {
      setCollegeNews(res.CollegeNews);
      setTopNFLPassers(res.TopNFLPassers);
      setTopNFLRushers(res.TopNFLRushers);
      setTopNFLReceivers(res.TopNFLReceivers);
    }

    setTeamProfileMap(res.TeamProfileMap);
    setAllCollegeGames(res.AllCollegeGames);

    if (res.AllCollegeGames.length > 0 && cfb_Timestamp) {
      const currentSeasonGames = res.AllCollegeGames.filter(
        (x) => x.SeasonID === cfb_Timestamp.CollegeSeasonID
      );
      setCurrentCollegeSeasonGames(currentSeasonGames);
      const teamGames = currentSeasonGames.filter(
        (x) => x.HomeTeamID === cfbID || x.AwayTeamID === cfbID
      );
      setCollegeTeamsGames(teamGames);
    }
    setAllCFBStandings(res.CollegeStandings);

    if (
      res.CollegeStandings &&
      res.CollegeStandings.length > 0 &&
      cfb_Timestamp
    ) {
      const currentSeasonStandings = res.CollegeStandings.filter(
        (x) => x.SeasonID === cfb_Timestamp.CollegeSeasonID
      );
      const collegeStandingsMap = Object.fromEntries(
        currentSeasonStandings.map((standings) => [standings.TeamID, standings])
      );
      setCurrentCFBStandings(currentSeasonStandings);
      setCFBStandingsMap(collegeStandingsMap);
    }

    setCapsheetMap(res.CapsheetMap);
    setProRosterMap(res.ProRosterMap);
    setPracticeSquadPlayers(res.PracticeSquadPlayers);
    setProInjuryReport(res.ProInjuryReport);
    setAllProGames(res.AllProGames);

    if (res.AllProGames.length > 0 && cfb_Timestamp) {
      const currentSeasonGames = res.AllProGames.filter(
        (x) => x.SeasonID === cfb_Timestamp.NFLSeasonID
      );
      setCurrentProSeasonGames(currentSeasonGames);
      const teamGames = currentSeasonGames.filter(
        (x) => x.HomeTeamID === cfbID || x.AwayTeamID === cfbID
      );
      setProTeamsGames(teamGames);
    }
    setAllProStandings(res.ProStandings);

    if (res.ProStandings.length > 0 && cfb_Timestamp) {
      const currentSeasonStandings = res.ProStandings.filter(
        (x) => x.SeasonID === cfb_Timestamp.NFLSeasonID
      );
      const nflStandingsMap = Object.fromEntries(
        currentSeasonStandings.map((standings) => [standings.TeamID, standings])
      );
      setCurrentProStandings(currentSeasonStandings);
      setProStandingsMap(nflStandingsMap);
    }
    setIsLoadingTwo(false);
  };

  const getThirdBootstrapData = async () => {
    let cfbID = 0;
    let nflID = 0;
    if (currentUser && currentUser.teamId) {
      cfbID = currentUser.teamId;
    }
    if (currentUser && currentUser.NFLTeamID) {
      nflID = currentUser.NFLTeamID;
    }
    const res = await BootstrapService.GetThirdFBABootstrapData(cfbID, nflID);
    setProNews(res.ProNews);
    setRecruits(res.Recruits);
    setFreeAgentOffers(res.FreeAgentOffers);
    setWaiverOffers(res.WaiverWireOffers);
    setCFBDepthchartMap(res.CollegeDepthChartMap);
    setNFLDepthchartMap(res.NFLDepthChartMap);
    setIsLoadingThree(false);
    setProContractMap(res.ContractMap);
    setProExtensionMap(res.ExtensionMap);
  };

  const teamHistoryService = new FBATeamHistoryService();
  const fetchAllHistory = async () => {
    const response = await teamHistoryService.GetCFBTeamHistory();
    setAllCFBTeamHistory(response);
    setIsLoadingFour(false);
  };

  const cutCFBPlayer = useCallback(
    async (playerID: number, teamID: number) => {
      const rosterMap = { ...cfbRosterMap };
      const playerCount = rosterMap[teamID].length;
      if (
        (cfbTeam!.IsFBS && playerCount < 81) ||
        (!cfbTeam!.IsFBS && playerCount < 61)
      ) {
        enqueueSnackbar(
          "You have reached the current minimum roster count and cannot cut any players.",
          { variant: "warning", autoHideDuration: 3000 }
        );
        return;
      }
      const res = await PlayerService.CutCFBPlayer(playerID);
      rosterMap[teamID] = rosterMap[teamID].filter(
        (player) => player.ID !== playerID
      );
      setCFBRosterMap(rosterMap);
    },
    [cfbRosterMap]
  );
  const redshirtPlayer = useCallback(
    async (playerID: number, teamID: number) => {
      const rosterMap = { ...cfbRosterMap };
      const redshirtCount = rosterMap[teamID].filter(
        (x) => x.IsRedshirting
      ).length;
      if (redshirtCount > 19) {
        enqueueSnackbar(
          "You have reached the current maximum allowed for redshirts.",
          { variant: "warning", autoHideDuration: 3000 }
        );
        return;
      }
      const res = await PlayerService.CutCFBPlayer(playerID);
      const playerIDX = rosterMap[teamID].findIndex(
        (player) => player.ID === playerID
      );
      if (playerIDX > -1) {
        rosterMap[teamID][playerIDX].IsRedshirting = true;
        setCFBRosterMap(rosterMap);
      }
    },
    [cfbRosterMap]
  );
  const promisePlayer = useCallback(
    async (playerID: number, teamID: number) => {},
    [cfbRosterMap]
  );
  const cutNFLPlayer = useCallback(
    async (playerID: number, teamID: number) => {
      const res = await PlayerService.CutNFLPlayer(playerID);
      const rosterMap = { ...proRosterMap };
      rosterMap[teamID] = rosterMap[teamID].filter(
        (player) => player.ID !== playerID
      );
      setProRosterMap(rosterMap);
    },
    [proRosterMap]
  );

  const updateCFBRosterMap = (newMap: Record<number, CollegePlayer[]>) => {
    setCFBRosterMap(newMap);
  };

  return (
    <SimFBAContext.Provider
      value={{
        cfb_Timestamp,
        cfbTeam,
        cfbTeams,
        cfbTeamMap,
        cfbTeamOptions,
        cfbConferenceOptions,
        allCFBStandings,
        currentCFBStandings,
        cfbStandingsMap,
        cfbRosterMap,
        recruits,
        teamProfileMap,
        portalPlayers,
        collegeInjuryReport,
        currentCollegeSeasonGames,
        collegeTeamsGames,
        cfbDepthchartMap,
        collegeNews,
        allCollegeGames,
        collegeNotifications,
        nflTeam,
        nflTeams,
        proTeamMap,
        nflTeamOptions,
        nflConferenceOptions,
        nflDepthchartMap,
        allProStandings,
        currentProStandings,
        proStandingsMap,
        proRosterMap,
        freeAgentOffers,
        waiverOffers,
        practiceSquadPlayers,
        capsheetMap,
        proInjuryReport,
        proNews,
        allProGames,
        currentProSeasonGames,
        proNotifications,
        isLoading,
        isLoadingTwo,
        isLoadingThree,
        topCFBPassers,
        topCFBRushers,
        topCFBReceivers,
        topNFLPassers,
        topNFLRushers,
        topNFLReceivers,
        cutCFBPlayer,
        redshirtPlayer,
        promisePlayer,
        cutNFLPlayer,
        updateCFBRosterMap,
        playerFaces,
        proContractMap,
        proExtensionMap,
        allCFBTeamHistory,
        isLoadingFour,
      }}
    >
      {children}
    </SimFBAContext.Provider>
  );
};

export const useSimFBAStore = () => {
  const store = useContext(SimFBAContext);
  return store;
};
