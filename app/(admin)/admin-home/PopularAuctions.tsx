"use client";

import React, { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { auctionService } from "@/services/auctionService";
import { biddingService } from "@/services/biddingService";

export const PopularAuctions = () => {
  const [topBids, setTopBids] = useState<any[]>([]);
  const [highestBids, setHighestBids] = useState<any[]>([]);

  useEffect(() => {
    auctionService.searchPublic({ size: 999 })
      .then(async (res) => {
        const auctionList = res.data?.content || [];

        const validAuctions = auctionList.filter((item: any) => 
          item.status === "LIVE" || item.status === "ACTIVE" || item.status === "ENDED"
        );

        const detailPromises = validAuctions.map(async (item: any) => {
          try {
            const bidRes = await biddingService.getBidHistory(item.id, 0, 1);
            return {
              ...item,
              calculatedBids: bidRes.data?.totalElements || 0 
            };
          } catch (err) {
            return { ...item, calculatedBids: 0 };
          }
        });

        const enrichedAuctions = await Promise.all(detailPromises);

        const sortedByBids = [...enrichedAuctions]
          .sort((a, b) => b.calculatedBids - a.calculatedBids)
          .slice(0, 3);

        const sortedByPrice = [...validAuctions]
          .sort((a, b) => {
            const priceA = a.currentPrice || a.startingPrice || 0;
            const priceB = b.currentPrice || b.startingPrice || 0;
            return priceB - priceA;
          })
          .slice(0, 3);

        setTopBids(sortedByBids);
        setHighestBids(sortedByPrice);
      })
      .catch(console.error);
  }, []);

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
        <p className={`text-[13px] font-bold mt-1 ${isGold ? 'text-yellow-400' : 'text-gray-707'}`}>
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
          {topBids.map((item, idx) => (
            <TopItem 
              key={item.id || idx} 
              rank={idx + 1} 
              title={item.productName || "No Name"} 
              sub={`${item.calculatedBids || 0} Total Bids`} 
              isGold={idx === 0} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-900 font-[900] text-[15px]">Top 3 Highest Bids</h3>
        <div className="flex flex-col md:flex-row gap-5">
          {highestBids.map((item, idx) => {
            const displayPrice = item.currentPrice || item.startingPrice || 0;
            return (
              <TopItem 
                key={item.id || idx} 
                rank={idx + 1} 
                title={item.productName || "No Name"} 
                sub={`${displayPrice.toLocaleString()} VND`} 
                isGold={idx === 0} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};