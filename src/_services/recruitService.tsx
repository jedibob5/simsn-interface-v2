import { bbaUrl, hckUrl } from "../_constants/urls";
import { PostCall } from "../_helper/fetchHelper";
import {
  PlayerRecruitProfile as BBAPlayerRecruitProfile,
  UpdateRecruitingBoardDto as BBAUpdateRecruitingBoardDto,
} from "../models/basketballModels";
import {
  RecruitPlayerProfile as HCKRecruitPlayerProfile,
  UpdateRecruitingBoardDTO as HCKUpdateRecruitingBoardDTO,
  UpdateRecruitProfileDto as HCKUpdateRecruitProfileDto,
} from "../models/hockeyModels";

export const RecruitService = {
  HCKCreateRecruitProfile: async (
    dto: any
  ): Promise<HCKRecruitPlayerProfile> => {
    return await PostCall(`${hckUrl}recruiting/add/recruit/`, dto);
  },

  HCKRemoveCrootFromBoard: async (
    dto: any
  ): Promise<HCKUpdateRecruitProfileDto> => {
    return await PostCall(`${hckUrl}recruiting/remove/recruit/`, dto);
  },

  HCKToggleScholarship: async (dto: any): Promise<HCKRecruitPlayerProfile> => {
    return await PostCall(`${hckUrl}recruiting/toggle/scholarship/`, dto);
  },

  HCKScoutRecruitingAttribute: async (
    dto: any
  ): Promise<HCKRecruitPlayerProfile> => {
    return await PostCall(`${hckUrl}recruiting/scout/attribute/`, dto);
  },

  HCKSaveRecruitingBoard: async (
    dto: any
  ): Promise<HCKUpdateRecruitingBoardDTO> => {
    return await PostCall(`${hckUrl}recruiting/save/board/`, dto);
  },

  HCKSaveAISettings: async (dto: any): Promise<HCKUpdateRecruitingBoardDTO> => {
    return await PostCall(`${hckUrl}recruiting/save/ai/`, dto);
  },

  BBACreateRecruitProfile: async (
    dto: any
  ): Promise<BBAPlayerRecruitProfile> => {
    return await PostCall(`${bbaUrl}recruiting/add/recruit/`, dto);
  },

  BBARemoveCrootFromBoard: async (
    dto: any
  ): Promise<BBAPlayerRecruitProfile> => {
    return await PostCall(`${bbaUrl}recruiting/remove/recruit/`, dto);
  },

  BBAToggleScholarship: async (dto: any): Promise<BBAPlayerRecruitProfile> => {
    return await PostCall(`${bbaUrl}recruiting/toggle/scholarship/`, dto);
  },

  BBASaveRecruitingBoard: async (
    dto: any
  ): Promise<BBAUpdateRecruitingBoardDto> => {
    return await PostCall(`${bbaUrl}recruiting/save/board/`, dto);
  },

  BBASaveAISettings: async (dto: any): Promise<BBAUpdateRecruitingBoardDto> => {
    return await PostCall(`${bbaUrl}recruiting/save/ai/`, dto);
  },
};
