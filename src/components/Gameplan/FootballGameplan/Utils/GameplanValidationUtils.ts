import { GameplanValidationResult } from '../Gameplan/useGameplanValidation';
import { getValidationTextColor, getValidationBgColor, getValidationBorderClass } from './UIUtils';

export const getFieldError = (validation: GameplanValidationResult, field: string): string | undefined => {
  return validation.errors.find(error => error.field === field)?.message;
};

export const getFieldWarning = (validation: GameplanValidationResult, field: string): string | undefined => {
  return validation.warnings.find(warning => warning.field === field)?.message;
};

export const getValidationStatusColor = (hasError: boolean, hasWarning: boolean): string => {
  return getValidationTextColor(hasError, hasWarning);
};

export const getValidationStatusBgColor = (hasError: boolean, hasWarning: boolean): string => {
  return getValidationBgColor(hasError, hasWarning);
};

export const getValidationStatusText = (errorCount: number, warningCount: number): string => {
  if (errorCount > 0) {
    return `${errorCount} error${errorCount > 1 ? 's' : ''}`;
  }
  if (warningCount > 0) {
    return `${warningCount} warning${warningCount > 1 ? 's' : ''}`;
  }
  return 'Valid gameplan';
};

export const getValidationSummary = (validation: GameplanValidationResult) => {
  const errorCount = validation.errors.length;
  const warningCount = validation.warnings.length;
  const hasError = errorCount > 0;
  const hasWarning = warningCount > 0;
  
  return {
    text: getValidationStatusText(errorCount, warningCount),
    color: getValidationStatusColor(hasError, hasWarning),
    bgColor: getValidationStatusBgColor(hasError, hasWarning),
    hasError,
    hasWarning,
    errorCount,
    warningCount
  };
};

export const hasFieldIssue = (validation: GameplanValidationResult, field: string): boolean => {
  return getFieldError(validation, field) !== undefined || getFieldWarning(validation, field) !== undefined;
};

export const getFieldBorderColor = (validation: GameplanValidationResult, field: string): string => {
  const error = getFieldError(validation, field);
  const warning = getFieldWarning(validation, field);
  
  return getValidationBorderClass(!!error, !!warning);
};