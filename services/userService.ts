import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";
import { PageResponse } from "../types/auction";
import { UserDto, UserAccountLogDto } from "../types/user";

const USER_PROFILE_CACHE_KEY = "cached_user_profile";
const USER_PROFILE_CACHE_TTL = 5 * 60 * 1000;

function getCachedProfile(): UserDto | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(USER_PROFILE_CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > USER_PROFILE_CACHE_TTL) {
      localStorage.removeItem(USER_PROFILE_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedProfile(profile: UserDto): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    USER_PROFILE_CACHE_KEY,
    JSON.stringify({ data: profile, timestamp: Date.now() })
  );
}

export function clearProfileCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_PROFILE_CACHE_KEY);
}

export const userService = {
  getMe: async (): Promise<ApiResponse<UserDto>> => {
    const cached = getCachedProfile();
    if (cached) {
      return Promise.resolve({
        success: true,
        message: "Profile fetched",
        data: cached,
      });
    }
    const response = await apiClient.get("/users/me");
    if (response?.data) {
      setCachedProfile(response.data);
    }
    return response.data;
  },

  getUserById: (id: string): Promise<ApiResponse<UserDto>> => {
    return apiClient.get(`/users/${id}`);
  },

  getProfile: (_userId: string): Promise<ApiResponse<UserDto>> => {
    return userService.getMe();
  },

  updateProfile: (
    fullName?: string,
    phone?: string,
    avatarFile?: File,
    street?: string,
    ward?: string,
    province?: string
  ): Promise<ApiResponse<UserDto>> => {
    const formData = new FormData();
    if (fullName) formData.append("fullName", fullName);
    if (phone) formData.append("phone", phone);
    if (avatarFile) formData.append("avatar", avatarFile);
    if (street !== undefined) formData.append("street", street);
    if (ward !== undefined) formData.append("ward", ward);
    if (province !== undefined) formData.append("province", province);

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