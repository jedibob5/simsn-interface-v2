import { FC } from "react";
import { League, SimCHL, SimPHL, SimCFB, SimNFL } from "../../_constants/constants";
import {
  CollegePlayer as CHLPlayer,
  Croot as CHLCroot,
  ProfessionalPlayer as PHLPlayer,
} from "../../models/hockeyModels";
import {
  CollegePlayer as CFBPlayer,
  NFLPlayer as NFLPlayer,
} from "../../models/footballModels"
import { Text } from "../../_design/Typography";
import { getLogo } from "../../_utility/getLogo";
import { useAuthStore } from "../../context/AuthContext";
import { Logo } from "../../_design/Logo";
import { useSimHCKStore } from "../../context/SimHockeyContext";
import { useSimFBAStore } from "../../context/SimFBAContext";
import { getHockeyLetterGrade } from "../../_utility/getLetterGrade";
import { getCFBLetterGrade } from "../../_utility/getLetterGrade";
import { getCFBOverall } from "../../_utility/getLetterGrade";
import {
  getCompetitivenessLabel,
  getPlaytimePreferenceLabel,
  getTeamLoyaltyLabel,
} from "../../_helper/utilHelper";
import { getCFBAttributes, getShotgunRating } from "../Team/TeamPageUtils";
import { setPriorityCFBAttributes, setPriorityNFLAttributes } from "../Team/TeamPageUtils";
import { HeightToFeetAndInches } from "../../_utility/getHeightByFeetAndInches";
import { getYear } from "../../_utility/getYear";
import PlayerPicture from "../../_utility/usePlayerFaces";

interface PlayerInfoModalBodyProps {
  league: League;
  player: any;
  capsheet?: any;
}

export const PlayerInfoModalBody: FC<PlayerInfoModalBodyProps> = ({
  player,
  league,
  capsheet
}) => {
  if (league === SimCHL) {
    return <CHLPlayerInfoModalBody player={player as CHLPlayer} />;
  }
  if (league === SimPHL) {
    return <PHLPlayerInfoModalBody player={player as PHLPlayer} />;
  }
  if (league === SimCFB) {
    return <CFBPlayerInfoModalBody player={player as CFBPlayer} />;
  }
  if (league === SimNFL) {
    return <NFLPlayerInfoModalBody player={player as NFLPlayer} capsheet={capsheet} />;
  }
  return <>Unsupported League.</>;
};

interface CHLPlayerInfoModalBodyProps {
  player: CHLPlayer;
}

export const CHLPlayerInfoModalBody: FC<CHLPlayerInfoModalBodyProps> = ({
  player,
}) => {
  const { currentUser } = useAuthStore();
  const { chlTeamMap } = useSimHCKStore();
  const team = chlTeamMap[player.TeamID];
  const teamLogo = getLogo(SimCHL, player.TeamID, currentUser?.isRetro);
  const previousTeam = chlTeamMap[player.PreviousTeamID];
  const previousTeamLogo = getLogo(
    SimCHL,
    player.PreviousTeamID,
    currentUser?.isRetro
  );
  const heightObj = HeightToFeetAndInches(player.Height);

  return (
    <div className="w-full grid grid-cols-4 gap-2">
      <div className="flex flex-col items-center px-1">
        <div className={`flex my-1 items-center justify-center 
                         px-3 h-[3rem] min-h-[3rem] sm:w-[5rem] sm:max-w-[5rem] sm:h-[5rem] rounded-lg border-2`} 
                         style={{ backgroundColor: "white" }}>
            <PlayerPicture playerID={player.ID} 
                           league="SimCHL" 
                           team={team}/>
        </div>
          {team && (
            <Logo
            url={teamLogo}
            label={team.Abbreviation}
            classes="h-[5rem] max-h-[5rem]"
            textClass="text-small"
          />)}
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Origin
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
          {player.Country.length > 0 && `${player.Country}`}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Height
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {heightObj.feet}'{heightObj.inches}"
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Overall
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {getHockeyLetterGrade(player.Overall, player.Year)}
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
            <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Youth
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.HighSchool && player.HighSchool.trim() !== "" ? player.HighSchool : "Unknown"}
            </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Weight
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Weight} lbs
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Year
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {getYear(player.Year, player.IsRedshirt)}
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Age
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.Age}
            </Text>
          </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Personality
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Personality}
          </Text>
        </div>
        <div className="flex flex-col pt-4 pb-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Stars
          </Text>
          <Text variant="xs" classes="whitespace-nowrap pt-0.5">
            {player.Stars > 0
              ? Array(player.Stars).fill("⭐").join("")
              : player.Stars}
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap col-span-4 gap-3 border-t-[0.1em] pt-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col px-1 gap-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">
              Agility
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Agility, player.Year)}
            </Text>
          </div>
      {player.Position !== "G" && (
        <>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">
              Faceoffs
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Faceoffs, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col gap-1 px-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">
              Long Shot
            </Text>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center align-center">
                <Text variant="small">
                {getHockeyLetterGrade(player.LongShotPower, player.Year)}
                </Text>
                <Text variant="xs">
                  Pow
                </Text>
              </div>
              <div className="flex flex-col">
                <Text variant="small">
                {getHockeyLetterGrade(player.LongShotAccuracy, player.Year)}
                </Text>
                <Text variant="xs">
                  Acc
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Close Shot
            </Text>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center align-center">
                <Text variant="small" classes="text-center">
                {getHockeyLetterGrade(player.CloseShotPower, player.Year)}
                </Text>
                <Text variant="xs">
                  Pow
                </Text>
              </div>
              <div className="flex flex-col">
                <Text variant="small">
                {getHockeyLetterGrade(player.CloseShotAccuracy, player.Year)}
                </Text>
                <Text variant="xs">
                  Acc
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Passing
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Passing, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Puck Handling
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.PuckHandling, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Strength
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Strength, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Body Checks
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.BodyChecking, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Stick Checks
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.StickChecking, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Shot Blocks
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.ShotBlocking, player.Year)}
            </Text>
          </div>
        </>
      )}

      {player.Position === "G" && (
        <>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Goalkeeping
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Goalkeeping, player.Year)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Goalie Vision
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.GoalieVision, player.Year)}
            </Text>
          </div>
        </>
      )}
    </div>
    </div>
    </div>
  );
};

