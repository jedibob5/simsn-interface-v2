import { useMemo } from 'react';
import { SimCFB, SimNFL } from '../../../../_constants/constants';
import { CollegePlayer, NFLPlayer } from '../../../../models/footballModels';
import { 
  GameplanData, 
  ValidationError, 
  validateGameplan,
  parseFocusPlays 
} from './GameplanHelper';
import { 
  calculatePlayTypeTotals, 
  calculateFormationWeights, 
  calculateRunnerDistributionTotal, 
  calculateTargetingDistributionTotal 
} from '../Utils/GameplanCalculationUtils';

export interface GameplanValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  playTypeTotals: {
    traditionalRun: number;
    optionRun: number;
    rpo: number;
    pass: number;
  };
  formationWeights: number[];
  canSave: boolean;
}

interface UseGameplanValidationProps {
  gameplan: GameplanData | null;
  players?: (CollegePlayer | NFLPlayer)[];
  league: typeof SimCFB | typeof SimNFL;
  canModify?: boolean;
  opponentScheme?: string;
}

export const useGameplanValidation = ({
  gameplan,
  players = [],
  league,
  canModify = true,
  opponentScheme
}: UseGameplanValidationProps): GameplanValidationResult => {
  
  const validation = useMemo(() => {
    if (!gameplan) {
      return {
        isValid: false,
        errors: [{ field: 'gameplan', message: 'No gameplan data available', severity: 'error' as const }],
        warnings: [],
        playTypeTotals: { traditionalRun: 0, optionRun: 0, rpo: 0, pass: 0 },
        formationWeights: [],
        canSave: false
      };
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const validationErrors = validateGameplan(gameplan);
    errors.push(...validationErrors);
    const playTypeTotals = calculatePlayTypeTotals(gameplan);
    const formationWeights = calculateFormationWeights(gameplan);
    if (gameplan.FocusPlays) {
      const focusPlays = parseFocusPlays(gameplan.FocusPlays);
      if (focusPlays.length > 3) {
        errors.push({
          field: 'focusPlays',
          message: `More than 3 focus plays have been selected (${focusPlays.length}). Please reduce to 3 or less.`,
          severity: 'error'
        });
      }
    }

    const usedFormations = formationWeights.filter(weight => weight > 0);
    if (usedFormations.length > 0) {
      const avgWeight = usedFormations.reduce((sum, weight) => sum + weight, 0) / usedFormations.length;
      const hasUnbalancedFormations = usedFormations.some(weight => 
        Math.abs(weight - avgWeight) > 30
      );
      
      if (hasUnbalancedFormations) {
        warnings.push({
          field: 'formations',
          message: 'Formation weights are heavily unbalanced. Consider more even distribution for better game flow.',
          severity: 'warning'
        });
      }
    }
    
    const totalPlayTypes = playTypeTotals.traditionalRun + playTypeTotals.optionRun + 
                          playTypeTotals.rpo + playTypeTotals.pass;
    
    if (totalPlayTypes === 100) {
      if (playTypeTotals.pass > 80) {
        warnings.push({
          field: 'playTypes',
          message: 'Very pass-heavy gameplan. Consider adding more running plays for balance.',
          severity: 'warning'
        });
      }
      
      if (playTypeTotals.traditionalRun + playTypeTotals.optionRun + playTypeTotals.rpo > 80) {
        warnings.push({
          field: 'playTypes',
          message: 'Very run-heavy gameplan. Consider adding more passing plays for balance.',
          severity: 'warning'
        });
      }
    }
    
    const runnerTotal = calculateRunnerDistributionTotal(gameplan);
    
    if (runnerTotal === 0) {
      warnings.push({
        field: 'runnerDistribution',
        message: 'No runner distribution weights set. Consider setting weights for running backs.',
        severity: 'warning'
      });
    }
    
    const targetingTotal = calculateTargetingDistributionTotal(gameplan);
    
    if (targetingTotal === 0) {
      warnings.push({
        field: 'targetingDistribution',
        message: 'No targeting distribution weights set. Consider setting weights for receivers.',
        severity: 'warning'
      });
    }
    
    if (gameplan.MaximumFGDistance < 15 || gameplan.MaximumFGDistance > 85) {
      warnings.push({
        field: 'specialTeams',
        message: 'Maximum field goal distance seems unusual. Typical range is 15-85 yards.',
        severity: 'warning'
      });
    }
    
    const defFormations = [
      gameplan.DefFormation1,
      gameplan.DefFormation2,
      gameplan.DefFormation3,
      gameplan.DefFormation4,
      gameplan.DefFormation5
    ];
    
    const emptyDefFormations = defFormations.filter(formation => !formation || formation.length === 0);
    if (emptyDefFormations.length > 0 && emptyDefFormations.length < 5) {
      warnings.push({
        field: 'defense',
        message: `${emptyDefFormations.length} defensive formation(s) not set. This may limit defensive flexibility.`,
        severity: 'warning'
      });
    }
    
    const isValid = errors.length === 0;
    const canSave = isValid && canModify;
    
    return {
      isValid,
      errors,
      warnings,
      playTypeTotals,
      formationWeights,
      canSave
    };
  }, [gameplan, players, league, canModify, opponentScheme]);

  return validation;
};

export default useGameplanValidation;