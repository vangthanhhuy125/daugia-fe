import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";
import { PageResponse } from "../types/auction";
import {
  FeedbackCreateRequest,
  FeedbackListResponse,
  FeedbackReplyRequest,
  FeedbackResponse,
  FeedbackStatus,
} from "../types/feedback";

export const feedbackService = {
  submit: (data: FeedbackCreateRequest): Promise<ApiResponse<FeedbackResponse>> => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      content: data.content,
    };
    return apiClient.post("/feedback", payload);
  },

  getAll: (
    status?: FeedbackStatus,
    page = 0,
    size = 20
  ): Promise<FeedbackListResponse> => {
    return apiClient.get("/admin/feedback", { params: { status, page, size } });
  },

  getById: (id: string): Promise<ApiResponse<FeedbackResponse>> => {
    return apiClient.get(`/admin/feedback/${id}`);
  },

  resolve: (id: string, data: FeedbackReplyRequest): Promise<ApiResponse<FeedbackResponse>> => {
    return apiClient.put(`/admin/feedback/${id}/resolve`, data);
  },

  reject: (id: string, data: FeedbackReplyRequest): Promise<ApiResponse<FeedbackResponse>> => {
    return apiClient.put(`/admin/feedback/${id}/reject`, data);
  },
};