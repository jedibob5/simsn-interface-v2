import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CollegePlayer as CFBPlayer, NFLPlayer, CollegeDepthChartPosition, NFLDepthChartPosition } from '../../../../models/footballModels';
import { SimCFB, SimNFL } from '../../../../_constants/constants';
import { Text } from '../../../../_design/Typography';
import { SelectDropdown } from '../../../../_design/Select';
import { SelectOption } from '../../../../_hooks/useSelectStyles';
import { useSimFBAStore } from '../../../../context/SimFBAContext';
import { Button } from '../../../../_design/Buttons';
import { SingleValue } from 'react-select';
import FormationView from './FormationView';
import DepthChartManager from './DepthChartManager';
import { useDepthChartValidation } from './useDepthChartValidation';
import { DepthChartService, UpdateDepthChartDTO, UpdateNFLDepthChartDTO } from '../../../../_services/depthChartService';
import ValidationToast from '../Common/ValidationToast';
import { CFBPlayerInfoModalBody, NFLDepthChartInfoModalBody } from '../../../Common/Modals';
import { useModal } from '../../../../_hooks/useModal';
import { Modal } from '../../../../_design/Modal';
import { useResponsive } from '../../../../_hooks/useMobile';

interface DepthChartViewProps {
  players: (CFBPlayer | NFLPlayer)[];
  depthChart: any;
  team: any;
  league: typeof SimCFB | typeof SimNFL;
  onDepthChartUpdate: (updatedDepthChart: any) => void;
  onTeamChange?: (team: any) => void;
  canModify?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  accentColor?: string;
  borderTextColor?: string;
  backgroundTextColor?: string;
  onHasUnsavedChangesChange?: (hasUnsavedChanges: boolean) => void;
}

