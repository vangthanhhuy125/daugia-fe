"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Edit3, XCircle } from "lucide-react";
import { Jost } from "next/font/google";
import { auctionService } from "@/services/auctionService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

interface UpcomingModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId?: string | null;
}

export const UpcomingModal = ({ isOpen, onClose, auctionId }: UpcomingModalProps) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [auctionDetail, setAuctionDetail] = useState<any>(null);

  useEffect(() => {
    if (isOpen && auctionId) {
      auctionService.getByIdPublic(auctionId)
        .then(res => setAuctionDetail(res.data))
        .catch(err => console.error(err));
    } else {
      setAuctionDetail(null);
    }
  }, [isOpen, auctionId]);

  useEffect(() => {
    if (!isOpen || !auctionDetail?.biddingStartTime) return;

    const targetDate = new Date(auctionDetail.biddingStartTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("00 days 00 hours 00 minutes 00 seconds");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days.toString().padStart(2, "0")} days ${hours.toString().padStart(2, "0")} hours ${minutes.toString().padStart(2, "0")} minutes ${seconds.toString().padStart(2, "0")} seconds`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, auctionDetail]);

  if (!isOpen) return null;

  const details = auctionDetail ? [
    { label: "Starting price:", value: `${auctionDetail.startingPrice?.toLocaleString()} VND` },
    { label: "Property code:", value: auctionDetail.id?.toString() },
    { label: "Bid increment:", value: `${auctionDetail.bidIncrement?.toLocaleString()} VND` },
    { label: "Buy now price:", value: auctionDetail.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A" },
    { label: "Status:", value: auctionDetail.status },
    { label: "Category:", value: auctionDetail.categoryName },
    { label: "Registration time:", value: auctionDetail.createdAt ? new Date(auctionDetail.createdAt).toLocaleString('en-GB') : "N/A" },
    { label: "Approval time:", value: auctionDetail.updatedAt ? new Date(auctionDetail.updatedAt).toLocaleString('en-GB') : "N/A" },
    { label: "Bidding start time:", value: auctionDetail.biddingStartTime ? new Date(auctionDetail.biddingStartTime).toLocaleString('en-GB') : "N/A" },
    { label: "Bidding end time:", value: auctionDetail.biddingEndTime ? new Date(auctionDetail.biddingEndTime).toLocaleString('en-GB') : "N/A" },
  ] : [];

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200`}>
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden scale-in-center animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center px-8 py-6 bg-white z-10">
          <h2 className="text-[28px] font-[900] text-gray-900 tracking-tight">Upcoming Auction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={32} className="text-gray-900" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden border border-gray-200">
                <Image src={auctionDetail?.images?.[0]?.imageUrl || "/banner.jpg"} alt="Main product" fill className="object-cover" />
              </div>

              <div className="flex gap-4 overflow-x-auto">
                <div className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image src={auctionDetail?.images?.[1]?.imageUrl || "/banner.jpg"} alt="Thumb 1" fill className="object-cover" />
                </div>
                <div className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image src={auctionDetail?.images?.[2]?.imageUrl || "/nen.jpg"} alt="Thumb 2" fill className="object-cover" />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#e0e0e0] hover:bg-gray-300 text-gray-900 h-12 rounded-xl font-bold transition-colors">
                  <Edit3 size={18} strokeWidth={2.5} />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#ff0000] hover:bg-red-700 text-white h-12 rounded-xl font-bold transition-colors shadow-md shadow-red-200">
                  <XCircle size={18} strokeWidth={2.5} />
                  Cancel
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-2xl font-[900] text-gray-900">
                {auctionDetail?.productName || "Loading..."}
              </h3>

              <div>
                <p className="text-[#d32f2f] font-bold text-sm mb-2">
                  Remaining time for the auction to begin:
                </p>
                <div className="border border-gray-300 rounded-none p-4 text-center">
                  <span className="text-xl font-medium text-gray-900 tracking-wide font-mono">
                    {timeLeft}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold text-[#d32f2f] whitespace-nowrap text-[15px]">
                    Description:
                  </span>
                  <span className="text-right font-medium text-gray-800 text-[15px] leading-relaxed">
                    {auctionDetail?.description || ""}
                  </span>
                </div>

                {details.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4">
                    <span className="font-bold text-[#d32f2f] whitespace-nowrap text-[15px]">
                      {item.label}
                    </span>
                    <span className="text-right font-medium text-gray-800 text-[15px]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-10 w-full"></div>
              
            </div>

          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            margin: 10px 0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
            border: 2px solid white;
          }
        `}</style>
      </div>
    </div>
  );
};