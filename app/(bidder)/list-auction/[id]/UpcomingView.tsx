"use client";

import React, { useState, useEffect } from "react";

interface UpcomingViewProps {
  infoRows: { label: string; value: any; statusColor?: string }[];
  auctionDetail?: any;
}

export const UpcomingView = ({ infoRows, auctionDetail }: UpcomingViewProps) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
    if (!auctionDetail?.biddingStartTime) return;

    const targetDate = new Date(auctionDetail.biddingStartTime).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("00 days 00 hours 00 minutes 00 seconds");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(days).padStart(2, "0")} days ${String(hours).padStart(2, "0")} hours ${String(minutes).padStart(2, "0")} minutes ${String(seconds).padStart(2, "0")} seconds`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionDetail]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[#CE2029] font-bold text-base whitespace-nowrap">
          Countdown time to start bidding:
        </p>
        <div className="w-full py-4 px-6 border border-gray-200 rounded-xl flex justify-center items-center shadow-sm">
          <span className="text-xl md:text-2xl font-medium text-gray-800 tabular-nums">
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <span className="text-[#CE2029] font-bold text-base whitespace-nowrap">Description:</span>
        <p className="text-gray-900 font-normal leading-relaxed text-right flex-grow">
          {auctionDetail?.description || ""}
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