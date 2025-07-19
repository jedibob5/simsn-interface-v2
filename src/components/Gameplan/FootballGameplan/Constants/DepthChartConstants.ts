export const DepthChartPositionList = [
  { name: 'Quarterbacks', abbr: 'QB' },
  { name: 'Runningbacks', abbr: 'RB' },
  { name: 'Fullbacks', abbr: 'FB' },
  { name: 'Tight Ends', abbr: 'TE' },
  { name: 'Wide Receivers', abbr: 'WR' },
  { name: 'Left Tackles', abbr: 'LT' },
  { name: 'Left Guards', abbr: 'LG' },
  { name: 'Centers', abbr: 'C' },
  { name: 'Right Guards', abbr: 'RG' },
  { name: 'Right Tackles', abbr: 'RT' },
  { name: 'Left Ends', abbr: 'LE' },
  { name: 'Defensive Tackles', abbr: 'DT' },
  { name: 'Right Ends', abbr: 'RE' },
  { name: 'Left Outside Linebackers', abbr: 'LOLB' },
  { name: 'Middle Linebackers', abbr: 'MLB' },
  { name: 'Right Outside Linebackers', abbr: 'ROLB' },
  { name: 'Cornerbacks', abbr: 'CB' },
  { name: 'Free Safeties', abbr: 'FS' },
  { name: 'Strong Safeties', abbr: 'SS' },
  { name: 'Punters', abbr: 'P' },
  { name: 'Punt Returners', abbr: 'PR' },
  { name: 'Kickers', abbr: 'K' },
  { name: 'Kick Returners', abbr: 'KR' },
  { name: 'Field Goal Placekickers', abbr: 'FG' },
  { name: 'Special Teams Unit', abbr: 'STU' }
];

export const GeneralAttributes = [
  { label: 'Name' },
  { label: 'Position' },
  { label: 'String' },
  { label: 'Archetype' },
  { label: 'Overall' },
  { label: 'Year' }
];

export const OFFENSIVE_POSITIONS = ['QB', 'RB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'];
export const DEFENSIVE_POSITIONS = ['LE', 'DT', 'RE', 'LOLB', 'MLB', 'ROLB', 'CB', 'FS', 'SS'];
export const SPECIAL_TEAMS_POSITIONS = ['P', 'PR', 'K', 'KR', 'FG', 'STU'];

export const POSITION_LIMITS = {
  QB: 3,
  RB: 3,
  FB: 2,
  TE: 3,
  WR: 7,
  LT: 2,
  LG: 2,
  C: 2,
  RG: 2,
  RT: 2,
  LE: 2,
  DT: 4,
  RE: 2,
  LOLB: 2,
  MLB: 4,
  ROLB: 2,
  CB: 5,
  FS: 2,
  SS: 2,
  P: 2,
  PR: 2,
  K: 2,
  KR: 2,
  FG: 2,
  STU: 15
};

export const OFFENSE_POSITIONS_EXTENDED = ['QB', 'RB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OT', 'OG'];
export const DEFENSE_POSITIONS_EXTENDED = ['LE', 'DT', 'RE', 'LOLB', 'MLB', 'ROLB', 'CB', 'FS', 'SS', 'DE', 'OLB', 'ILB'];
export const SPECIAL_TEAMS_POSITIONS_EXTENDED = ['P', 'PR', 'K', 'KR', 'FG', 'STU'];

export const POSITION_ELIGIBILITY: Record<string, string[]> = {
  QB: ['QB', 'RB', 'FB', 'WR', 'TE', 'K', 'P', 'ATH'],
  RB: ['RB', 'FB', 'QB', 'WR', 'ATH'],
  FB: ['FB', 'RB', 'TE', 'ATH'],
  TE: ['TE', 'RB', 'FB', 'WR', 'ATH'],
  WR: ['WR', 'TE', 'RB', 'FB', 'QB', 'ATH'],
  LT: ['OT', 'OG', 'LT', 'LG', 'C', 'RG', 'RT', 'FB', 'TE', 'ATH'],
  LG: ['OT', 'OG', 'LT', 'LG', 'C', 'RG', 'RT', 'FB', 'TE', 'ATH'],
  C: ['OT', 'OG', 'LT', 'LG', 'C', 'RG', 'RT', 'FB', 'TE', 'ATH'],
  RG: ['OT', 'OG', 'LT', 'LG', 'C', 'RG', 'RT', 'FB', 'TE', 'ATH'],
  RT: ['OT', 'OG', 'LT', 'LG', 'C', 'RG', 'RT', 'FB', 'TE', 'ATH'],
  LE: ['DE', 'ATH', 'DT', 'OLB', 'ILB', 'SS', 'FS'],
  RE: ['DE', 'ATH', 'DT', 'OLB', 'ILB', 'SS', 'FS'],
  DT: ['DT', 'ATH', 'DE', 'OLB', 'ILB'],
  LOLB: ['OLB', 'ATH', 'ILB', 'DE', 'SS', 'DT', 'FS', 'CB'],
  ROLB: ['OLB', 'ATH', 'ILB', 'DE', 'SS', 'DT', 'FS', 'CB'],
  MLB: ['ILB', 'ATH', 'OLB', 'SS', 'FS', 'CB', 'DT', 'DE'],
  CB: ['CB', 'ATH', 'FS', 'SS', 'OLB', 'ILB'],
  FS: ['FS', 'ATH', 'CB', 'SS', 'OLB', 'ILB'],
  SS: ['SS', 'ATH', 'FS', 'CB', 'OLB', 'ILB'],
  P: ['P', 'K', 'ATH', 'QB'],
  PR: ['RB', 'WR', 'ATH', 'FB', 'CB', 'FS'],
  K: ['K', 'P', 'ATH', 'QB'],
  KR: ['RB', 'WR', 'ATH', 'FB', 'CB', 'FS'],
  FG: ['K', 'P', 'ATH', 'QB'],
  STU: ['QB', 'RB', 'FB', 'WR', 'TE', 'OT', 'OG', 'LT', 'LG', 'C', 'RG', 'RT', 
        'DE', 'DT', 'OLB', 'ILB', 'CB', 'FS', 'SS', 'ATH']
};

export const OVERARCHING_POSITIONS: Record<string, string> = {
  LT: 'OT',
  RT: 'OT',
  LG: 'OG',
  RG: 'OG',
  C: 'C',
  LE: 'DE',
  RE: 'DE',
  DT: 'DT',
  MLB: 'ILB',
  LOLB: 'OLB',
  ROLB: 'OLB',
  CB: 'CB',
  FS: 'FS',
  SS: 'SS'
};

export const SPECIAL_POSITION_SORTING = {
  PR: 'Speed',
  KR: 'Speed',
  STU: 'Strength'
} as const;