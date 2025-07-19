import React from 'react';
import { Text } from '../../../../_design/Typography';
import { getRatingColor } from '../Utils/UIUtils';

interface RatingBadgeProps {
  rating: number | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  backgroundColor?: string;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  size = 'sm',
  position = 'top-right',
  backgroundColor = 'rgba(0,0,0,0.8)',
  className = ''
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0 rounded-bl-md',
    'top-left': 'top-0 left-0 rounded-br-md',
    'bottom-right': 'bottom-0 right-0 rounded-tl-md',
    'bottom-left': 'bottom-0 left-0 rounded-tr-md'
  };

  const sizeMap = {
    xs: 'xs' as const,
    sm: 'small' as const,
    md: 'body-small' as const,
    lg: 'body' as const
  };

  const paddingMap = {
    xs: 'px-1 py-0.5',
    sm: 'px-1.5 py-0.5',
    md: 'px-2 py-1',
    lg: 'px-3 py-1.5'
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} ${paddingMap[size]} z-10 ${className}`}
      style={{ backgroundColor }}
    >
      <Text 
        variant={sizeMap[size]} 
        classes={`font-bold ${getRatingColor(rating)}`}
        style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
      >
        {rating}
      </Text>
    </div>
  );
};

export default RatingBadge;