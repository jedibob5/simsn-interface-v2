import { hckUrl } from "../_constants/urls";
import { PostCall } from "../_helper/fetchHelper";
import {
  RecruitPlayerProfile,
  UpdateRecruitingBoardDTO,
  UpdateRecruitProfileDto,
} from "../models/hockeyModels";

export const RecruitService = {
  HCKCreateRecruitProfile: async (dto: any): Promise<RecruitPlayerProfile> => {
    return await PostCall(`${hckUrl}recruiting/add/recruit/`, dto);
  },

  HCKRemoveCrootFromBoard: async (
    dto: any
  ): Promise<UpdateRecruitProfileDto> => {
    return await PostCall(`${hckUrl}recruiting/remove/recruit/`, dto);
  },

  HCKToggleScholarship: async (dto: any): Promise<RecruitPlayerProfile> => {
    return await PostCall(`${hckUrl}recruiting/toggle/scholarship/`, dto);
  },

  HCKScoutRecruitingAttribute: async (
    dto: any
  ): Promise<RecruitPlayerProfile> => {
    return await PostCall(`${hckUrl}recruiting/scout/attribute/`, dto);
  },

  HCKSaveRecruitingBoard: async (
    dto: any
  ): Promise<UpdateRecruitingBoardDTO> => {
    return await PostCall(`${hckUrl}recruiting/save/board/`, dto);
  },

  HCKSaveAISettings: async (dto: any): Promise<UpdateRecruitingBoardDTO> => {
    return await PostCall(`${hckUrl}recruiting/save/ai/`, dto);
  },
};
