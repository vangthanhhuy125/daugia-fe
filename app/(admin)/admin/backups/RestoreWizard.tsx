"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BackupResponse, RestoreResponse } from "@/types/backup";

interface RestoreWizardProps {
  isOpen: boolean;
  backup: BackupResponse | null;
  onClose: () => void;
  onRestore: () => Promise<void>;
  restoreStatus?: RestoreResponse | null;
}

const steps = [
  "Validating checksum",
  "Stopping writes",
  "Restoring",
  "Restarting",
];

const resolveStepIndex = (message?: string, status?: string) => {
  if (!message) return status === "SUCCESS" ? steps.length - 1 : 0;
  const lower = message.toLowerCase();
  if (lower.includes("checksum")) return 0;
  if (lower.includes("stopping")) return 1;
  if (lower.includes("restore") || lower.includes("replay")) return 2;
  if (lower.includes("restart")) return 3;
  return status === "SUCCESS" ? steps.length - 1 : 1;
};

export const RestoreWizard = ({ isOpen, backup, onClose, onRestore, restoreStatus }: RestoreWizardProps) => {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setConfirmText("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const canProceed = true;
  const isConfirmed = confirmText === "CONFIRM";

  const activeStep = useMemo(() => resolveStepIndex(restoreStatus?.message, restoreStatus?.status), [restoreStatus]);

  if (!isOpen || !backup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Restore database</h3>
            <p className="text-sm text-slate-500">Backup: {backup.fileName || backup.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div className="mt-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">Step 1 — Confirmation</h4>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-semibold">
                WARNING: This will OVERWRITE the current database. All data after the backup point will be lost. This action cannot be undone.
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Auctions affected</div>
                  <div className="font-bold text-slate-900">N/A</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400 font-bold">Bids affected</div>
                  <div className="font-bold text-slate-900">N/A</div>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-400 font-bold">Type CONFIRM to proceed</label>
                <input
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  className="mt-2 w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                  placeholder="CONFIRM"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600">Cancel</button>
                <button
                  onClick={async () => {
                    setIsSubmitting(true);
                    await onRestore();
                    setIsSubmitting(false);
                    setStep(2);
                  }}
                  disabled={!isConfirmed || isSubmitting}
                  className="rounded-full bg-[#CE2029] px-6 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Starting..." : "Restore now"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">Step 2 — Progress</h4>
              <div className="space-y-3">
                {steps.map((label, index) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${index <= activeStep ? "bg-[#CE2029]" : "bg-slate-200"}`} />
                    <span className={`text-sm font-semibold ${index <= activeStep ? "text-slate-900" : "text-slate-400"}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                {restoreStatus?.message || "Waiting for restore updates..."}
              </div>
              {restoreStatus?.status === "SUCCESS" && (
                <Link href="/admin-audit" className="text-sm font-bold text-[#CE2029]">
                  View audit log
                </Link>
              )}
              <div className="flex justify-end">
                <button onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