interface PHLPlayerInfoModalBodyProps {
  player: PHLPlayer;
}

export const PHLPlayerInfoModalBody: FC<PHLPlayerInfoModalBodyProps> = ({
  player,
}) => {
  const { currentUser } = useAuthStore();
  const { phlTeamMap } = useSimHCKStore();
  const team = phlTeamMap[player.TeamID];
  const teamLogo = getLogo(SimPHL, player.TeamID, currentUser?.isRetro);
  const collegeLogo = getLogo(SimCHL, player.CollegeID, currentUser?.isRetro);
  const previousTeam = phlTeamMap[player.PreviousTeamID];
  const previousTeamLogo = getLogo(
    SimPHL,
    player.PreviousTeamID,
    currentUser?.isRetro
  );
  const heightObj = HeightToFeetAndInches(player.Height);


  return (
    <div className="w-full grid grid-cols-4 gap-2">
      <div className="flex flex-col items-center px-1">
        <div className={`flex my-1 items-center justify-center 
                         px-3 h-[3rem] min-h-[3rem] sm:w-[5rem] sm:max-w-[5rem] sm:h-[5rem] rounded-lg border-2`} 
                         style={{ backgroundColor: "white" }}>
            <PlayerPicture playerID={player.ID} 
                           league="SimPHL" 
                           team={team}/>
        </div>
          {team && (
            <Logo
            url={teamLogo}
            label={team.Abbreviation}
            classes="h-[5rem] max-h-[5rem]"
            textClass="text-small"
          />)}
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Origin
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
          {player.Country.length > 0 && `${player.Country}`}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Height
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {heightObj.feet}'{heightObj.inches}"
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Overall
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Overall}
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Experience
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Year}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Weight
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Weight} lbs
          </Text>
        </div>
        <div className="flex flex-col pb-4 pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            College
          </Text>
          {team && (
            <Logo
            url={collegeLogo}
            containerClass="pt-0"
            classes="h-[2rem] max-h-[2rem]"
            textClass="text-small"
          />)}
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Age
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.Age}
            </Text>
          </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Personality
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Personality}
          </Text>
        </div>
        <div className="flex flex-col pt-4 pb-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Drafted
          </Text>
          {player.DraftedRound === 0 && player.DraftedPick === 0 ? (
            <Text variant="small" classes="whitespace-nowrap">
              UDFA
            </Text>
          ) : (
            <>
              <Text variant="small" classes="whitespace-nowrap">
                Round {player.DraftedRound} - Pick {player.DraftedPick}
              </Text>
              <Text variant="xs" classes="whitespace-nowrap">
                by {player.DraftedTeam}
              </Text>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap col-span-4 gap-3 border-t-[0.1em] pt-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col px-1 gap-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">
              Agility
            </Text>
            <Text variant="small">
              {player.Agility}
            </Text>
          </div>
      {player.Position !== "G" && (
        <>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">
              Faceoffs
            </Text>
            <Text variant="small">
              {player.Faceoffs}
            </Text>
          </div>
          <div className="flex flex-col gap-1 px-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">
              Long Shot
            </Text>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center align-center">
                <Text variant="small">
                {player.LongShotPower}
                </Text>
                <Text variant="xs">
                  Pow
                </Text>
              </div>
              <div className="flex flex-col">
                <Text variant="small">
                {player.LongShotAccuracy}
                </Text>
                <Text variant="xs">
                  Acc
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Close Shot
            </Text>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center align-center">
                <Text variant="small" classes="text-center">
                {player.CloseShotPower}
                </Text>
                <Text variant="xs">
                  Pow
                </Text>
              </div>
              <div className="flex flex-col">
                <Text variant="small">
                {player.CloseShotAccuracy}
                </Text>
                <Text variant="xs">
                  Acc
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Passing
            </Text>
            <Text variant="small">
              {player.Passing}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Puck Handling
            </Text>
            <Text variant="small">
              {player.PuckHandling}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Strength
            </Text>
            <Text variant="small">
              {player.Strength}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Body Checks
            </Text>
            <Text variant="small">
              {player.BodyChecking}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Stick Checks
            </Text>
            <Text variant="small">
              {player.StickChecking}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Shot Blocks
            </Text>
            <Text variant="small">
              {player.ShotBlocking}
            </Text>
          </div>
        </>
      )}

      {player.Position === "G" && (
        <>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Goalkeeping
            </Text>
            <Text variant="small">
              {player.Goalkeeping}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Goalie Vision
            </Text>
            <Text variant="small">
              {player.GoalieVision}
            </Text>
          </div>
        </>
      )}
    </div>
    </div>
    </div>
  );
};

