import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";
import {
  AuctionCreateRequest,
  AuctionFilterRequest,
  AuctionResponse,
  AuctionReviewRequest,
  AuctionSummaryResponse,
  PageResponse,
} from "../types/auction";

export const auctionService = {
  searchPublic: (params?: AuctionFilterRequest): Promise<ApiResponse<PageResponse<AuctionSummaryResponse>>> => {
    return apiClient.get('/auctions', { params });
  },

  getByIdPublic: (id: string | number): Promise<ApiResponse<AuctionResponse>> => {
    return apiClient.get(`/auctions/${id}`);
  },

  createAuction: (request: AuctionCreateRequest, files?: File[]): Promise<ApiResponse<AuctionResponse>> => {
    const formData = new FormData();
    
    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file); 
      });
    }

    return apiClient.post('/auctions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  },

  getMyAuctions: (page: number = 0, size: number = 12): Promise<ApiResponse<PageResponse<AuctionSummaryResponse>>> => {
    return apiClient.get('/auctions/my', { params: { page, size } });
  },

  searchAdmin: (params?: Partial<AuctionFilterRequest>): Promise<ApiResponse<PageResponse<AuctionSummaryResponse>>> => {
    return apiClient.get('/admin/auctions', { params });
  },

  getByIdAdmin: (id: string | number): Promise<ApiResponse<AuctionResponse>> => {
    return apiClient.get(`/admin/auctions/${id}`);
  },

  reviewAuction: (id: string | number, request: AuctionReviewRequest): Promise<ApiResponse<AuctionResponse>> => {
    return apiClient.put(`/admin/auctions/${id}/review`, request);
  },
};