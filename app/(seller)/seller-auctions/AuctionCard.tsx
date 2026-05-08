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
  status: "upcoming" | "live" | "ended";
  result?: "sold" | "unsold";
  onDetailsClick: (id: string, status: "upcoming" | "live" | "ended") => void;
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
  const shouldHighlight = status === 'live';

  return (
    <div className={`relative group border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-md bg-white ${
      shouldHighlight ? 'shadow-[0_0_15px_rgba(211,47,47,0.2)]' : ''
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

      <button 
        onClick={() => onDetailsClick(id, status)}
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
  );
};

export default SellerAuctionCard;