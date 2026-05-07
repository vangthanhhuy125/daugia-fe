"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SellerAuctionCardProps {
  id: string;
  title: string;
  image: string;
  time: string;
  price: string;
  priceLabel: string;
  status: "upcoming" | "live" | "ended";
  result?: "sold" | "unsold";
}

const SellerAuctionCard = ({ 
  id,
  title, 
  image, 
  time, 
  price, 
  priceLabel, 
  status, 
  result
}: SellerAuctionCardProps) => {
  const router = useRouter();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const shouldHighlight = status === 'live';

  const handleDetailsClick = () => {
    if (status === "upcoming" || status === "live") {
      router.push(`/list-auction/${id}`); 
    } else if (status === "ended") {
      setIsHistoryModalOpen(true);
    }
  };

  return (
    <>
      <div className={`relative group border rounded-2xl p-4 transition-all hover:shadow-md bg-white ${
        shouldHighlight ? 'border-red-400 border-2 shadow-[0_0_15px_rgba(211,47,47,0.2)]' : 'border-gray-100'
      }`}>
        
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
          <h4 className="font-bold text-gray-900 text-base">{title}</h4>
          <p className="text-xs font-medium text-gray-500">
            <span className="font-[900] text-gray-700">{priceLabel}:</span> {price}
          </p>
        </div>

        {status === 'live' && (
          <div className="text-center font-[900] text-[10px] mb-2 text-red-600 tracking-tighter italic animate-pulse">
              Live Now
          </div>
        )}

        {status === 'ended' && result && (
          <div className={`text-center font-[900] text-sm mb-3 tracking-tighter uppercase italic ${
            result === 'sold' ? 'text-green-600' : 'text-gray-400'
          }`}>
              {result === 'sold' ? 'Sold' : 'Unsold'}
          </div>
        )}

        <button 
          onClick={handleDetailsClick}
          className="w-full py-2.5 bg-[#d32f2f] text-white text-xs font-[900] rounded-lg hover:bg-red-700 transition active:scale-95 tracking-wider"
        >
          Details
        </button>

        {shouldHighlight && (
          <div className="absolute top-3 right-3 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
        )}
      </div>

    </>
  );
};

export default SellerAuctionCard;