import React from 'react';
import { CollegePlayer as CFBPlayer, NFLPlayer } from '../../../../models/footballModels';
import PositionSlot from './PositionSlot';
import { SimCFB, SimNFL } from '../../../../_constants/constants';
import { Text } from '../../../../_design/Typography';

interface FormationViewProps {
  formationType: 'offense' | 'defense' | 'specialteams';
  players: (CFBPlayer | NFLPlayer)[];
  depthChart: any;
  team: any;
  league: typeof SimCFB | typeof SimNFL;
  borderColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  borderTextColor?: string;
  openModal: (player: CFBPlayer | NFLPlayer) => void;
}

const FormationView: React.FC<FormationViewProps> = ({
  formationType,
  players,
  depthChart,
  team,
  league,
  borderColor,
  backgroundColor,
  accentColor,
  borderTextColor,
  openModal
}) => {
  
  const getOffenseFormation = () => (
    <div className="relative w-full h-[40rem] bg-gradient-to-b from-green-600 via-green-500 to-green-600 rounded-lg overflow-hidden border-2" style={{ borderColor }}>
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white opacity-30"
            style={{ top: `${8 + i * 8}%` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 grid grid-cols-14 grid-rows-12 gap-1 p-4">
        <div className="col-start-1 col-span-2 row-start-2 flex justify-center">
          <PositionSlot
            position="WR"
            positionLevels={4} 
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="WR1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-11 col-span-2 row-start-2 flex justify-center">
          <PositionSlot
            position="WR"
            positionLevels={4}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="WR2"
            startingLevel={2}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-10 col-span-1 row-start-2 flex justify-center">
          <PositionSlot
            position="TE"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="TE1"
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-span-5 col-start-5 row-start-3 flex justify-center items-center gap-1">
          <PositionSlot
            position="LT"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="LT1"
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="LG"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="LG1"
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="C"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="C1"
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="RG"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="RG1"
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="RT"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="RT1"
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-6 col-span-1 row-start-7 flex justify-center">
          <PositionSlot
            position="RB"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="RB1"
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-7 col-span-1 row-start-6 flex justify-center">
          <PositionSlot
            position="QB"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="QB1"
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-8 col-span-1 row-start-7 flex justify-center">
          <PositionSlot
            position="FB"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="FB1"
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="row-start-12 row-span-12 rounded-lg bg-opacity-75 col-span-12 border-2" style={{ backgroundColor: borderColor, borderColor: accentColor }}>
          <div className="flex items-center justify-center w-full h-full">
            <Text variant="h1" classes={`uppercase ${borderTextColor}`}>{league === SimCFB ? team.TeamName : team.Mascot}</Text>
          </div>
        </div>
      </div>
    </div>
  );

  const getDefenseFormation = () => (
    <div className="relative w-full h-[40rem] bg-gradient-to-b from-green-600 via-green-500 to-green-600 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white opacity-30"
            style={{ top: `${8 + i * 8}%` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 grid grid-cols-14 grid-rows-12 gap-1 p-4">
        <div className="col-span-7 col-start-4 row-start-9 flex justify-center items-start gap-2">
          <PositionSlot
            position="LE"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="LE1"
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="DT"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="DT1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="DT"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="DT2"
            startingLevel={2}
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="RE"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="RE1"
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-span-9 col-start-3 row-start-6 flex justify-center items-center gap-6">
          <PositionSlot
            position="ROLB"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="ROLB1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
          <PositionSlot
            position="MLB"
            positionLevels={2}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="MLB1"
            startingLevel={1}
            showBackupBelow={false}
            openModal={openModal}
          />
          <PositionSlot
            position="MLB"
            positionLevels={2}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="MLB2"
            startingLevel={2}
            showBackupBelow={false}
            openModal={openModal}
          />
          <PositionSlot
            position="LOLB"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="LOLB1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-1 col-span-2 row-start-5 flex justify-center">
          <PositionSlot
            position="CB"
            positionLevels={5}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="CB1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-12 col-span-2 row-start-5 flex justify-center">
          <PositionSlot
            position="CB"
            positionLevels={5}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="CB2"
            startingLevel={2}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-1 col-[14_/_span_14] row-start-1 row-span-2 rounded-lg border-2" style={{ backgroundColor: borderColor, borderColor: accentColor }}>
          <div className="flex items-center justify-center w-full h-full">
            <Text variant="h1" classes="uppercase">{league === SimCFB ? team.TeamName : team.Mascot}</Text>
          </div>
        </div>
        <div className="col-start-3 col-span-1 row-start-3 flex justify-center">
          <PositionSlot
            position="FS"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="FS1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-11 col-span-1 row-start-3 flex justify-center">
          <PositionSlot
            position="SS"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="SS1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
      </div>
    </div>
  );

  const getSpecialTeamsFormation = () => (
    <div className="relative w-full h-[40rem] bg-gradient-to-b from-green-600 via-green-500 to-green-600 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white opacity-30"
            style={{ top: `${8 + i * 8}%` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 grid grid-cols-14 grid-rows-12 gap-1 p-4">
        <div className="col-start-2 col-span-1 row-start-9 flex justify-center">
          <PositionSlot
            position="K"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="K1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-3 col-span-1 row-start-9 flex justify-center">
          <PositionSlot
            position="P"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="P1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-span-12 col-start-1 row-start-1 justify-center grid grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((level) => (
            <div key={level} className="flex justify-center items-center w-full">
              <PositionSlot
                position="STU"
                positionLevels={15}
                players={players}
                depthChart={depthChart}
                team={team}
                league={league}
                size="md"
                label={`STU${level}`}
                startingLevel={level}
                showBackupBelow={false}
                openModal={openModal}
              />
            </div>
          ))}
        </div>
        <div className="col-start-12 col-span-1 row-start-9 flex justify-center">
          <PositionSlot
            position="KR"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="KR1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-13 col-span-1 row-start-9 flex justify-center">
          <PositionSlot
            position="PR"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="PR1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
        <div className="col-start-1 col-span-1 row-start-9 flex justify-center">
          <PositionSlot
            position="FG"
            positionLevels={1}
            players={players}
            depthChart={depthChart}
            team={team}
            league={league}
            size="md"
            label="FG1"
            startingLevel={1}
            showBackupBelow={true}
            openModal={openModal}
          />
        </div>
      </div>
    </div>
  );

  switch (formationType) {
    case 'offense':
      return getOffenseFormation();
    case 'defense':
      return getDefenseFormation();
    case 'specialteams':
      return getSpecialTeamsFormation();
    default:
      return getOffenseFormation();
  }
};

export default FormationView;