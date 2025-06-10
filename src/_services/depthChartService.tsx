import { fbaUrl } from "../_constants/urls";
import { PostCall, GetCall, PUTCall } from "../_helper/fetchHelper";

export const DepthChartService = {

  SaveCFBDepthChart: async (dto: any): Promise<void> => {
    await PUTCall(`${fbaUrl}gameplan/college/updatedepthchart`, dto);
  },

  SaveNFLDepthChart: async (dto: any): Promise<void> => {
    await PostCall(`${fbaUrl}gameplan/nfl/updatedepthchart`, dto);
  },
};

