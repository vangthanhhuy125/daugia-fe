import { ApiResponse } from "./auth";
import { PageResponse } from "./auction";

export type ContactStatus = "PENDING" | "RESOLVED" | "REJECTED";

export interface ContactMessageCreateRequest {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
}

export interface ContactMessageReplyRequest {
  response: string;
  approve: boolean;
}

export interface ContactMessageResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
  response?: string;
  status: ContactStatus;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactListResponse = ApiResponse<PageResponse<ContactMessageResponse>>;