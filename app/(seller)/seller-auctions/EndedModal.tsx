"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

interface EndedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EndedModal = ({ isOpen, onClose }: EndedModalProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const initialBidHistory = [
    { no: 3, name: "John Smith", amount: 20000000, time: "10/3/2026 23:44:09", isLeading: true },
    { no: 2, name: "Alice Nguyen", amount: 19800000, time: "10/3/2026 13:03:19", isLeading: false },
    { no: 1, name: "Tony Phan", amount: 19500000, time: "10/3/2026 11:25:06", isLeading: false },
  ];

  const sortedBidHistory = [...initialBidHistory].sort((a, b) => {
    return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
  });

  const handleSort = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  if (!isOpen) return null;

  const details = [
    { label: "Starting price:", value: "19,000,000 VND" },
    { label: "Property code:", value: "7f3c2c5e-4f92-4d6b-8f6a-5c2b9a1f4a11" },
    { label: "Bid increment:", value: "200,000 VND" },
    { label: "Buy now price:", value: "27,000,000 VND" },
    { label: "Status:", value: "Ended" },
    { label: "Category:", value: "Electronics" },
    { label: "Registration time:", value: "5/3/2026 09:00:00" },
    { label: "Approval time:", value: "7/3/2026 09:00:00" },
    { label: "Bidding start time:", value: "10/3/2026 09:00:00" },
    { label: "Bidding end time:", value: "15/3/2026 09:00:00" },
  ];

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200`}>
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden scale-in-center animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center px-8 py-6 bg-white z-10">
          <h2 className="text-[28px] font-[900] text-gray-900 tracking-tight">Ended Auction Details</h2>
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
                <Image src="/banner.jpg" alt="Main product" fill className="object-cover" />
              </div>

              <div className="flex gap-4 overflow-x-auto">
                <div className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image src="/banner.jpg" alt="Thumb 1" fill className="object-cover" />
                </div>
                <div className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image src="/nen.jpg" alt="Thumb 2" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-2xl font-[900] text-gray-900">
                ASUS ROG Strix G16 Gaming Laptop
              </h3>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[#d32f2f] font-bold text-sm mb-1">
                    Highest Bid:
                  </p>
                  <div className="border border-gray-300 rounded-none p-3 text-center">
                    <span className="text-xl font-[900] text-[#d32f2f] tracking-wide">
                      20,000,000 VND
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[#d32f2f] font-bold text-sm mb-1">
                    Winner:
                  </p>
                  <div className="border border-gray-300 rounded-none p-3 text-center">
                    <span className="text-xl font-[900] text-[#d32f2f] tracking-wide">
                      John Smith
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold text-[#d32f2f] whitespace-nowrap text-[15px]">
                    Description:
                  </span>
                  <span className="text-right font-medium text-gray-800 text-[15px] leading-relaxed">
                    High-performance gaming laptop equipped<br/>
                    with Intel Core i7 processor, NVIDIA RTX 4060<br/>
                    GPU, 16GB RAM, and 1TB SSD. Ideal for<br/>
                    gaming, streaming, and high-end graphics<br/>
                    work.
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
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-[#d32f2f] font-[900] text-lg mb-4 underline decoration-2 underline-offset-4">
              Bid History
            </h3>
            
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-center border-collapse min-w-[600px] bg-white">
                <thead>
                  <tr className="bg-gray-50 text-[#d32f2f] font-[900] text-[15px] border-b border-gray-300">
                    <th className="py-4 border-r border-gray-200 w-[10%]">No</th>
                    <th className="py-4 border-r border-gray-200 w-[30%]">Bidder Name</th>
                    <th className="py-4 border-r border-gray-200 w-[30%]">
                      <div className="flex items-center justify-center gap-2 cursor-pointer select-none group mx-auto w-fit" onClick={handleSort}>
                        Bid Amount
                        <div className="flex flex-col -space-y-1.5">
                          <ChevronDown className={`rotate-180 transition-colors ${sortOrder === "asc" ? "text-red-600" : "text-gray-300 group-hover:text-gray-400"}`} size={14} strokeWidth={4} />
                          <ChevronDown className={`transition-colors ${sortOrder === "desc" ? "text-red-600" : "text-gray-300 group-hover:text-gray-400"}`} size={14} strokeWidth={4} />
                        </div>
                      </div>
                    </th>
                    <th className="py-4 w-[30%]">Bid Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBidHistory.map((bid, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${bid.isLeading ? 'text-blue-700 font-[900] bg-blue-50/20' : 'text-gray-700 font-medium'}`}>
                      <td className="py-4 border-r border-gray-100">{bid.no}</td>
                      <td className="py-4 border-r border-gray-100">{bid.name}</td>
                      <td className="py-4 border-r border-gray-100">{bid.amount.toLocaleString()} VND</td>
                      <td className="py-4">{bid.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-10 w-full"></div>
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