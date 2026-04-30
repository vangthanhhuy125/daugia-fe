"use client";

import React from "react";

interface EndedViewProps {
  infoRows: { label: string; value: string; statusColor?: string }[];
}

export const EndedView = ({ infoRows }: EndedViewProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[#CE2029] font-bold text-sm">Highest Bid:</p>
        <div className="w-full py-6 px-8 border border-gray-300 rounded-md flex justify-center items-center bg-gray-50/30">
          <span className="text-3xl font-bold text-[#CE2029]">20,000,000 VND</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-[#CE2029] font-bold">Type:</span>
        <span className="font-bold text-gray-900">Auction</span>
      </div>


      <div className="flex gap-4 items-start border-t border-gray-50 pt-4">
        <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Description:</span>
        <p className="text-gray-900 font-normal text-sm leading-relaxed text-right flex-grow italic">
          High-performance gaming laptop equipped with Intel Core i7 processor, NVIDIA RTX 4060 GPU, 16GB RAM, and 1TB SSD. Ideal for gaming, streaming, and high-end graphics work.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        {infoRows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-[#CE2029] font-bold text-sm">{row.label}</span>
            <span className={`font-normal text-right ${row.statusColor || "text-gray-900"} text-sm`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
        <p className="text-gray-500 font-bold text-sm">This auction has ended.</p>
      </div>
    </div>
  );
};