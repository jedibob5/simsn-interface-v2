import { hckUrl } from "../_constants/urls";
import { PostCall } from "../_helper/fetchHelper";
import {
  FreeAgencyOffer,
  FreeAgencyOfferDTO,
  WaiverOffer,
  WaiverOfferDTO,
} from "../models/hockeyModels";

export const FreeAgencyService = {
  HCKSaveFreeAgencyOffer: async (
    dto: FreeAgencyOfferDTO
  ): Promise<FreeAgencyOffer> => {
    return await PostCall(`${hckUrl}phl/freeagency/create/offer`, dto);
  },

  HCKCancelFreeAgencyOffer: async (
    dto: FreeAgencyOfferDTO
  ): Promise<FreeAgencyOffer> => {
    return await PostCall(`${hckUrl}phl/freeagency/cancel/offer`, dto);
  },

  HCKSaveWaiverWireOffer: async (dto: WaiverOfferDTO): Promise<WaiverOffer> => {
    return await PostCall(`${hckUrl}phl/waiverwire/create/offer`, dto);
  },

  HCKCancelWaiverWireOffer: async (
    dto: WaiverOfferDTO
  ): Promise<WaiverOffer> => {
    return await PostCall(`${hckUrl}phl/waiverwire/cancel/offer`, dto);
  },
};
