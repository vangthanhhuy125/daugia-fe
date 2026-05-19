import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";

export interface ProvinceDto {
  code: number;
  name: string;
}

export interface WardDto {
  code: number;
  name: string;
  province_code?: number;
}

export const locationService = {
  getProvinces: (): Promise<ApiResponse<ProvinceDto[]>> => {
    return apiClient.get("/locations/provinces");
  },

  getWards: (provinceCode: number): Promise<ApiResponse<WardDto[]>> => {
    return apiClient.get("/locations/wards", { params: { provinceCode } });
  },
};
