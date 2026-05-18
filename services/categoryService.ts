import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth"; 
import { PageResponse } from "../types/auction"; 
import { CategoryRequest, CategoryResponse } from "../types/category";

export const categoryService = {
  getAll: (
    page: number = 0,
    size: number = 10,
    search?: string
  ): Promise<ApiResponse<PageResponse<CategoryResponse>>> => {
    return apiClient.get("/categories", {
      params: { page, size, search },
    });
  },

  getById: (id: string): Promise<ApiResponse<CategoryResponse>> => {
    return apiClient.get(`/categories/${id}`);
  },

  create: (request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> => {
    return apiClient.post("/categories", request);
  },

  update: (id: string, request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> => {
    return apiClient.put(`/categories/${id}`, request);
  },

  delete: (id: string): Promise<ApiResponse<string>> => {
    return apiClient.delete(`/categories/${id}`);
  },
};