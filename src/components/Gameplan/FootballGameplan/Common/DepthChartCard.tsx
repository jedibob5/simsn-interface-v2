import React from 'react';
import { Text } from '../../../../_design/Typography';
import { Border } from '../../../../_design/Borders';
import PlayerPicture from '../../../../_utility/usePlayerFaces';
import { useTeamColors } from '../../../../_hooks/useTeamColors';
import { getTextColorBasedOnBg } from '../../../../_utility/getBorderClass';
import { SimCFB, SimNFL, ManagementCard } from '../../../../_constants/constants';
import { getPlayerOverallRating } from '../Utils/GameplanPlayerUtils';
import { 
  getSizeClasses, 
  getTextSize, 
  getPictureSize, 
  generateBackgroundPattern, 
  generateCardGradient 
} from '../Utils/ComponentStyleUtils';
import { getRatingColor } from '../Utils/UIUtils';
import { getYear } from '../../../../_utility/getYear';

interface DepthChartCardProps {
  player: any;
  team: any;
  league: typeof SimCFB | typeof SimNFL;
  classes?: string;
  size?: 'sm' | 'md' | 'lg';
  showLetterGrade?: boolean;
  position?: string;
  category?: string;
  depthChartManager?: boolean;
}

export const DepthChartCard: React.FC<DepthChartCardProps> = ({
  player,
  team,
  league,
  classes = "",
  size = 'md',
  showLetterGrade,
  category,
  depthChartManager,
}) => {
  const teamColors = useTeamColors(team?.ColorOne, team?.ColorTwo, team?.ColorThree);
  const backgroundColor = teamColors.One;
  const borderColor = teamColors.Two;
  const accentColor = teamColors.Three;
  const textColorClass = getTextColorBasedOnBg(backgroundColor);
  const sizeClasses = getSizeClasses(size, 'depthChart');
  const pictureSize = getPictureSize(size, true);
  const overallRating = getPlayerOverallRating(player, league, showLetterGrade);
  
console.log(player)
  if (!player) {
    return (
      <div className={`${sizeClasses} w-full h-full ${classes}`}>
        <Border
          classes="h-full p-1 relative overflow-hidden opacity-50"
          styles={{
            backgroundColor: '#374151',
            borderColor: '#6B7280',
            background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
          }}
        >
          <div className="flex flex-col h-full justify-center items-center">
            <Text variant="small" classes="text-gray-400 text-center">
              Player Not Found
            </Text>
          </div>
        </Border>
      </div>
    );
  }

  return (
    <>
      <div
        className={`
          relative cursor-pointer select-none transition-all duration-200 
          ${classes?.includes('!w-full !h-full') ? 'w-full h-full' : `${sizeClasses} w-full h-full`}
          ${classes}
          ${depthChartManager ? '' : ``}
        `}
      >
      <Border
        classes="h-full p-4 relative overflow-hidden"
        styles={{
          backgroundColor,
          borderColor,
          background: generateCardGradient(backgroundColor),
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={generateBackgroundPattern(accentColor)}
        />
      {category === ManagementCard && (
        <div 
          className="absolute top-0 left-0 px-1 py-0.5 rounded-br-md z-10"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <Text 
            variant={getTextSize(size)} 
            classes={`font-bold`}
          >
            {player.Position}
          </Text>
        </div>
      )}
        <div 
          className="absolute top-0 right-0 px-1 rounded-bl-md py-0.5 z-10"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <Text 
            variant={getTextSize(size)} 
            classes={`font-bold ${getRatingColor(overallRating)}`}
          >
            {overallRating}
          </Text>
        </div>
        {depthChartManager && league === SimCFB && (
          <div 
          className="absolute top-8 right-0 px-1 py-0.5 rounded-bl-lg rounded-tl-lg z-10"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <Text 
            variant={getTextSize(size)} 
            classes={`font-semibold`}
          >
            {getYear(player.Year, player.IsRedshirt)}
          </Text>
        </div>
        )}
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className={`bg-white mx-auto mt-2 rounded-full overflow-hidden border-2 ${depthChartManager ? 'max-w-[2.5em] sm:max-w-[3em]' : `${pictureSize}`}`}>
            <PlayerPicture
              playerID={player?.PlayerID || player?.ID}
              team={team}
              league={league}
              classes="h-full w-full"
            />
          </div>
          <div className="text-center space-y-0.5 pb-1">
            <div>
              <Text 
                variant={getTextSize(size)} 
                classes={`font-bold ${textColorClass} leading-tight`}
              >
                {player?.FirstName || 'Unknown'}
              </Text>
              <Text 
                variant={getTextSize(size)} 
                classes={`font-bold ${textColorClass} leading-tight`}
              >
                {player?.LastName || 'Player'}
              </Text>
            {depthChartManager && (
              <div 
                  className="px-1 py-0.5 rounded-lg z-10"
                  style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              >
                <Text 
                  variant="xs" 
                  classes={`font-semibold`}
                >
                  {player.Archetype}
                </Text>
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-0 hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
      </Border>
      </div>
    </>
  );
};

export default DepthChartCard;