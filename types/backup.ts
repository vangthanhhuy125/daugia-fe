export type BackupType = "FULL" | "WAL";
export type BackupStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "DELETED";
export type RestoreStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

export interface BackupResponse {
  id: string;
  type: BackupType;
  status: BackupStatus;
  fileName?: string;
  filePath?: string;
  fileSizeBytes?: number;
  fileSizeFormatted?: string;
  durationMs?: number;
  triggeredBy?: string;
  errorMessage?: string;
  checksumSha256?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface BackupPageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface BackupStatusResponse {
  lastFullBackup?: BackupResponse | null;
  nextScheduledRun?: string | null;
  totalBackups: number;
  totalSizeBytes: number;
  retentionPolicy: string;
  currentRestore?: RestoreResponse | null;
}

export interface RestoreRequest {
  backupId?: string;
  targetDateTime?: string;
  confirmedBy?: string;
}

export interface RestoreResponse {
  restoreId: string;
  status: RestoreStatus;
  message: string;
  estimatedDurationMs?: number | null;
}

export interface BackupListParams {
  page?: number;
  size?: number;
  type?: BackupType;
  status?: BackupStatus;
}
