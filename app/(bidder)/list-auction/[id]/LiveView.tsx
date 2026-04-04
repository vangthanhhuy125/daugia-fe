"use client";

import React, { useState, useEffect } from "react";

interface LiveViewProps {
  infoRows: { label: string; value: string; statusColor?: string }[];
}

export const LiveView = ({ infoRows }: LiveViewProps) => {
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
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Thời gian còn lại */}
      <div className="space-y-2">
        <p className="text-[#CE2029] font-bold text-sm">Auction Time Remaining:</p>
        <div className="w-full py-4 px-6 border border-gray-300 rounded-md flex justify-center items-center">
          <span className="text-xl md:text-2xl font-medium text-gray-800 tabular-nums">
            {String(timeLeft.days).padStart(2, "0")} days {String(timeLeft.hours).padStart(2, "0")} hours {String(timeLeft.minutes).padStart(2, "0")} minutes {String(timeLeft.seconds).padStart(2, "0")} seconds
          </span>
        </div>
      </div>

      {/* 2. Giá cao nhất hiện tại */}
      <div className="space-y-2">
        <p className="text-[#CE2029] font-bold text-sm">Current Highest Bid:</p>
        <div className="w-full py-4 px-6 border-2 border-blue-400 rounded-md flex justify-center items-center">
          <span className="text-2xl font-bold text-[#CE2029]">20,000,000 VND</span>
        </div>
      </div>

      {/* 3. Mô tả */}
      <div className="flex gap-4 items-start">
        <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Description:</span>
        <p className="text-gray-900 font-normal text-sm leading-relaxed text-right flex-grow italic">
          High-performance gaming laptop equipped with Intel Core i7 processor, NVIDIA RTX 4060 GPU, 16GB RAM, and 1TB SSD.
        </p>
      </div>

      {/* 4. Bảng thông số */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        {infoRows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-[#CE2029] font-bold text-sm">{row.label}</span>
            <span className={`font-normal text-right ${row.statusColor || "text-gray-900"} text-sm`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* 5. Công cụ Đấu giá */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {/* Auto Bid */}
        <div className="border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
          <div className="space-y-1">
            <label className="text-xs font-bold text-blue-600">Your Maximum Bid:</label>
            <input 
              type="text" 
              placeholder="Set your maximum bid"
              className="w-full h-10 border border-gray-200 rounded-md px-4 text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="w-full h-11 bg-blue-600 text-white font-bold text-sm rounded-md hover:bg-blue-700 transition-all">
            Enable Auto Bid
          </button>
        </div>

        {/* Place Bid */}
        <div className="border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#CE2029]">Your Bid:</label>
            <input 
              type="text" 
              placeholder="The bid amount must be greater than X"
              className="w-full h-10 border border-gray-200 rounded-md px-4 text-sm outline-none focus:border-[#CE2029] transition-all"
            />
          </div>
          <button className="w-full h-11 bg-[#CE2029] text-white font-bold text-sm rounded-md hover:bg-red-700 transition-all">
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};