"use client";

import React from "react";
import Image from "next/image";

interface AuctionCardProps {
  image: string;
  title: string;
  time: string;
  startingBid: string;
}

export const AuctionCard = ({ image, title, time, startingBid }: AuctionCardProps) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
      <p className="text-gray-400 text-sm font-bold mb-1">Auction Time</p>
      <p className="text-gray-900 text-base font-black mb-4">{time}</p>
      
      <div className="relative w-full h-40 mb-4">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-900 mb-4">Starting Bid: {startingBid} VND</p>
      
      <button className="w-full py-2 bg-[#CE2029] text-white font-black rounded-lg hover:bg-red-700 transition-colors text-sm">
        Details
      </button>
    </div>
  );
};