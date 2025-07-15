import React from 'react';
import { CollegePlayer, NFLPlayer } from '../../../../models/footballModels';
import { Text } from '../../../../_design/Typography';
import { Border } from '../../../../_design/Borders';
import { useTeamColors } from '../../../../_hooks/useTeamColors';
import { getTextColorBasedOnBg } from '../../../../_utility/getBorderClass';
import { SimCFB, SimNFL } from '../../../../_constants/constants';
import { getPlayerOverallRating } from '../Utils/GameplanPlayerUtils';
import { generateSimpleBackgroundPattern, generateCardGradient } from '../Utils/ComponentStyleUtils';
import { getRatingColor } from '../Utils/UIUtils';
import { CARD_CLASSES, TRANSITIONS } from '../Constants/UIConstants';
import RatingBadge from './RatingBadge';

interface BackupPlayerCardProps {
  player: CollegePlayer | NFLPlayer | null | undefined;
  team: any;
  league: typeof SimCFB | typeof SimNFL;
  position: string;
  positionLevel: string;
  classes?: string;
  showLetterGrade?: boolean;
}

const BackupPlayerCard: React.FC<BackupPlayerCardProps> = ({
  player,
  team,
  league,
  position,
  positionLevel,
  classes = "",
  showLetterGrade
}) => {
  const teamColors = useTeamColors(team?.ColorOne, team?.ColorTwo, team?.ColorThree);
  const backgroundColor = teamColors.One;
  const borderColor = teamColors.Two;
  const accentColor = teamColors.Three;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const overallRating = getPlayerOverallRating(player, league, showLetterGrade);
  
  if (!player) {
    return (
      <div className={`${CARD_CLASSES.BASE} w-full h-full ${classes}`}>
        <Border
          classes="h-full px-2 py-1 relative overflow-hidden opacity-50"
          styles={{
            backgroundColor: '#374151',
            borderColor: '#6B7280',
            background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
          }}
        >
          <div className="flex items-center justify-center h-full">
            <Text variant="xs" classes="text-gray-400 text-center text-[10px]">
              No Player
            </Text>
          </div>
        </Border>
      </div>
    );
  }
  
  return (
    <div
      className={`
        ${CARD_CLASSES.BASE} ${TRANSITIONS.DEFAULT} w-full h-full
        ${classes}
      `}
      draggable={false}
    >
      <Border
        classes="h-full px-2 py-1 relative overflow-hidden"
        styles={{
          backgroundColor,
          borderColor,
          background: generateCardGradient(backgroundColor),
        }}
      >
        <div 
          className="absolute top-0 left-0 px-1 rounded-br-sm z-10"
          style={{ backgroundColor: accentColor }}
        >
          <Text 
            variant="xs" 
            classes={`font-bold text-[10px] ${getTextColorBasedOnBg(accentColor)}`}
          >
            {positionLevel}
          </Text>
        </div>
        <RatingBadge 
          rating={overallRating} 
          size="xs" 
          position="top-right"
          className="rounded-bl-sm" 
        />
        <div className="flex items-center justify-center h-full relative z-10 pt-5">
          <Text 
            variant="xs" 
            classes={`font-semibold ${textColorClass} leading-tight text-center text-[10px] truncate`}
          >
            {player?.FirstName?.charAt(0) || 'U'}. {player?.LastName || 'Unknown'}
          </Text>
        </div>
        <div 
          className="absolute inset-0 opacity-5"
          style={generateSimpleBackgroundPattern(accentColor)}
        />
      </Border>
    </div>
  );
};

export default BackupPlayerCard;