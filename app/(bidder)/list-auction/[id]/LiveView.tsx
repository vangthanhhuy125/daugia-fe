"use client";

import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { biddingService } from "@/services/biddingService";
import { BidResponse } from "@/types/bidding";

interface LiveViewProps {
  infoRows: { label: string; value: any; statusColor?: string }[];
  auctionDetail?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";
const BASE_URL = API_URL.replace("/api/v1", "");
const WS_ENDPOINT = `${BASE_URL}/ws`;

export const LiveView = ({ infoRows, auctionDetail }: LiveViewProps) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [currentPrice, setCurrentPrice] = useState<number>(
    auctionDetail?.currentPrice || auctionDetail?.startingPrice || 0
  );
  const [effectiveEndTime, setEffectiveEndTime] = useState<string>(
    auctionDetail?.endTime || auctionDetail?.biddingEndTime || ""
  );
  const [bidAmount, setBidAmount] = useState("");
  const [autoBidAmount, setAutoBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isSettingAutoBid, setIsSettingAutoBid] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [autoBidError, setAutoBidError] = useState("");
  const [autoBidSuccess, setAutoBidSuccess] = useState("");
  const [bidHistory, setBidHistory] = useState<BidResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [socketStatus, setSocketStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  const stompRef = useRef<Client | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const auctionId = auctionDetail?.id?.toString();
  const bidIncrement = Number(auctionDetail?.bidIncrement || 0);
  const minBid = currentPrice + bidIncrement;

  useEffect(() => {
    if (!auctionDetail?.id) return;
    setCurrentPrice(auctionDetail?.currentPrice || auctionDetail?.startingPrice || 0);
    setEffectiveEndTime(auctionDetail?.endTime || auctionDetail?.biddingEndTime || "");
  }, [auctionDetail?.id, auctionDetail?.currentPrice, auctionDetail?.endTime, auctionDetail?.biddingEndTime]);

  useEffect(() => {
    if (!effectiveEndTime) return;

    const updateTimer = () => {
      const targetDate = new Date(effectiveEndTime).getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
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
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [effectiveEndTime]);

  useEffect(() => {
    if (!auctionId) return;

    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const res = await biddingService.getBidHistory(auctionId, 0, 10);
        const history = res.data?.content || [];
        setBidHistory(history);
        if (history.length > 0) {
          const latest = history[0];
          const latestPrice = Number(latest.currentPrice ?? latest.amount ?? 0);
          if (latestPrice > 0) {
            setCurrentPrice(latestPrice);
          }
          if (latest.endTime) {
            setEffectiveEndTime(latest.endTime);
          }
        }
      } catch {
        setBidHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const connect = () => {
      setSocketStatus("connecting");
      const socket = new SockJS(
        WS_ENDPOINT.replace("ws://", "http://").replace("wss://", "https://")
      );
      const client = new Client({
        webSocketFactory: () => socket as WebSocket,
        reconnectDelay: 0,
        debug: () => {},
        onConnect: () => {
          setSocketStatus("connected");
          client.subscribe(`/topic/auctions/${auctionId}`, (message) => {
            try {
              const bidResponse: BidResponse = JSON.parse(message.body);
              if (bidResponse?.currentPrice != null) {
                setCurrentPrice(Number(bidResponse.currentPrice));
              }
              if (bidResponse?.endTime) {
                setEffectiveEndTime(bidResponse.endTime);
              }
              if (bidResponse?.bidId) {
                setBidHistory((prev) => [bidResponse, ...prev].slice(0, 10));
              }
            } catch {
              setSocketStatus("disconnected");
            }
          });
        },
        onWebSocketClose: () => {
          setSocketStatus("disconnected");
          if (!reconnectTimerRef.current) {
            reconnectTimerRef.current = setTimeout(() => {
              reconnectTimerRef.current = null;
              connect();
            }, 5000);
          }
        }
      });

      client.activate();
      stompRef.current = client;
    };

    connect();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (stompRef.current?.active) {
        stompRef.current.deactivate();
      }
      stompRef.current = null;
    };
  }, [auctionId]);

  const handlePlaceBid = async () => {
    if (!bidAmount || !auctionId) return;

    const numericAmount = Number(bidAmount);
    if (Number.isNaN(numericAmount)) {
      setBidError("Please enter a valid bid amount.");
      return;
    }
    if (numericAmount < minBid) {
      setBidError(`Minimum bid is ${minBid.toLocaleString()} VND`);
      return;
    }

    try {
      setIsPlacingBid(true);
      setBidError("");
      setBidSuccess("");
      const res = await biddingService.placeBid(auctionId, { amount: numericAmount });
      if (res.data?.status === "REJECTED") {
        setBidError(res.data.rejectionReason || "Bid rejected");
      } else {
        setBidSuccess("Bid placed successfully!");
        setBidAmount("");
      }
    } catch (error: any) {
      setBidError(error?.message || "Failed to place bid");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleEnableAutoBid = async () => {
    if (!autoBidAmount || !auctionId) return;

    const numericAmount = Number(autoBidAmount);
    if (Number.isNaN(numericAmount)) {
      setAutoBidError("Please enter a valid maximum amount.");
      return;
    }

    try {
      setIsSettingAutoBid(true);
      setAutoBidError("");
      setAutoBidSuccess("");
      await biddingService.createAutoBid(auctionId, { maxAmount: numericAmount });
      setAutoBidSuccess("Auto bid configured successfully!");
      setAutoBidAmount("");
    } catch (error: any) {
      setAutoBidError(error?.message || "Failed to setup auto bid");
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
        {socketStatus !== "connected" && (
          <p className="text-xs font-semibold text-amber-600">
            Live updates {socketStatus === "connecting" ? "connecting" : "disconnected"}. Retrying...
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[#CE2029] font-bold text-sm">Current Highest Bid:</p>
        <div className="w-full py-4 px-6 border-2 border-blue-400 rounded-md flex justify-center items-center">
          <span className="text-2xl font-bold text-[#CE2029]">
            {currentPrice ? `${Number(currentPrice).toLocaleString()} VND` : "N/A"}
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
          {autoBidError && <p className="text-xs text-red-600 font-semibold">{autoBidError}</p>}
          {autoBidSuccess && <p className="text-xs text-green-600 font-semibold">{autoBidSuccess}</p>}
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
            <label className="text-xs font-bold text-[#CE2029]">
              Your Bid (min: {minBid.toLocaleString()} VND)
            </label>
            <input 
              type="number" 
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid amount"
              className="w-full h-10 border border-gray-200 rounded-md px-4 text-sm outline-none focus:border-[#CE2029] transition-all"
            />
          </div>
          {bidError && <p className="text-xs text-red-600 font-semibold">{bidError}</p>}
          {bidSuccess && <p className="text-xs text-green-600 font-semibold">{bidSuccess}</p>}
          <button 
            onClick={handlePlaceBid}
            disabled={isPlacingBid || !bidAmount}
            className="w-full h-11 bg-[#CE2029] text-white font-bold text-sm rounded-md hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingBid ? "Placing Bid..." : "Place Bid"}
          </button>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Recent Bids</h3>
          {isLoadingHistory && <span className="text-xs text-gray-500">Loading...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-2">Bidder</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Time</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bidHistory.length === 0 && !isLoadingHistory && (
                <tr>
                  <td colSpan={4} className="py-4 text-gray-400">No bids yet.</td>
                </tr>
              )}
              {bidHistory.map((bid) => (
                <tr key={bid.bidId} className="border-t border-gray-50 text-gray-700">
                  <td className="py-2 font-semibold">{bid.winnerEmail || "-"}</td>
                  <td className="py-2 font-bold text-gray-900">
                    {Number(bid.amount || 0).toLocaleString()} VND
                  </td>
                  <td className="py-2">
                    {bid.bidTime ? new Date(bid.bidTime).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-2">{bid.status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};