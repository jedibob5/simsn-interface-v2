import { hckUrl } from "../_constants/urls";
import { GetCall, GetExportCall } from "../_helper/fetchHelper";
import { SearchStatsResponse } from "../models/hockeyModels";

export const StatsService = {
  HCKCollegeStatsSearch: async (dto: any): Promise<SearchStatsResponse> => {
    return await GetCall(
      `${hckUrl}statistics/interface/chl/${dto.SeasonID}/${dto.WeekID}/${dto.ViewType}/${dto.GameType}`
    );
  },

  HCKProStatsSearch: async (dto: any): Promise<SearchStatsResponse> => {
    return await GetCall(
      `${hckUrl}statistics/interface/phl/${dto.SeasonID}/${dto.WeekID}/${dto.ViewType}/${dto.GameType}`
    );
  },

  HCKCollegeStatsExport: async (dto: any): Promise<void> => {
    await GetExportCall(
      `${hckUrl}export/stats/chl/${dto.SeasonID}/${dto.WeekID}/${dto.ViewType}/${dto.GameType}`,
      "blob"
    );
  },

  HCKProStatsExport: async (dto: any): Promise<void> => {
    await GetExportCall(
      `${hckUrl}export/stats/phl/${dto.SeasonID}/${dto.WeekID}/${dto.ViewType}/${dto.GameType}`,
      "blob"
    );
  },
};
