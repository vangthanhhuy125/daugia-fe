"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { backupApi } from "@/services/backupApi";
import type { BackupResponse, BackupStatusResponse, BackupType, BackupStatus } from "@/types/backup";
import { BackupStatusCard } from "./BackupStatusCard";
import { BackupHistoryTable } from "./BackupHistoryTable";
import { RestoreWizard } from "./RestoreWizard";
import { RetentionSettings } from "./RetentionSettings";
import { useBackupPolling } from "./useBackupPolling";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

interface BackupFilters {
  type?: BackupType;
  status?: BackupStatus;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState<BackupResponse[]>([]);
  const [status, setStatus] = useState<BackupStatusResponse | null>(null);
  const [filters, setFilters] = useState<BackupFilters>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupResponse | null>(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  const restoreActive = status?.currentRestore?.status === "RUNNING" || status?.currentRestore?.status === "PENDING";
  const pollInterval = restoreActive ? 2000 : 15000;
  const { status: polledStatus, refresh: refreshStatus } = useBackupPolling(true, pollInterval);

  useEffect(() => {
    if (polledStatus) {
      setStatus(polledStatus);
    }
  }, [polledStatus]);

  const loadBackups = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await backupApi.listBackups({
        page,
        size: 12,
        type: filters.type,
        status: filters.status,
      });
      const payload = res.data;
      setBackups(payload?.content || []);
      setTotalPages(payload?.totalPages || 1);
    } catch (err) {
      setBackups([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters.type, filters.status]);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  const handleTriggerBackup = async () => {
    setIsTriggering(true);
    try {
      const res = await backupApi.triggerFullBackup();
      const record = res.data;
      setBackups((prev) => [record, ...prev.filter((item) => item.id !== record.id)]);
      refreshStatus();
    } catch (err) {
      // ignore
    } finally {
      setIsTriggering(false);
    }
  };

  const handleRestore = async (mode: "backup" | "pitr", targetDateTime?: string) => {
    if (!selectedBackup) return;
    if (mode === "backup") {
      await backupApi.restoreBackup(selectedBackup.id);
    } else {
      const normalized = targetDateTime && targetDateTime.length === 16
        ? `${targetDateTime}:00`
        : targetDateTime;
      await backupApi.pointInTimeRestore({ targetDateTime: normalized });
    }
    refreshStatus();
  };

  const filteredBackups = useMemo(() => backups, [backups]);

  return (
    <div className={`${jost.className} min-h-screen bg-white flex flex-col`}>
      <Header />

      <main className="max-w-screen-xl mx-auto w-full py-10 flex-1 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3">
            <Sidebar />
          </aside>

          <div className="md:col-span-9 space-y-10">
            <BackupStatusCard
              status={status}
              onTrigger={handleTriggerBackup}
              isTriggering={isTriggering}
            />

            <BackupHistoryTable
              items={filteredBackups}
              isLoading={isLoading}
              page={page}
              totalPages={totalPages}
              filters={filters}
              onFiltersChange={(next) => {
                setFilters(next);
                setPage(0);
              }}
              onPageChange={setPage}
              onRestore={(backup) => {
                setSelectedBackup(backup);
                setIsRestoreOpen(true);
              }}
              onRefresh={() => {
                loadBackups();
                refreshStatus();
              }}
            />

            <RetentionSettings retentionPolicy={status?.retentionPolicy} />
          </div>
        </div>
      </main>

      <Footer />

      <RestoreWizard
        isOpen={isRestoreOpen}
        backup={selectedBackup}
        onClose={() => setIsRestoreOpen(false)}
        onRestore={handleRestore}
        restoreStatus={status?.currentRestore}
      />
    </div>
  );
}
