"use client";

import React from "react";
import Image from "next/image";

interface SellerAuctionCardProps {
  id: string;
  title: string;
  image: string;
  time: string;
  price: string;
  priceLabel: string;
  status: "pending" | "upcoming" | "live" | "ended" | "rejected";
  result?: "sold" | "unsold";
  onDetailsClick: (id: string, status: any) => void;
}

const SellerAuctionCard = ({ 
  id,
  title, 
  image, 
  time, 
  price, 
  priceLabel, 
  status, 
  result,
  onDetailsClick
}: SellerAuctionCardProps) => {
  const isLive = status === 'live';
  const isRejected = status === 'rejected';

  // Xác định màu sắc viền/nền nổi bật dựa trên trạng thái
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "border-amber-400 bg-amber-50/30";
      case "upcoming":
        return "border-green-500 bg-green-50/30";
      case "ended":
        return "border-orange-500 bg-orange-50/30";
      case "rejected":
        return "border-gray-300 bg-gray-50/50 opacity-75";
      case "live":
        return "border-red-500 shadow-[0_0_15px_rgba(211,47,47,0.2)]";
      default:
        return "border-gray-100";
    }
  };

  return (
    <div className={`relative group border rounded-2xl p-4 transition-all hover:shadow-md bg-white ${getStatusStyles()}`}>

      {isRejected ? (
        <div className="flex flex-col h-full justify-between min-h-[180px] py-4">
          <div className="text-center my-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Status: Rejected</span>
            <h4 className="font-bold text-gray-400 text-base line-clamp-3 px-2">{title}</h4>
          </div>
          <button 
            onClick={() => onDetailsClick(id, status)}
            className="w-full py-2.5 bg-gray-400 text-white text-xs font-[900] rounded-lg hover:bg-gray-500 transition active:scale-95 tracking-wider mt-4"
          >
            Details
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-3">
            <p className="text-[10px] font-[900] text-gray-400 tracking-widest uppercase">
              {status === 'ended' ? 'End Time' : 'Auction Time'}
            </p>
            <p className="text-sm font-[900] text-gray-800">{time}</p>
          </div>

          <div className="relative aspect-video w-full mb-4 rounded-xl overflow-hidden bg-gray-50">
            <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div className="text-center space-y-1 mb-4">
            <h4 className="font-bold text-gray-900 text-base truncate">{title}</h4>
            <p className="text-xs font-medium text-gray-500">
              <span className="font-[900] text-gray-700">{priceLabel}:</span> {price}
            </p>
          </div>

          <button 
            onClick={() => onDetailsClick(id, status === "pending" || status === "upcoming" ? "upcoming" : status === "live" ? "live" : "ended")}
            className="w-full py-2.5 bg-[#d32f2f] text-white text-xs font-[900] rounded-lg hover:bg-red-700 transition active:scale-95 tracking-wider"
          >
            Details
          </button>

          {isLive && (
            <div className="absolute top-3 right-3 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerAuctionCard;