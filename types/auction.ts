import { ApiResponse } from "./auth"; 

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type AuctionStatus = "PENDING" | "APPROVED" | "ACTIVE" | "ENDED" | "REJECTED";

export interface AuctionImageResponse {
  id: number;
  imageUrl: string;
  sortOrder: number;
  uploadedAt: string; 
}

export interface AuctionSummaryResponse {
  id: number;
  productName: string;
  startingPrice: number; 
  buyNowPrice?: number;
  status: AuctionStatus;
  biddingStartTime: string;
  biddingEndTime: string;
  categoryName: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface AuctionResponse extends AuctionSummaryResponse {
  description: string;
  bidIncrement: number;
  rejectionReason?: string;
  updatedAt: string;
  sellerId: number;
  sellerEmail: string;
  sellerName: string;
  categoryId: number;
  images: AuctionImageResponse[];
}

export interface AuctionCreateRequest {
  productName: string;
  description: string;
  startingPrice: number;
  bidIncrement: number;
  buyNowPrice?: number;
  categoryId: string;
  biddingStartTime: string; 
  biddingEndTime: string;
}

export interface AuctionFilterRequest {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number;
  status?: AuctionStatus;
  minPrice?: number;
  maxPrice?: number;
  startFrom?: string;
  startTo?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface AuctionReviewRequest {
  approved: boolean;
  rejectionReason?: string;
}