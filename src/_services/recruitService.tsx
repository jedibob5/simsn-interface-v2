import { fbaUrl, bbaUrl, hckUrl } from "../_constants/urls";
import { GetExportCall, PostCall, PUTCall } from "../_helper/fetchHelper";
import {
  PlayerRecruitProfile as BBAPlayerRecruitProfile,
  UpdateRecruitingBoardDto as BBAUpdateRecruitingBoardDto,
} from "../models/basketballModels";
import {
  RecruitPlayerProfile as HCKRecruitPlayerProfile,
  UpdateRecruitingBoardDTO as HCKUpdateRecruitingBoardDTO,
  UpdateRecruitProfileDto as HCKUpdateRecruitProfileDto,
} from "../models/hockeyModels";
import {
  RecruitPlayerProfile as FBARecruitPlayerProfile,
  UpdateRecruitingBoardDTO as FBAUpdateRecruitingBoardDTO,
} from "../models/footballModels";

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

  ExportCHLRecruits: async () => {
    await GetExportCall(`${hckUrl}export/college/recruits/all`, "blob");
  },

  FBACreateRecruitProfile: async (
    dto: any
  ): Promise<FBARecruitPlayerProfile> => {
    return await PostCall(`${fbaUrl}recruiting/addrecruit/`, dto);
  },

  FBAToggleScholarship: async (dto: any): Promise<FBARecruitPlayerProfile> => {
    return await PostCall(`${fbaUrl}recruiting/toggleScholarship/`, dto);
  },

  FBARemovePlayerFromBoard: async (
    dto: any
  ): Promise<FBARecruitPlayerProfile> => {
    return await PUTCall(`${fbaUrl}recruiting/removecrootfromboard/`, dto);
  },

  FBASaveRecruitingBoard: async (
    dto: any
  ): Promise<FBAUpdateRecruitingBoardDTO> => {
    return await PostCall(`${fbaUrl}recruiting/savecrootboard/`, dto);
  },

  FBAToggleAIBehavior: async (
    dto: any
  ): Promise<FBAUpdateRecruitingBoardDTO> => {
    return await PostCall(`${fbaUrl}recruiting/save/ai/`, dto);
  },

  ExportCFBCroots: async () => {
    await GetExportCall(`${fbaUrl}recruits/export/all/`, "blob");
  },

  ExportCBBCroots: async () => {
    await GetExportCall(`${bbaUrl}croots/export/all/`, "blob");
  },
};