const DepthChartView: React.FC<DepthChartViewProps> = ({
  players,
  depthChart,
  team,
  league,
  onDepthChartUpdate,
  onTeamChange,
  canModify = true,
  borderColor,
  backgroundColor,
  accentColor,
  borderTextColor,
  backgroundTextColor,
  onHasUnsavedChangesChange
}) => {
  const [localDepthChart, setLocalDepthChart] = useState(depthChart);
  const [selectedPosition, setSelectedPosition] = useState<string>('QB');
  const [selectedFormationType, setSelectedFormationType] = useState<'offense' | 'defense' | 'specialteams'>('offense');
  const [isSaving, setIsSaving] = useState(false);
  const { cfbTeamOptions, nflTeamOptions, cfbTeamMap, proTeamMap, saveCFBDepthChart, saveNFLDepthChart } = useSimFBAStore();
  const [modalPlayer, setModalPlayer] = useState<CFBPlayer | NFLPlayer | null>(null);
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const { isDesktop } = useResponsive();
  
  const validation = useDepthChartValidation({
    depthChart: localDepthChart,
    players,
    league,
    canModify
  });
  
  const teamOptions = league === SimCFB ? cfbTeamOptions : nflTeamOptions;
  const teamMap = league === SimCFB ? cfbTeamMap : proTeamMap;

  const handleTeamSelection = useCallback((selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption && teamMap && onTeamChange) {
      const teamId = Number(selectedOption.value);
      const selectedTeam = teamMap[teamId];
      if (selectedTeam) {
        onTeamChange(selectedTeam);
      }
    }
  }, [teamMap, onTeamChange]);

  const handlePositionSelection = useCallback((position: string) => {
    setSelectedPosition(position);
  }, []);

  const handleFormationTypeChange = useCallback((formationType: 'offense' | 'defense' | 'specialteams') => {
    setSelectedFormationType(formationType);
  }, []);

  const handlePlayerMove = useCallback((playerId: number, newPosition: string, newPositionLevel: number) => {
    if (!localDepthChart?.DepthChartPlayers) return;

    let updatedPlayers = [...localDepthChart.DepthChartPlayers];
    
    const existingPlayerIndex = updatedPlayers.findIndex(
      dcPlayer => dcPlayer.PlayerID === playerId
    );

    const occupiedIndex = updatedPlayers.findIndex(
      dcPlayer => dcPlayer.Position === newPosition && String(dcPlayer.PositionLevel) === String(newPositionLevel)
    );

    if (existingPlayerIndex !== -1) {
      const existingPlayer = updatedPlayers[existingPlayerIndex];
      
      if (occupiedIndex !== -1 && occupiedIndex !== existingPlayerIndex) {
        const occupiedPlayer = updatedPlayers[occupiedIndex];
        
        const swapData: any = {
          ...occupiedPlayer,
          PlayerID: existingPlayer.PlayerID,
          FirstName: existingPlayer.FirstName,
          LastName: existingPlayer.LastName,
          OriginalPosition: existingPlayer.OriginalPosition,
        };
        
        const existingSwapData: any = {
          ...existingPlayer,
          PlayerID: occupiedPlayer.PlayerID,
          FirstName: occupiedPlayer.FirstName,
          LastName: occupiedPlayer.LastName,
          OriginalPosition: occupiedPlayer.OriginalPosition,
        };
        
        if (league === SimCFB) {
          swapData.CollegePlayer = existingPlayer.CollegePlayer;
          existingSwapData.CollegePlayer = occupiedPlayer.CollegePlayer;
        } else {
          swapData.NFLPlayer = (existingPlayer as any).NFLPlayer;
          existingSwapData.NFLPlayer = (occupiedPlayer as any).NFLPlayer;
        }
        
        updatedPlayers[occupiedIndex] = swapData;
        updatedPlayers[existingPlayerIndex] = existingSwapData;
      } else {
        const targetPositionLevel = updatedPlayers.find(p => 
          p.Position === newPosition && String(p.PositionLevel) === String(newPositionLevel)
        )?.PositionLevel || String(newPositionLevel);
        
        updatedPlayers[existingPlayerIndex] = {
          ...existingPlayer,
          Position: newPosition,
          PositionLevel: targetPositionLevel
        };
      }
    } else {
      if (occupiedIndex !== -1) {
        const player = players.find(p => 
          (p as any).PlayerID === playerId || (p as any).ID === playerId
        );
        
        const updateData: any = {
          ...updatedPlayers[occupiedIndex],
          PlayerID: playerId,
          FirstName: player?.FirstName || '',
          LastName: player?.LastName || '',
          OriginalPosition: player?.Position || ''
        };
        
        if (league === SimCFB) {
          updateData.CollegePlayer = player || null;
        } else {
          updateData.NFLPlayer = player || null;
        }
        
        updatedPlayers[occupiedIndex] = updateData;
      } else {
        const player = players.find(p => 
          (p as any).PlayerID === playerId || (p as any).ID === playerId
        );
        
        const newEntry: any = {
          PlayerID: playerId,
          Position: newPosition,
          PositionLevel: String(newPositionLevel),
          FirstName: player?.FirstName || '',
          LastName: player?.LastName || '',
          OriginalPosition: player?.Position || '',
        };
        
        if (league === SimCFB) {
          newEntry.CollegePlayer = player || null;
        } else {
          newEntry.NFLPlayer = player || null;
        }
        
        updatedPlayers.push(newEntry);
      }
    }

    const updatedDepthChart = {
      ...localDepthChart,
      DepthChartPlayers: updatedPlayers
    };

    setLocalDepthChart(updatedDepthChart);
  }, [localDepthChart, players]);

  const handleSaveDepthChart = useCallback(async () => {
    if (!validation.isValid || !canModify || isSaving || !localDepthChart) {
      return;
    }

    setIsSaving(true);
    try {
      const dto = {
        DepthChartID: localDepthChart.DepthChartPlayers[0].DepthChartID,
        UpdatedPlayerPositions: localDepthChart.DepthChartPlayers?.map((dcPlayer: any) => {
          const positionData = {
            ID: dcPlayer.ID,
            DepthChartID: dcPlayer.DepthChartID,
            PlayerID: dcPlayer.PlayerID,
            Position: dcPlayer.Position,
            PositionLevel: dcPlayer.PositionLevel,
            FirstName: dcPlayer.FirstName,
            LastName: dcPlayer.LastName,
            OriginalPosition: league === SimCFB 
              ? (dcPlayer.CollegePlayer?.Position || dcPlayer.OriginalPosition)
              : (dcPlayer.NFLPlayer?.Position || dcPlayer.OriginalPosition)
          };
          
          return positionData;
        }) || []
      };

      if (league === SimCFB) {
        await saveCFBDepthChart(dto);
      } else {
        await saveNFLDepthChart(dto);
      }
    } catch (error) {
      console.error('Error saving depth chart:', error);
    } finally {
      setIsSaving(false);
    }
  }, [validation.isValid, canModify, isSaving, localDepthChart, players, league, saveCFBDepthChart, saveNFLDepthChart, onDepthChartUpdate]);

  const handleResetDepthChart = useCallback(() => {
    setLocalDepthChart(depthChart);
  }, [depthChart]);

  const hasUnsavedChanges = useMemo(() => {
    if (!localDepthChart || !depthChart) return false;
    
    const localPlayers = localDepthChart.DepthChartPlayers || [];
    const originalPlayers = depthChart.DepthChartPlayers || [];
    
    if (localPlayers.length !== originalPlayers.length) return true;
    
    return localPlayers.some((localPlayer: any, index: number) => {
      const originalPlayer = originalPlayers[index];
      return localPlayer.PlayerID !== originalPlayer.PlayerID ||
             localPlayer.Position !== originalPlayer.Position ||
             localPlayer.PositionLevel !== originalPlayer.PositionLevel;
    });
  }, [localDepthChart, depthChart]);

  useEffect(() => {
    if (onHasUnsavedChangesChange) {
      onHasUnsavedChangesChange(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onHasUnsavedChangesChange]);

  const openModal = (player: CFBPlayer | NFLPlayer) => {
    handleOpenModal();
    setModalPlayer(player);
  };

  return (
      <div className="w-full">
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalPlayer ? `${modalPlayer.Position} ${modalPlayer.Archetype} ${modalPlayer.FirstName} ${modalPlayer.LastName}` : ''}
          maxWidth="max-w-4xl"
        >
          {modalPlayer && (
            league === SimCFB ? (
              <CFBPlayerInfoModalBody
                player={modalPlayer as CFBPlayer}
              />
            ) : (
              <NFLDepthChartInfoModalBody
                player={modalPlayer as NFLPlayer}
              />
            )
          )}
        </Modal>
        <ValidationToast
          errors={validation.errors}
          warnings={validation.warnings}
          isValid={validation.isValid}
          contextName="Depth Chart"
        />
        <div className="grid grid-cols-1 3xl:grid-cols-3 gap-8">
        {isDesktop && (
          <div className="relative col-span-2">
            <div className="text-center pb-4">
              <Text variant="h3" classes="text-white font-bold">
                {selectedFormationType === 'offense' ? 'Offensive Depth Chart' : 
                 selectedFormationType === 'defense' ? 'Defensive Depth Chart' : 
                 'Special Teams Depth Chart'}
              </Text>
              <Text variant="body" classes="text-gray-400 mt-2">
                Visual representation of your depth chart
              </Text>
            </div>
            <FormationView
              formationType={selectedFormationType}
              players={players}
              depthChart={localDepthChart}
              team={team}
              league={league}
              borderColor={borderColor}
              backgroundColor={backgroundColor}
              accentColor={accentColor}
              openModal={openModal}
              borderTextColor={borderTextColor}
            />
            <div className="mt-4 text-center">
              <Text variant="small" classes="text-gray-400">
                Visual representation of your saved depth chart
              </Text>
            </div>
          </div>
        )}
          <div className="relative">
            <div className="text-center">
              <Text variant="h3" classes="text-white font-bold mb-2">
                Depth Chart Management
              </Text>
              <Text variant="body" classes="text-gray-400 mb-4">
                Select a position below to manage its depth chart
              </Text>
            </div>
            <DepthChartManager
              players={players}
              depthChart={localDepthChart}
              team={team}
              league={league}
              selectedPosition={selectedPosition}
              onPlayerMove={handlePlayerMove}
              onPositionChange={handlePositionSelection}
              onFormationTypeChange={handleFormationTypeChange}
              canModify={canModify}
              onSave={handleSaveDepthChart}
              onReset={handleResetDepthChart}
              isSaving={isSaving}
              isValid={validation.isValid}
              hasUnsavedChanges={hasUnsavedChanges}
              borderColor={borderColor}
              backgroundColor={backgroundColor}
              accentColor={accentColor}
            />
          </div>
        </div>
      </div>
  );
};

export default DepthChartView;