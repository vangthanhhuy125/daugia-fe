import { ApiResponse } from "./auth";
import { PageResponse } from "./auction";

export type BidType = "MANUAL" | "AUTO";

export interface PlaceBidRequest {
  amount: number;
}

export interface BidResponse {
  auctionId: string;
  bidId: string;
  amount: number;
  currentPrice: number;
  winnerEmail: string;
  endTime: string;
  status: string;
  rejectionReason?: string;
  bidTime?: string;
}

export interface BidHistoryEntryResponse {
  id: string;
  auctionId: string;
  bidderEmailMasked: string;
  amount: number;
  bidIncrementApplied: number;
  stepNumber: number;
  bidType: BidType;
  bidTime: string; 
}

export interface LeaderboardEntryResponse {
  bidderEmail: string;
  amount: number;
}

export interface AutoBidConfigRequest {
  maxAmount: number;
}

export interface AutoBidConfigResponse {
  auctionId: string;
  maxAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}