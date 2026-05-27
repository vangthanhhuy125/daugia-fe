import { ApiResponse } from "./auth";
import { PageResponse } from "./auction";

export type FeedbackStatus = "PENDING" | "RESOLVED" | "REJECTED";

export interface FeedbackCreateRequest {
  fullName: string;
  email: string;
  phone: string;
  content: string;
  role?: string;
}

export interface FeedbackReplyRequest {
  response: string;
  approve: boolean;
}

export interface FeedbackResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  content: string;
  response?: string;
  status: FeedbackStatus;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type FeedbackListResponse = ApiResponse<PageResponse<FeedbackResponse>>;