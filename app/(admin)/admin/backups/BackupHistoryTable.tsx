"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Calendar, RotateCcw, RefreshCw, Database } from "lucide-react";
import type { BackupResponse, BackupStatus, BackupType } from "@/types/backup";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";

const DatePickerNoSSR = dynamic(() => import("react-datepicker").then(mod => mod.default), { ssr: false }) as React.ComponentType<any>;

interface BackupFilters {
  type?: BackupType;
  status?: BackupStatus;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface BackupHistoryTableProps {
  items: BackupResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  filters: BackupFilters;
  onFiltersChange: (filters: BackupFilters) => void;
  onPageChange: (page: number) => void;
  onRestore: (backup: BackupResponse) => void;
  onRefresh: () => void;
}

const statusBadge = (status?: string) => {
  if (!status) return "bg-gray-200 text-gray-700";
  const normalized = status.toLowerCase();
  if (normalized === "success") return "bg-emerald-100 text-emerald-700";
  if (normalized === "failed") return "bg-red-100 text-red-700";
  if (normalized === "running") return "bg-amber-100 text-amber-700";
  if (normalized === "pending") return "bg-slate-100 text-slate-700";
  return "bg-slate-100 text-slate-700";
};

const typeBadge = (type?: string) => {
  if (type?.toLowerCase() === "wal") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
};

const formatDuration = (duration?: number) => {
  if (!duration) return "-";
  const seconds = Math.floor(duration / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
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

export const BackupHistoryTable = ({
  items,
  isLoading,
  page,
  totalPages,
  filters,
  onFiltersChange,
  onPageChange,
  onRestore,
  onRefresh,
}: BackupHistoryTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const createdAt = item.createdAt ? new Date(item.createdAt) : null;
      if (filters.startDate && createdAt && createdAt < filters.startDate) return false;
      if (filters.endDate && createdAt && createdAt > filters.endDate) return false;
      return true;
    });
  }, [items, filters.startDate, filters.endDate]);

  const handleReset = () => {
    onFiltersChange({ type: undefined, status: undefined, startDate: null, endDate: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Backup history</h3>
          <p className="text-sm text-slate-500 font-medium">Track every backup and its metadata.</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:border-[#CE2029] hover:text-[#CE2029] transition-all"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-400 font-bold">Type</label>
          <select
            value={filters.type || ""}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as BackupType || undefined })}
            className="h-11 w-40 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
          >
            <option value="">All</option>
            <option value="FULL">FULL</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-400 font-bold">Status</label>
          <select
            value={filters.status || ""}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as BackupStatus || undefined })}
            className="h-11 w-44 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
          >
            <option value="">All</option>
            <option value="PENDING">PENDING</option>
            <option value="RUNNING">RUNNING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-400 font-bold">From</label>
          <div className="relative">
            <DatePickerNoSSR
              selected={filters.startDate}
              onChange={(date: Date | null) => onFiltersChange({ ...filters, startDate: date })}
              placeholderText="dd/mm/yyyy"
              dateFormat="dd/MM/yyyy"
              className="h-11 w-40 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-400 font-bold">To</label>
          <div className="relative">
            <DatePickerNoSSR
              selected={filters.endDate}
              onChange={(date: Date | null) => onFiltersChange({ ...filters, endDate: date })}
              placeholderText="dd/mm/yyyy"
              dateFormat="dd/MM/yyyy"
              className="h-11 w-40 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-[#CE2029] hover:border-[#CE2029] transition-all"
          title="Reset filters"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm uppercase tracking-wide text-slate-400">
              <th className="px-6 py-4">Date/Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">File size</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Triggered by</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-semibold">
                  Loading backups...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-semibold">
                  No backups found.
                </td>
              </tr>
            ) : (
              filteredItems.map((backup) => {
                const isExpanded = expandedId === backup.id;
                return (
                  <React.Fragment key={backup.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : backup.id)}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {backup.createdAt ? new Date(backup.createdAt).toLocaleString("en-GB") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${typeBadge(backup.type)}`}>
                          <Database size={12} /> {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(backup.status)}`}>
                          {backup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {backup.fileSizeFormatted || formatBytes(backup.fileSizeBytes)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {formatDuration(backup.durationMs)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {backup.triggeredBy || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            onRestore(backup);
                          }}
                          disabled={backup.status !== "SUCCESS"}
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-[#CE2029] hover:text-[#CE2029] transition-all disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-700"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <td colSpan={7} className="px-6 py-4 text-sm text-slate-600">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Checksum</div>
                              <div className="font-mono text-xs text-slate-700 break-all">{backup.checksumSha256 || "-"}</div>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">File path</div>
                              <div className="text-xs text-slate-700 break-all">{backup.filePath || "-"}</div>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Error</div>
                              <div className="text-xs text-slate-700 break-all">{backup.errorMessage || "None"}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(page - 1, 0))}
            disabled={page <= 0}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
