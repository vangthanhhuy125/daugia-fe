"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import { X, ArrowUpDown } from "lucide-react";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface HistoryRecord {
  id: string;
  time: string;
  date: string;
  role: string;
  act: string;
  reason: string;
  timestamp: number;
}

interface ProcessingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}

export function ProcessingHistoryModal({ isOpen, onClose, userId }: ProcessingHistoryModalProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      userService.getAccountLogs(userId, 0, 100)
        .then(res => {
          const mapped = res.data.content.map((log: any) => {
            const dateObj = new Date(log.createdAt);
            return {
              id: log.id,
              time: dateObj.toLocaleTimeString('en-GB'),
              date: dateObj.toLocaleDateString('en-GB'),
              role: `Admin: ${log.performedBy}`,
              act: log.action === 'LOCK' ? 'Lock user accounts' : 'Unlock user accounts',
              reason: log.reason,
              timestamp: dateObj.getTime()
            };
          });
          setHistoryData(mapped);
        })
        .catch(console.error);
    } else {
      setHistoryData([]);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleSortDate = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...historyData].sort((a, b) => {
    return sortOrder === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
  });

  return (
    <div
      className={`${jost.className} fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[760px] rounded-[24px] p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-black hover:text-gray-500 transition-colors z-10 bg-gray-50 hover:bg-gray-100 rounded-full p-1"
          aria-label="Close modal"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <h2 className="text-[22px] font-bold text-[#CE2029] mb-6 flex-shrink-0">
          Processing history
        </h2>

        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 min-h-0">
          <table className="w-full border-collapse text-[15px]">
            <thead className="sticky top-0 bg-white z-10 outline outline-1 outline-black">
              <tr>
                <th className="py-3 px-2 w-[60px] font-bold text-center border-b border-black">
                  No
                </th>
                <th className="py-0 px-0 w-[140px] border-l border-b border-black font-bold text-center">
                  <button
                    onClick={handleSortDate}
                    className="w-full h-full flex items-center justify-center gap-2 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Date
                    <ArrowUpDown
                      size={14}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 ${
                        sortOrder === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="py-3 px-4 border-l border-b border-black font-bold text-center">
                  Detailed content
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedData.length > 0 ? sortedData.map((record, index) => (
                <tr
                  key={record.id}
                  className="border-b border-black last:border-b-0"
                >
                  <td className="py-5 px-2 text-center align-top font-medium">
                    {index + 1}
                  </td>

                  <td className="py-5 px-2 text-center border-l border-black align-top">
                    <div className="flex flex-col">
                      <span>{record.time}</span>
                      <span>{record.date}</span>
                    </div>
                  </td>

                  <td className="py-5 px-5 border-l border-black align-top">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-start gap-2">
                        <span className="font-bold w-[120px] shrink-0">Role:</span>
                        <span>{record.role}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="font-bold w-[120px] shrink-0">Act:</span>
                        <span>{record.act}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="font-bold w-[120px] shrink-0 leading-tight pt-0.5">
                          Reason/<br />Response:
                        </span>
                        <span className="leading-snug pt-0.5 text-gray-800">
                          {record.reason}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500 font-medium border-b border-black">
                    No processing history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}