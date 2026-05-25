"use client";

import React, { useState, useEffect } from "react";
import { biddingService } from "@/services/biddingService";
import { BuyNowReservationStatus } from "@/types/payment";
import { ReservationBanner } from "./ReservationBanner";

interface LiveViewProps {
  infoRows: { label: string; value: any; statusColor?: string }[];
  auctionDetail?: any;
  reservationStatus?: BuyNowReservationStatus | null;
}

export const LiveView = ({ infoRows, auctionDetail, reservationStatus }: LiveViewProps) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [bidAmount, setBidAmount] = useState("");
  const [autoBidAmount, setAutoBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isSettingAutoBid, setIsSettingAutoBid] = useState(false);

  const bidIncrement = auctionDetail?.priceStep || auctionDetail?.bidIncrement || 1;
  const currentHighest = auctionDetail?.currentPrice || auctionDetail?.startingPrice || 0;
  const minValidBid = currentHighest + bidIncrement;

  const hasActiveAutoBid = 
    Boolean(auctionDetail?.active) === true && 
    (auctionDetail?.maxAmount !== undefined && auctionDetail?.maxAmount !== null) &&
    Number(currentHighest) < Number(auctionDetail?.maxAmount);

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

  useEffect(() => {
    if (minValidBid > bidIncrement) {
      setBidAmount(minValidBid.toString());
      setAutoBidAmount("");
    }
  }, [minValidBid, bidIncrement]);

  const handlePlaceBid = async () => {
    if (!bidAmount || !auctionDetail?.id) return;

    const targetAmount = Number(bidAmount);

    if (targetAmount < minValidBid) {
      alert(`Your bid must be at least ${minValidBid.toLocaleString()} VND!`);
      return;
    }

    const difference = targetAmount - currentHighest;

    if (Math.round(difference) % Math.round(bidIncrement) !== 0) {
      alert(
        `Your bid amount must equal [Current Highest Bid] + n * [Price Step] (where n is a whole number). Each step is ${bidIncrement.toLocaleString()} VND!`
      );
      return;
    }

    try {
      setIsPlacingBid(true);

      await biddingService.placeBid(auctionDetail.id, {
        amount: targetAmount,
      });

      alert("Bid placed successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to place bid"
      );
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleEnableAutoBid = async () => {
    if (!autoBidAmount || !auctionDetail?.id) return;

    const targetAutoAmount = Number(autoBidAmount);

    if (targetAutoAmount <= minValidBid) {
      alert(
        `Maximum auto bid must be greater than ${minValidBid.toLocaleString()} VND!`
      );
      return;
    }

    const difference = targetAutoAmount - currentHighest;

    if (Math.round(difference) % Math.round(bidIncrement) !== 0) {
      alert(
        `Your auto bid amount must equal [Current Highest Bid] + n * [Price Step] (where n is a whole number). Each step is ${bidIncrement.toLocaleString()} VND!`
      );
      return;
    }

    try {
      setIsSettingAutoBid(true);

      await biddingService.createAutoBid(auctionDetail.id, {
        maxAmount: targetAutoAmount,
      });

      alert("Auto bid configured successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to setup auto bid"
      );
    } finally {
      setIsSettingAutoBid(false);
    }
  };

  return (
    <div className="space-y-6">
      {reservationStatus?.isOwner && (
        <ReservationBanner 
          remainingSeconds={reservationStatus.remainingSeconds || 300}
          paymentUrl={reservationStatus.paymentUrl}
        />
      )}
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

      {hasActiveAutoBid ? (
        <div className="bg-[#0A194E] rounded-[24px] p-6 text-white space-y-3 shadow-md mt-6">
          <h4 className="text-xl font-bold tracking-tight inline-block border-b-2 border-blue-400 pb-0.5">
            Auto Bid
          </h4>
          <div className="flex gap-4 text-base">
            <span className="font-bold opacity-80 min-w-[120px]">Your max bid:</span>
            <span className="font-medium">{Number(auctionDetail.maxAmount).toLocaleString()} VND</span>
          </div>
          <div className="flex gap-4 text-base">
            <span className="font-bold opacity-80 min-w-[120px]">Auto Bid Status:</span>
            <span className="font-medium text-emerald-400">Active</span>
          </div>
          <p className="text-sm italic pt-2 font-light opacity-90">
            {auctionDetail?.isHighestBidder ? "You are currently the highest bidder." : "Auto bidding in progress..."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-600">Your Maximum Bid:</label>
              <input 
                type="number" 
                value={autoBidAmount}
                min={minValidBid + bidIncrement}
                step={bidIncrement}
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
                min={minValidBid}
                step={bidIncrement}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min bid amount: ${minValidBid.toLocaleString()} VND`}
                className="w-full h-10 border border-gray-200 rounded-md px-4 text-sm outline-none focus:border-focus:border-[#CE2029] transition-all"
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
      )}
    </div>
  );
};