interface CFBPlayerInfoModalBodyProps {
  player: CFBPlayer;
}

export const CFBPlayerInfoModalBody: FC<CFBPlayerInfoModalBodyProps> = ({
  player,
}) => {
  const { currentUser } = useAuthStore();
  const { cfbTeamMap } = useSimFBAStore();
  const team = cfbTeamMap ? cfbTeamMap[player.TeamID] : null;
  const teamLogo = getLogo(SimCFB, player.TeamID, currentUser?.isRetro);
  const previousTeam = cfbTeamMap ? cfbTeamMap[player.PreviousTeamID] : null;
  const previousTeamLogo = getLogo(
    SimCFB,
    player.PreviousTeamID,
    currentUser?.isRetro
  );
  const heightObj = HeightToFeetAndInches(player.Height);
  const priorityAttributes = setPriorityCFBAttributes(player);

  return (
    <div className="w-full grid grid-cols-4 gap-2">
      <div className="flex flex-col items-center px-1">
        <div className={`flex my-1 items-center justify-center 
                        px-3 h-[3rem] min-h-[3rem] sm:w-[5rem] sm:max-w-[5rem] sm:h-[5rem] rounded-lg border-2`} 
                        style={{ backgroundColor: "white" }}>
            <PlayerPicture playerID={player.ID} 
                           league="SimCFB" 
                           team={team}/>
        </div>
        {team && (
          <Logo
          url={teamLogo}
          label={team.TeamAbbr}
          classes="h-[5rem] max-h-[5rem]"
          textClass="text-small"
        />)}
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Origin
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
          {player.City.length > 0 && `${player.City}, `}
          {player.State.length > 0 && `${player.State} `}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Height
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {heightObj.feet}'{heightObj.inches}"
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Overall
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {getCFBOverall(player.Overall, player.Year)}
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Year
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {getYear(player.Year, player.IsRedshirt)}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Weight
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Weight} lbs
          </Text>
        </div>
        <div className="flex flex-col pt-4">
            <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Potential
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.PotentialGrade}
            </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Age
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.Age}
            </Text>
          </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Personality
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Personality}
          </Text>
        </div>
        <div className="flex flex-col pt-4 pb-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Stars
          </Text>
          <Text variant="xs" classes="whitespace-nowrap pt-0.5">
            {player.Stars > 0
              ? Array(player.Stars).fill("⭐").join("")
              : player.Stars}
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap col-span-4 gap-3 border-t-[0.1em] pt-4">
        <div className="grid grid-cols-4 gap-3">
          {priorityAttributes.map((attr, idx) => (
          <div key={idx} className="flex flex-col gap-1 px-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">{attr.Name}</Text>
            <Text variant="small">{attr.Letter}</Text>
          </div>
      ))}
        </div>
      </div>
    </div>
  );
};

interface NFLPlayerInfoModalBodyProps {
  player: NFLPlayer;
  capsheet: any;
}

