"use client";

import React, { useMemo, useState } from "react";

interface RetentionSettingsProps {
  retentionPolicy?: string;
}

const parseRetention = (policy?: string) => {
  if (!policy) return { fullWeeks: 4 };
  const fullMatch = policy.match(/Full:\s*(\d+)/i);
  return {
    fullWeeks: fullMatch ? Number(fullMatch[1]) : 4,
  };
};

export const RetentionSettings = ({ retentionPolicy }: RetentionSettingsProps) => {
  const defaults = useMemo(() => parseRetention(retentionPolicy), [retentionPolicy]);
  const [open, setOpen] = useState(false);
  const [fullWeeks, setFullWeeks] = useState(defaults.fullWeeks);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setFullWeeks(defaults.fullWeeks);
  }, [defaults.fullWeeks]);

  const handleSave = () => {
    setSavedMessage("Saved locally. Apply changes via server configuration.");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <div className="text-lg font-black text-slate-900">Retention settings</div>
          <div className="text-xs text-slate-500 font-semibold">{retentionPolicy || "Full: 4 weeks"}</div>
        </div>
        <span className="text-slate-500 text-sm font-bold">{open ? "Hide" : "Edit"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
            Full backups (weeks)
            <input
              type="number"
              value={fullWeeks}
              onChange={(event) => setFullWeeks(Number(event.target.value))}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700"
            />
          </label>

          <div className="flex flex-col justify-end">
            <button
              onClick={handleSave}
              className="rounded-full bg-[#0f172a] px-5 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
            {savedMessage && <span className="mt-2 text-xs text-emerald-600 font-semibold">{savedMessage}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
