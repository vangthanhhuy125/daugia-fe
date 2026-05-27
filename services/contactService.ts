import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";
import {
  ContactListResponse,
  ContactMessageCreateRequest,
  ContactMessageReplyRequest,
  ContactMessageResponse,
  ContactStatus,
} from "../types/contact";

export const contactService = {
  submit: (data: ContactMessageCreateRequest): Promise<ApiResponse<ContactMessageResponse>> => {
    return apiClient.post("/contact", data);
  },

  getAll: (
    status?: ContactStatus,
    page = 0,
    size = 20
  ): Promise<ContactListResponse> => {
    return apiClient.get("/admin/contact", { params: { status, page, size } });
  },

  getById: (id: string): Promise<ApiResponse<ContactMessageResponse>> => {
    return apiClient.get(`/admin/contact/${id}`);
  },

  resolve: (id: string, data: ContactMessageReplyRequest): Promise<ApiResponse<ContactMessageResponse>> => {
    return apiClient.put(`/admin/contact/${id}/resolve`, data);
  },

  reject: (id: string, data: ContactMessageReplyRequest): Promise<ApiResponse<ContactMessageResponse>> => {
    return apiClient.put(`/admin/contact/${id}/reject`, data);
  },
};