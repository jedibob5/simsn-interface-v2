export type ComponentSize = 'sm' | 'md' | 'lg';

export const DEPTH_CHART_SIZE_CLASSES = {
  sm: 'w-full h-24',
  md: 'w-full h-32',
  lg: 'w-full h-36'
} as const;

export const ATTRIBUTE_CARD_SIZE_CLASSES = {
  sm: 'w-full h-40',
  md: 'w-full h-48',
  lg: 'w-full h-56'
} as const;

export const POSITION_SLOT_SIZE_CLASSES = {
  sm: 'w-20',
  md: 'w-24', 
  lg: 'w-28'
} as const;

export const POSITION_SLOT_MIN_HEIGHTS = {
  sm: 'min-h-[6rem]',
  md: 'min-h-[8rem]',
  lg: 'min-h-[9rem]'
} as const;

export const TEXT_SIZE_CLASSES = {
  sm: 'xs' as const,
  md: 'small' as const,
  lg: 'body-small' as const
};

export const PICTURE_SIZE_CLASSES = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-10 w-10'
} as const;

export const PICTURE_SIZE_CLASSES_ALT = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10', 
  lg: 'h-12 w-12'
} as const;

export const generateBackgroundPattern = (accentColor: string): React.CSSProperties => {
  return {
    backgroundImage: `linear-gradient(45deg, ${accentColor} 25%, transparent 25%), 
                      linear-gradient(-45deg, ${accentColor} 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, ${accentColor} 75%), 
                      linear-gradient(-45deg, transparent 75%, ${accentColor} 75%)`,
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
  };
};

export const generateSimpleBackgroundPattern = (accentColor: string): React.CSSProperties => {
  return {
    backgroundImage: `linear-gradient(45deg, ${accentColor} 25%, transparent 25%), 
                      linear-gradient(-45deg, ${accentColor} 25%, transparent 25%)`,
    backgroundSize: '4px 4px',
    backgroundPosition: '0 0, 2px 2px'
  };
};

export const generateCardGradient = (backgroundColor: string): string => {
  return `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`;
};

export const getSizeClasses = (size: ComponentSize, type: 'depthChart' | 'attribute' | 'positionSlot') => {
  switch (type) {
    case 'depthChart':
      return DEPTH_CHART_SIZE_CLASSES[size];
    case 'attribute':
      return ATTRIBUTE_CARD_SIZE_CLASSES[size];
    case 'positionSlot':
      return POSITION_SLOT_SIZE_CLASSES[size];
    default:
      return DEPTH_CHART_SIZE_CLASSES[size];
  }
};

export const getTextSize = (size: ComponentSize) => TEXT_SIZE_CLASSES[size];

export const getPictureSize = (size: ComponentSize, alt: boolean = false) => {
  return alt ? PICTURE_SIZE_CLASSES_ALT[size] : PICTURE_SIZE_CLASSES[size];
};

export const getMinHeight = (size: ComponentSize) => POSITION_SLOT_MIN_HEIGHTS[size];

export { 
  getPercentageStatusColor,
  getPercentageStatusBgColor,
  getAggressionLevelText,
  getAggressionLevelColor,
  getPlayTypeColor,
  getFormationWeightColor,
  getValidationBorderClass as getValidationBorderColor
} from './UIUtils';