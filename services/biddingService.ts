import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";
import { PageResponse } from "../types/auction";
import {
  AutoBidConfigRequest,
  AutoBidConfigResponse,
  BidHistoryEntryResponse,
  BidResponse,
  LeaderboardEntryResponse,
  PlaceBidRequest,
} from "../types/bidding";

export const biddingService = {
  placeBid: (auctionId: string, request: PlaceBidRequest): Promise<ApiResponse<BidResponse>> => {
    return apiClient.post(`/auctions/${auctionId}/bids`, request);
  },

  getBidHistory: (auctionId: string, page: number = 0, size: number = 20): Promise<ApiResponse<PageResponse<BidResponse>>> => {
    return apiClient.get(`/auctions/${auctionId}/bids`, { params: { page, size } });
  },

  getImmutableHistory: (auctionId: string, page: number = 0, size: number = 50): Promise<ApiResponse<PageResponse<BidHistoryEntryResponse>>> => {
    return apiClient.get(`/auctions/${auctionId}/history`, { params: { page, size } });
  },

  getLeaderboard: (auctionId: string): Promise<ApiResponse<LeaderboardEntryResponse[]>> => {
    return apiClient.get(`/auctions/${auctionId}/leaderboard`);
  },

  createAutoBid: (auctionId: string, request: AutoBidConfigRequest): Promise<ApiResponse<AutoBidConfigResponse>> => {
    return apiClient.post(`/auctions/${auctionId}/auto-bid`, request);
  },

  updateAutoBid: (auctionId: string, request: AutoBidConfigRequest): Promise<ApiResponse<AutoBidConfigResponse>> => {
    return apiClient.put(`/auctions/${auctionId}/auto-bid`, request);
  },

  deactivateAutoBid: (auctionId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/auctions/${auctionId}/auto-bid`);
  },

  getOwnAutoBidConfig: (auctionId: string): Promise<ApiResponse<AutoBidConfigResponse>> => {
    return apiClient.get(`/auctions/${auctionId}/auto-bid`);
  },

  getMyBiddingHistory: (page: number = 0, size: number = 999): Promise<ApiResponse<PageResponse<BidHistoryEntryResponse>>> => {
    return apiClient.get("/bidding/my", { params: { page, size } });
  },

  getOwnAutoBid: (auctionId: string) => {
    return apiClient.get(`/auctions/${auctionId}/auto-bid`);
  }
};