import { hckUrl } from "../_constants/urls";
import { GetActionCall, GetCall, PostCall } from "../_helper/fetchHelper";
import { TradePreferences, TradeProposal } from "../models/hockeyModels";

export const TradeService = {
  HCKUpdateTradePreferences: async (dto: TradePreferences): Promise<void> => {
    return await PostCall(`${hckUrl}trades/phl/preferences/update`, dto);
  },

  HCKCreateTradeProposal: async (dto: TradeProposal): Promise<void> => {
    return await PostCall(`${hckUrl}trades/phl/create/proposal`, dto);
  },

  HCKAcceptTradeProposal: async (id: number): Promise<void> => {
    await GetActionCall(`${hckUrl}trades/phl/proposal/accept/${id}`);
  },

  HCKRejectTradeProposal: async (id: number): Promise<void> => {
    await GetActionCall(`${hckUrl}trades/phl/proposal/reject/${id}`);
  },

  HCKCancelTradeProposal: async (id: number): Promise<void> => {
    await GetActionCall(`${hckUrl}trades/phl/proposal/cancel/${id}`);
  },

  HCKProcessAcceptedTrade: async (id: number): Promise<void> => {
    await GetActionCall(`${hckUrl}trades/admin/accept/sync/${id}`);
  },

  HCKVetoAcceptedTrade: async (id: number): Promise<void> => {
    await GetActionCall(`${hckUrl}trades/admin/veto/sync/${id}`);
  },

  HCKCleanupRejectedTrades: async (): Promise<void> => {
    await GetActionCall(`${hckUrl}trades/admin/cleanup`);
  },
};
