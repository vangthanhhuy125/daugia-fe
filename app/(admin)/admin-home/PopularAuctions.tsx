"use client";

import React from "react";
import { Crown } from "lucide-react";

export const PopularAuctions = () => {
  const TopItem = ({ rank, title, sub, isGold }: any) => (
    <div className={`
      flex items-center gap-5 px-6 py-4 border-2 rounded-2xl bg-white flex-1 
      transition-all hover:shadow-md 
      ${isGold ? 'border-yellow-400' : 'border-gray-900'}
    `}>
      
      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
        {isGold ? (
          <Crown size={44} className="text-yellow-400" fill="currentColor" strokeWidth={1} />
        ) : (
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gray-900 text-white flex items-center justify-center font-[900] text-xl italic">
            {rank}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className={`text-lg font-[900] leading-tight ${isGold ? 'text-yellow-400' : 'text-gray-900'}`}>
          {title}
        </p>
        <p className={`text-[13px] font-bold mt-1 ${isGold ? 'text-yellow-400' : 'text-gray-700'}`}>
          {sub}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-[#d32f2f] font-[900] text-lg pt-4">
        Most Popular Auctions
      </h3>
      
      <div className="space-y-3">
        <h3 className="text-gray-900 font-[900] text-[15px]">Top 3 Most Bids</h3>
        <div className="flex flex-col md:flex-row gap-5">
          <TopItem rank={1} title="Laptop Dell" sub="24 Total Bids" isGold />
          <TopItem rank={2} title="Laptop Dell" sub="24 Total Bids" />
          <TopItem rank={3} title="Laptop Dell" sub="24 Total Bids" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-900 font-[900] text-[15px]">Top 3 Highest Bids</h3>
        <div className="flex flex-col md:flex-row gap-5">
          <TopItem rank={1} title="Rolex Watch" sub="30,000,000 VND" isGold />
          <TopItem rank={2} title="Rolex Watch" sub="24,000,000 VND" />
          <TopItem rank={3} title="Rolex Watch" sub="22,000,000 VND" />
        </div>
      </div>
    </div>
  );
};