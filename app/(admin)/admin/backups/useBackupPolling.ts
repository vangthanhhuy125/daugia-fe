"use client";

import { useCallback, useEffect, useState } from "react";
import { backupApi } from "@/services/backupApi";
import type { BackupStatusResponse } from "@/types/backup";

export const useBackupPolling = (enabled: boolean, intervalMs: number = 2000) => {
  const [status, setStatus] = useState<BackupStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await backupApi.getStatus();
      setStatus(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load backup status");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    fetchStatus();
    const timer = setInterval(fetchStatus, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs, fetchStatus]);

  return { status, isLoading, error, refresh: fetchStatus };
};