export const NFLPlayerInfoModalBody: FC<NFLPlayerInfoModalBodyProps> = ({
  player,
  capsheet
}) => {
  const { currentUser } = useAuthStore();
  const { proTeamMap: nflTeamMap } = useSimFBAStore();
  const team = nflTeamMap ? nflTeamMap[player.TeamID] : null;
  const teamLogo = getLogo(SimNFL, player.TeamID, currentUser?.isRetro);
  const collegeLogo = getLogo(SimCFB, player.CollegeID, currentUser?.isRetro);
  const previousTeam = nflTeamMap ? nflTeamMap[player.PreviousTeamID] : null;
  const previousTeamLogo = getLogo(
    SimNFL,
    player.PreviousTeamID,
    currentUser?.isRetro
  );
  const heightObj = HeightToFeetAndInches(player.Height);
  const priorityAttributes = setPriorityNFLAttributes(player);

  return (
    <div className="w-full grid grid-cols-4 gap-2">
      <div className="flex flex-col items-center px-1">
        <div className={`flex my-1 items-center justify-center 
                        px-3 h-[3rem] min-h-[3rem] sm:w-[5rem] sm:max-w-[5rem] sm:h-[5rem] rounded-lg border-2`} 
                        style={{ backgroundColor: "white" }}>
            <PlayerPicture playerID={player.ID} 
                           league="SimNFL" 
                           team={team}/>
        </div>
        <div>
          {team && (
            <Logo
            url={teamLogo}
            containerClass="pt-0"
            label={team.Mascot}
            classes="h-[5rem] max-h-[5rem]"
            textClass="text-small"
          />)}
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Hometown
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
          {player.Hometown.length > 0 && `${player.Hometown}, `}
          {player.State.length > 0 && `${player.State} `}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Height
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {heightObj.feet}'{heightObj.inches}"
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Overall
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Overall}
          </Text>
        </div>
        <div className="flex flex-col col-span-2 pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Contract
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Contract?.Y1BaseSalary}
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Experience
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Experience}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Weight
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Weight} lbs
          </Text>
        </div>
        <div className="flex flex-col pt-4">
            <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Potential
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.PotentialGrade}
            </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
              Age
            </Text>
            <Text variant="small" classes="whitespace-nowrap">
              {player.Age}
            </Text>
          </div>
        <div className="flex flex-col pt-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Personality
          </Text>
          <Text variant="small" classes="whitespace-nowrap">
            {player.Personality}
          </Text>
        </div>
        <div className="flex flex-col pt-4 pb-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            Drafted
          </Text>
          {player.DraftedRound === 0 && player.DraftedPick === 0 ? (
            <Text variant="small" classes="whitespace-nowrap">
              UDFA
            </Text>
          ) : (
            <>
              <Text variant="small" classes="whitespace-nowrap">
                Round {player.DraftedRound} - Pick {player.DraftedPick}
              </Text>
              <Text variant="xs" classes="whitespace-nowrap">
                by {player.DraftedTeam}
              </Text>
            </>
          )}
        </div>
        <div className="flex flex-col pb-4">
          <Text variant="body" classes="mb-1 whitespace-nowrap font-semibold">
            College
          </Text>
          {team && (
            <Logo
            url={collegeLogo}
            containerClass="pt-0"
            classes="h-[2rem] max-h-[2rem]"
            textClass="text-small"
          />)}
        </div>
      </div>
      <div className="flex flex-wrap col-span-4 gap-3 border-t-[0.1em] pt-4">
        <div className="grid grid-cols-4 gap-4">
          {priorityAttributes.map((attr, idx) => (
          <div key={idx} className="flex flex-col gap-1 px-1">
            <Text variant="small" classes="mb-1 whitespace-nowrap font-semibold">{attr.Name}</Text>
            <Text variant="small">{attr.Value}</Text>
          </div>
      ))}
        </div>
      </div>
    </div>
  );
};

export const RecruitInfoModalBody: FC<PlayerInfoModalBodyProps> = ({
  player,
  league,
}) => {
  if (league === SimCHL) {
    return <CHLCrootInfoModalBody player={player as CHLCroot} />;
  }

  return <>Unsupported League.</>;
};

interface CHLCrootInfoModalBodyProps {
  player: CHLCroot;
}

