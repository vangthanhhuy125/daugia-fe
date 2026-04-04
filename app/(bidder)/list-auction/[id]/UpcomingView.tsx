"use client";

import React, { useState, useEffect } from "react";

interface UpcomingViewProps {
  infoRows: { label: string; value: string; statusColor?: string }[];
}

export const UpcomingView = ({ infoRows }: UpcomingViewProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 1,
    minutes: 4,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[#CE2029] font-bold text-base whitespace-nowrap">
          Countdown time to start bidding:
        </p>
        <div className="w-full py-4 px-6 border border-gray-200 rounded-xl flex justify-center items-center shadow-sm">
          <span className="text-xl md:text-2xl font-medium text-gray-800 tabular-nums">
            {String(timeLeft.days).padStart(2, "0")} days {String(timeLeft.hours).padStart(2, "0")} hours {String(timeLeft.minutes).padStart(2, "0")} minutes {String(timeLeft.seconds).padStart(2, "0")} seconds
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <span className="text-[#CE2029] font-bold text-base whitespace-nowrap">Description:</span>
        <p className="text-gray-900 font-normal leading-relaxed text-right flex-grow">
          High-performance gaming laptop equipped with Intel Core i7 processor, NVIDIA RTX 4060 GPU, 16GB RAM, and 1TB SSD. Ideal for gaming, streaming, and high-end graphics work.
        </p>
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-8">
        {infoRows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-[#CE2029] font-bold text-base">{row.label}</span>
            <span className={`font-normal text-right ${row.statusColor || "text-gray-900"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full py-3 bg-[#CE2029] text-white font-bold text-xl rounded-xl shadow-lg hover:bg-red-700 transition-all active:scale-[0.98]">
        Follow This Auction
      </button>
    </div>
  );
};