import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth";
import {
  BackupListParams,
  BackupPageResponse,
  BackupResponse,
  BackupStatusResponse,
  RestoreRequest,
  RestoreResponse,
} from "../types/backup";

export const backupApi = {
  triggerFullBackup: (): Promise<ApiResponse<BackupResponse>> => {
    return apiClient.post("/admin/backups/trigger");
  },

  listBackups: (params?: BackupListParams): Promise<ApiResponse<BackupPageResponse<BackupResponse>>> => {
    return apiClient.get("/admin/backups", { params });
  },

  getBackup: (id: string): Promise<ApiResponse<BackupResponse>> => {
    return apiClient.get(`/admin/backups/${id}`);
  },

  restoreBackup: (id: string): Promise<ApiResponse<RestoreResponse>> => {
    return apiClient.post(`/admin/backups/${id}/restore`);
  },

  pointInTimeRestore: (request: RestoreRequest): Promise<ApiResponse<RestoreResponse>> => {
    return apiClient.post("/admin/backups/pitr", request);
  },

  getStatus: (): Promise<ApiResponse<BackupStatusResponse>> => {
    return apiClient.get("/admin/backups/status");
  },

  softDelete: (id: string): Promise<ApiResponse<BackupResponse>> => {
    return apiClient.delete(`/admin/backups/${id}`);
  },
};