export const CHLCrootInfoModalBody: FC<CHLCrootInfoModalBodyProps> = ({
  player,
}) => {
  const { currentUser } = useAuthStore();
  const { chlTeamMap } = useSimHCKStore();
  const team = chlTeamMap[player.TeamID];
  const teamLogo = getLogo(SimCHL, player.TeamID, currentUser?.isRetro);
  const heightObj = HeightToFeetAndInches(player.Height);

  return (
    <div className="w-full grid grid-cols-4 gap-2 overflow-y-auto">
      <div className="flex flex-col items-center px-1">
        <div className={`flex my-1 items-center justify-center 
                         px-3 h-[3rem] min-h-[3rem] sm:w-[5rem] sm:max-w-[5rem] sm:h-[5rem] rounded-lg border-2`} 
                         style={{ backgroundColor: "white" }}>
          <PlayerPicture playerID={player.ID} 
                           league="SimCHL" 
                           team={team}/>
        </div>
          {team && player.IsSigned && (
            <Logo
            url={teamLogo}
            label={team.Abbreviation}
            classes="h-[5rem] max-h-[5rem]"
            textClass="text-small"
          />)}
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
          <Text variant="h6" classes="mb-1 whitespace-nowrap">
            Origin
          </Text>
          <Text variant="body-small" classes="whitespace-nowrap">
          {player.Country.length > 0 && `${player.Country}`}
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="h6" classes="mb-1 whitespace-nowrap">
            Height
          </Text>
          <Text variant="body-small" classes="whitespace-nowrap">
            {heightObj.feet}'{heightObj.inches}"
          </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="h6" classes="mb-1 whitespace-nowrap">
            Overall
          </Text>
          <Text variant="body-small" classes="whitespace-nowrap">
            {player.OverallGrade}
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col">
            <Text variant="h6" classes="mb-1 whitespace-nowrap">
              Youth
            </Text>
            <Text variant="body-small" classes="">
              {player.HighSchool && player.HighSchool.trim() !== "" ? player.HighSchool : "Unknown"}
            </Text>
        </div>
        <div className="flex flex-col pt-4">
          <Text variant="h6" classes="mb-1 whitespace-nowrap">
            Weight
          </Text>
          <Text variant="body-small" classes="whitespace-nowrap">
            {player.Weight} lbs
          </Text>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <div className="flex flex-col pt-4">
          <Text variant="h6" classes="mb-1 whitespace-nowrap">
            Personality
          </Text>
          <Text variant="body-small" classes="whitespace-nowrap">
            {player.Personality}
          </Text>
        </div>
        <div className="flex flex-col pt-4 pb-4">
          <Text variant="h6" classes="mb-1 whitespace-nowrap">
            Stars
          </Text>
          <Text variant="xs" classes="whitespace-nowrap pt-0.5">
            {player.Stars > 0
              ? Array(player.Stars).fill("⭐").join("")
              : player.Stars}
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap col-span-4 gap-3 border-t-[0.1em] pt-2">
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Agility
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Agility, 1)}
            </Text>
          </div>
      {player.Position !== "G" && (
        <>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Faceoffs
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Faceoffs, 1)}
            </Text>
          </div>
          <div className="flex flex-col gap-1 px-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Long Shot
            </Text>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center align-center">
                <Text variant="small">
                {getHockeyLetterGrade(player.LongShotPower, 1)}
                </Text>
                <Text variant="xs">
                  Pow
                </Text>
              </div>
              <div className="flex flex-col">
                <Text variant="small">
                {getHockeyLetterGrade(player.LongShotAccuracy, 1)}
                </Text>
                <Text variant="xs">
                  Acc
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Close Shot
            </Text>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center align-center">
                <Text variant="small" classes="text-center">
                {getHockeyLetterGrade(player.CloseShotPower, 1)}
                </Text>
                <Text variant="xs">
                  Pow
                </Text>
              </div>
              <div className="flex flex-col">
                <Text variant="small">
                {getHockeyLetterGrade(player.CloseShotAccuracy, 1)}
                </Text>
                <Text variant="xs">
                  Acc
                </Text>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Passing
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Passing, 1)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Puck Handling
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.PuckHandling, 1)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Strength
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Strength, 1)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Body Checks
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.BodyChecking, 1)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Stick Checks
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.StickChecking, 1)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Shot Blocks
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.ShotBlocking, 1)}
            </Text>
          </div>
        </>
      )}

      {player.Position === "G" && (
        <>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Goalkeeping
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.Goalkeeping, 1)}
            </Text>
          </div>
          <div className="flex flex-col px-1 gap-1">
            <Text variant="body-small" classes="mb-1 whitespace-nowrap font-semibold">
              Goalie Vision
            </Text>
            <Text variant="small">
              {getHockeyLetterGrade(player.GoalieVision, 1)}
            </Text>
          </div>
        </>
      )}
    </div>
      </div>
    </div>
  );
};