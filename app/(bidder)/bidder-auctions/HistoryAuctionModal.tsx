"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface HistoryAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryAuctionModal = ({ isOpen, onClose }: HistoryAuctionModalProps) => {
  if (!isOpen) return null;

  const bidHistory = [
    { no: 3, amount: "20,000,000 VND", time: "10/3/2026 23:44:09" },
    { no: 2, amount: "19,800,000 VND", time: "10/3/2026 13:03:19" },
    { no: 1, amount: "19,500,000 VND", time: "10/3/2026 11:25:06" },
  ];

  const auctionDetails = [
    { label: "Type:", value: "Auction" },
    {
      label: "Description:",
      value:
        "High-performance gaming laptop equipped with Intel Core i7 processor, NVIDIA RTX 4060 GPU, 16GB RAM, and 1TB SSD. Ideal for gaming, streaming, and high-end graphics work.",
    },
    { label: "Starting price:", value: "19,000,000 VND" },
    { label: "Property code:", value: "7f3c2c5e-4f92-4d6b-8f6a-5c2b9a1f4a11" },
    { label: "Bid increment:", value: "200,000 VND" },
    { label: "Buy now price:", value: "27,000,000 VND" },
    { label: "Status:", value: "Ended" },
    { label: "Category:", value: "Electronics" },
    { label: "Bidding start time:", value: "10/3/2026 09:00:00" },
    { label: "Bidding end time:", value: "15/3/2026 09:00:00" },
  ];

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
                src="/laptop-image.png" 
                alt="Main Laptop"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition">
                <Image src="/laptop-sub1.jpg" alt="Sub 1" fill className="object-cover" />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition">
                <Image src="/laptop-sub2.jpg" alt="Sub 2" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900">ASUS ROG Strix G16 Gaming Laptop</h3>
            
            <div className="space-y-1">
              <p className="text-red-600 font-black text-sm">Highest Bid:</p>
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <span className="text-3xl font-black text-red-600 italic">20,000,000 VND</span>
              </div>
              <p className="text-yellow-500 font-black text-xl text-center italic mt-2">You Win</p>
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
                {bidHistory.map((bid, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-center border-r border-gray-100">{bid.no}</td>
                    <td className="py-4 px-6 text-center border-r border-gray-100">{bid.amount}</td>
                    <td className="py-4 px-6 text-center">{bid.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryAuctionModal;