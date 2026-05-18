import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth"; 
import { PageResponse } from "../types/auction"; 
import { UserDto, UserAccountLogDto } from "../types/user";

export const userService = {
  getUserById: (id: string): Promise<ApiResponse<UserDto>> => {
    return apiClient.get(`/users/${id}`);
  },

  getProfile: (userId: string): Promise<ApiResponse<UserDto>> => {
    return apiClient.get(`/users/${userId}`);
  },

  updateProfile: (
    fullName?: string,
    phone?: string,
    avatarFile?: File
  ): Promise<ApiResponse<UserDto>> => {
    const formData = new FormData();
    if (fullName) formData.append("fullName", fullName);
    if (phone) formData.append("phone", phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    return apiClient.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllUsers: (page: number = 0, size: number = 20): Promise<ApiResponse<PageResponse<UserDto>>> => {
    return apiClient.get("/users", {
      params: { page, size },
    });
  },

  lockUser: (id: string, reason: string): Promise<ApiResponse<void>> => {
    return apiClient.put(`/admin/users/${id}/lock`, { reason });
  },

  unlockUser: (id: string, reason: string): Promise<ApiResponse<void>> => {
    return apiClient.put(`/admin/users/${id}/unlock`, { reason });
  },

  getAccountLogs: (
    id: string,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<UserAccountLogDto>>> => {
    return apiClient.get(`/admin/users/${id}/account-logs`, {
      params: { page, size },
    });
  },
};