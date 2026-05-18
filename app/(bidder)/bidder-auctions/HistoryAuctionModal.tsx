"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { auctionService } from "@/services/auctionService";
import { biddingService } from "@/services/biddingService";

interface HistoryAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId?: string | null;
}

const HistoryAuctionModal = ({ isOpen, onClose, auctionId }: HistoryAuctionModalProps) => {
  const [auctionDetail, setAuctionDetail] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && auctionId) {
      auctionService.getByIdPublic(Number(auctionId))
        .then(res => setAuctionDetail(res.data))
        .catch(err => console.error(err));

      biddingService.getImmutableHistory(auctionId)
        .then(res => {
          const mapped = res.data.content.map((item: any, index: number) => ({
            no: index + 1,
            amount: `${item.amount.toLocaleString()} VND`,
            time: new Date(item.bidTime).toLocaleString('en-GB')
          }));
          setBidHistory(mapped);
        })
        .catch(err => console.error(err));
    } else {
      setAuctionDetail(null);
      setBidHistory([]);
    }
  }, [isOpen, auctionId]);

  if (!isOpen) return null;

  const auctionDetails = auctionDetail ? [
    { label: "Type:", value: "Auction" },
    {
      label: "Description:",
      value: auctionDetail.description || "",
    },
    { label: "Starting price:", value: `${auctionDetail.startingPrice?.toLocaleString()} VND` },
    { label: "Property code:", value: auctionDetail.id?.toString() },
    { label: "Bid increment:", value: `${auctionDetail.bidIncrement?.toLocaleString()} VND` },
    { label: "Buy now price:", value: auctionDetail.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A" },
    { label: "Status:", value: auctionDetail.status },
    { label: "Category:", value: auctionDetail.categoryName },
    { label: "Bidding start time:", value: auctionDetail.biddingStartTime ? new Date(auctionDetail.biddingStartTime).toLocaleString('en-GB') : "N/A" },
    { label: "Bidding end time:", value: auctionDetail.biddingEndTime ? new Date(auctionDetail.biddingEndTime).toLocaleString('en-GB') : "N/A" },
  ] : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
          [scrollbar-width:thin]
          [scrollbar-color:theme(colors.gray.200)_transparent]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-[900] text-[#1a1a1a]">History Auction Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} className="text-gray-900" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-100">
              <Image 
                src={auctionDetail?.images?.[0]?.imageUrl || "/laptop-image.png"} 
                alt="Main Laptop"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition">
                <Image src={auctionDetail?.images?.[1]?.imageUrl || "/laptop-sub1.jpg"} alt="Sub 1" fill className="object-cover" />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition">
                <Image src={auctionDetail?.images?.[2]?.imageUrl || "/laptop-sub2.jpg"} alt="Sub 2" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900">{auctionDetail?.productName || "Loading..."}</h3>
            
            <div className="space-y-1">
              <p className="text-red-600 font-black text-sm">Highest Bid:</p>
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <span className="text-3xl font-black text-red-600 italic">
                  {auctionDetail?.currentPrice ? `${auctionDetail.currentPrice.toLocaleString()} VND` : (auctionDetail?.startingPrice ? `${auctionDetail.startingPrice.toLocaleString()} VND` : "N/A")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {auctionDetails.map((detail, index) => (
                <div key={index} className="flex gap-4 text-sm">
                  <span className="font-black text-red-600 min-w-[120px]">{detail.label}</span>
                  <span className={`font-medium ${detail.label === 'Description:' ? 'text-justify leading-relaxed' : 'text-right flex-1'} text-gray-800`}>
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h4 className="text-red-600 font-black text-lg underline decoration-2 underline-offset-8 mb-6">Bid History</h4>
          <div className="w-full border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-red-600 font-black">
                  <th className="py-4 px-6 text-center border-r border-gray-100">No</th>
                  <th className="py-4 px-6 text-center border-r border-gray-100">Bid Amount</th>
                  <th className="py-4 px-6 text-center">Bid Time</th>
                </tr>
              </thead>
              <tbody className="font-bold text-gray-800">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-center border-r border-gray-100">{bid.no}</td>
                      <td className="py-4 px-6 text-center border-r border-gray-100">{bid.amount}</td>
                      <td className="py-4 px-6 text-center">{bid.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-gray-500 font-medium text-center">No bids yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryAuctionModal;