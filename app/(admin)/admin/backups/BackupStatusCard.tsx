"use client";

import React from "react";
import type { BackupStatusResponse } from "@/types/backup";

const formatDate = (value?: string | null) => {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-GB");
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return `${value.toFixed(1)} ${units[index]}`;
};

const statusColor = (status?: string) => {
  if (!status) return "bg-gray-200 text-gray-700";
  const normalized = status.toLowerCase();
  if (normalized === "success") return "bg-emerald-100 text-emerald-700";
  if (normalized === "failed") return "bg-red-100 text-red-700";
  if (normalized === "running") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

interface BackupStatusCardProps {
  status: BackupStatusResponse | null;
  onTrigger: () => void;
  isTriggering: boolean;
}

export const BackupStatusCard = ({ status, onTrigger, isTriggering }: BackupStatusCardProps) => {
  const lastBackup = status?.lastFullBackup;
  const badgeClass = statusColor(lastBackup?.status);

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2f7] p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900">Backup status</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeClass}`}>
              {lastBackup?.status || "unknown"}
            </span>
          </div>
          <div className="text-sm text-slate-500 font-semibold">
            Last backup: <span className="text-slate-900 font-bold">{formatDate(lastBackup?.completedAt || lastBackup?.createdAt)}</span>
          </div>
          <div className="text-sm text-slate-500 font-semibold">
            Next scheduled run: <span className="text-slate-900 font-bold">{formatDate(status?.nextScheduledRun)}</span>
          </div>
        </div>

        <button
          onClick={onTrigger}
          disabled={isTriggering}
          className="inline-flex items-center justify-center rounded-full bg-[#0f172a] text-white px-6 py-3 font-bold text-sm uppercase tracking-wide shadow-lg shadow-slate-900/15 hover:bg-black transition-all disabled:opacity-60"
        >
          {isTriggering ? "Running backup..." : "Run backup now"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Total backups</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{status?.totalBackups ?? 0}</div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Storage used</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{formatBytes(status?.totalSizeBytes)}</div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Retention policy</div>
          <div className="text-base font-bold text-slate-900 mt-2">{status?.retentionPolicy || "N/A"}</div>
        </div>
      </div>
    </div>
  );
};
