"use client";

import React, { useState, useEffect } from "react";
import { biddingService } from "@/services/biddingService";

interface LiveViewProps {
  infoRows: { label: string; value: any; statusColor?: string }[];
  auctionDetail?: any;
}

export const LiveView = ({ infoRows, auctionDetail }: LiveViewProps) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");
  
  const [bidAmount, setBidAmount] = useState("");
  const [autoBidAmount, setAutoBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isSettingAutoBid, setIsSettingAutoBid] = useState(false);

  useEffect(() => {
    if (!auctionDetail?.biddingEndTime) return;

    const targetDate = new Date(auctionDetail.biddingEndTime).getTime();

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

  const handlePlaceBid = async () => {
    if (!bidAmount || !auctionDetail?.id) return;
    try {
      setIsPlacingBid(true);
      await biddingService.placeBid(auctionDetail.id.toString(), { amount: Number(bidAmount) });
      alert("Bid placed successfully!");
      setBidAmount("");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place bid");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleEnableAutoBid = async () => {
    if (!autoBidAmount || !auctionDetail?.id) return;
    try {
      setIsSettingAutoBid(true);
      await biddingService.createAutoBid(auctionDetail.id.toString(), { maxAmount: Number(autoBidAmount) });
      alert("Auto bid configured successfully!");
      setAutoBidAmount("");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to setup auto bid");
    } finally {
      setIsSettingAutoBid(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[#CE2029] font-bold text-sm">Auction Time Remaining:</p>
        <div className="w-full py-4 px-6 border border-gray-300 rounded-md flex justify-center items-center">
          <span className="text-xl md:text-2xl font-medium text-gray-800 tabular-nums">
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[#CE2029] font-bold text-sm">Current Highest Bid:</p>
        <div className="w-full py-4 px-6 border-2 border-blue-400 rounded-md flex justify-center items-center">
          <span className="text-2xl font-bold text-[#CE2029]">
            {auctionDetail?.currentPrice ? `${auctionDetail.currentPrice.toLocaleString()} VND` : (auctionDetail?.startingPrice ? `${auctionDetail.startingPrice.toLocaleString()} VND` : "N/A")}
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Description:</span>
        <p className="text-gray-900 font-normal text-sm leading-relaxed text-right flex-grow italic">
          {auctionDetail?.description || ""}
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
          <div className="space-y-1">
            <label className="text-xs font-bold text-blue-600">Your Maximum Bid:</label>
            <input 
              type="number" 
              value={autoBidAmount}
              onChange={(e) => setAutoBidAmount(e.target.value)}
              placeholder="Set your maximum bid"
              className="w-full h-10 border border-gray-200 rounded-md px-4 text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={handleEnableAutoBid}
            disabled={isSettingAutoBid || !autoBidAmount}
            className="w-full h-11 bg-blue-600 text-white font-bold text-sm rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSettingAutoBid ? "Configuring..." : "Enable Auto Bid"}
          </button>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#CE2029]">Your Bid:</label>
            <input 
              type="number" 
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="The bid amount must be greater than X"
              className="w-full h-10 border border-gray-200 rounded-md px-4 text-sm outline-none focus:border-[#CE2029] transition-all"
            />
          </div>
          <button 
            onClick={handlePlaceBid}
            disabled={isPlacingBid || !bidAmount}
            className="w-full h-11 bg-[#CE2029] text-white font-bold text-sm rounded-md hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingBid ? "Placing Bid..." : "Place Bid"}
          </button>
        </div>
      </div>
    </div>
  );
};