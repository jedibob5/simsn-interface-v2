import { CollegePlayer, NFLPlayer } from '../../../../models/footballModels';
import { SimCFB, SimNFL } from '../../../../_constants/constants';
import { getCFBOverall } from '../../../../_utility/getLetterGrade';
import { GetNFLOverall } from '../../../Team/TeamPageUtils';
import { getEligiblePositionsForDepthPosition as getEligiblePositions } from './PlayerUtils';
export { getRatingColor, getRatingBgColor, getAttributeColor } from './UIUtils';
export { 
  getEligiblePositionsForDepthPosition, 
  getOverarchingPosition,
  createOpponentPlayerOptions,
  getUnassignedPlayersForPosition 
} from './PlayerUtils';

export const getPlayerOverallRating = (
  player: CollegePlayer | NFLPlayer | null | undefined,
  league: typeof SimCFB | typeof SimNFL,
  showLetterGrade?: boolean
): number | string => {
  if (!player) {
    return 'N/A';
  }
  
  if (league === SimNFL) {
    const nflPlayer = player as NFLPlayer;
    const rawOverall = nflPlayer.Overall || 0;
    const shouldShowLetterGrade = showLetterGrade !== undefined ? showLetterGrade : nflPlayer.ShowLetterGrade;
    if (shouldShowLetterGrade) {
      return GetNFLOverall(rawOverall, true);
    }
    return rawOverall;
  } else {
    const cfbPlayer = player as CollegePlayer;
    const rawOverall = cfbPlayer.Overall || 0;
    return getCFBOverall(rawOverall, cfbPlayer.Year);
  }
};

export const getAttributeAcronym = (attributeName: string): string => {
  const acronyms: { [key: string]: string } = {
    'Football IQ': 'FIQ',
    'FootballIQ': 'FIQ',
    'Speed': 'SPD',
    'Agility': 'AGI',
    'Carrying': 'CAR',
    'Catching': 'CTH',
    'Route Running': 'RTE',
    'RouteRunning': 'RTE',
    'Throw Power': 'THP',
    'ThrowPower': 'THP',
    'Throw Accuracy': 'THA',
    'ThrowAccuracy': 'THA',
    'Pass Block': 'PBK',
    'PassBlock': 'PBK',
    'Run Block': 'RBK',
    'RunBlock': 'RBK',
    'Strength': 'STR',
    'Tackle': 'TKL',
    'Zone Coverage': 'ZCV',
    'ZoneCoverage': 'ZCV',
    'Man Coverage': 'MCV',
    'ManCoverage': 'MCV',
    'Pass Rush': 'RSH',
    'PassRush': 'RSH',
    'Run Defense': 'RDF',
    'RunDefense': 'RDF',
    'Kick Power': 'KP',
    'KickPower': 'KP',
    'Kick Accuracy': 'KA',
    'KickAccuracy': 'KA',
    'Punt Power': 'PP',
    'PuntPower': 'PP',
    'Punt Accuracy': 'PA',
    'PuntAccuracy': 'PA',
    'Stamina': 'STA',
    'Injury': 'INJ',
    'Shotgun Rating': 'SGR'
  };
  
  return acronyms[attributeName] || attributeName.substring(0, 3).toUpperCase();
};



export const getAvailablePlayersForPosition = (
  position: string, 
  players: (CollegePlayer | NFLPlayer)[]
): (CollegePlayer | NFLPlayer)[] => {
  const eligiblePositions = getEligiblePositions(position);
  return players.filter(player => eligiblePositions.includes(player.Position));
};


export interface PlayerDisplayInfo {
  firstName: string;
  lastName: string;
  position: string;
  archetype: string;
  overall: number | string;
}

export const getPlayerInfoForGameplan = (
  player: CollegePlayer | NFLPlayer,
  league: typeof SimCFB | typeof SimNFL
): PlayerDisplayInfo => {
  const overall = getPlayerOverallRating(player, league, true);

  return {
    firstName: player.FirstName,
    lastName: player.LastName,
    position: player.Position,
    archetype: player.Archetype || '',
    overall
  };
};

export const getPlayerByPosition = (
  players: (CollegePlayer | NFLPlayer)[],
  position: string,
  level: number = 1
): (CollegePlayer | NFLPlayer) | null => {
  const positionPlayers = players.filter(p => p.Position === position);
  return positionPlayers[level - 1] || null;
};

export const formatPlayerDisplayName = (
  player: CollegePlayer | NFLPlayer,
  format: 'full' | 'short' | 'archetype' = 'full'
): string => {
  switch (format) {
    case 'short':
      return `${player.FirstName} ${player.LastName}`;
    case 'archetype':
      return `${player.Archetype || ''} ${player.Position}`;
    case 'full':
    default:
      return `${player.Archetype || ''} ${player.Position} ${player.FirstName} ${player.LastName}`;
  }
};

export const getGameplanPlayerInfo = (
  players: (CollegePlayer | NFLPlayer)[],
  position: string,
  level: number,
  league: typeof SimCFB | typeof SimNFL
): PlayerDisplayInfo | undefined => {
  const player = getPlayerByPosition(players, position, level);
  if (!player) return undefined;

  return getPlayerInfoForGameplan(player, league);
};

