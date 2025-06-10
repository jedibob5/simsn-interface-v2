import { fbaUrl, hckUrl } from "../_constants/urls";
import { GetCall, PostCall } from "../_helper/fetchHelper";
import { CollegePollSubmission as HCKPollSubmission } from "../models/hockeyModels";
import { 
  CollegePollSubmission as FBAPollSubmission, 
  PollDataResponse as FBAPollDataResponse 
} from "../models/footballModels";

export const CollegePollService = {
  HCKSubmitPoll: async (dto: any): Promise<HCKPollSubmission> => {
    return await PostCall(`${hckUrl}college/poll/create/`, dto);
  },

  FBAGetTeamDataForPollForm: async (): Promise<FBAPollDataResponse> => {
    return await GetCall(`${fbaUrl}college/poll/page/`);
  },

  FBAGetSubmittedPoll: async (): Promise<FBAPollSubmission> => {
    return await GetCall(`${fbaUrl}college/poll/get/`);
  },

  FBAGetOfficialPollData: async (): Promise<FBAPollDataResponse> => {
    return await GetCall(`${fbaUrl}college/poll/official/`);
  },

  FBASubmitPoll: async (dto: FBAPollSubmission): Promise<FBAPollSubmission> => {
    return await PostCall(`${fbaUrl}college/poll/submit/`, dto);
  },
};
