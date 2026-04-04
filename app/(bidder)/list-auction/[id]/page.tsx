"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UpcomingView } from "./UpcomingView";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export default function AuctionDetailPage() {
  const infoRows = [
    { label: "Starting price:", value: "19,000,000 VND" },
    { label: "Property code:", value: "7f3c2c5e-4f92-4d6b-8f6a-5c2b9a1f4a11" },
    { label: "Bid increment:", value: "200,000 VND" },
    { label: "Buy now price:", value: "27,000,000 VND" },
    { label: "Status:", value: "Upcoming", statusColor: "text-yellow-500" },
    { label: "Category:", value: "Electronics" },
    { label: "Bidding start time:", value: "10/3/2026 09:00:00" },
    { label: "Bidding end time:", value: "15/3/2026 09:00:00" },
  ];

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white`}>
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        <nav className="mb-8">
          <h1 className="text-3xl font-[900] text-gray-900 mb-1">List Auctions</h1>
          <p className="text-xs font-bold text-gray-400">
            Home {">"} List Auctions {">"} Auction Item: MSI Raider GE78 Gaming Laptop
          </p>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cột trái: Gallery & Seller (Giữ nguyên) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative aspect-video rounded-[32px] overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
              <Image src="/msi-main.jpg" alt="Product" fill className="object-contain p-4" />
            </div>

            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer hover:border-[#CE2029] transition-all">
                  <Image src={`/msi-sub-${i}.jpg`} alt="Sub" fill className="object-cover" />
                </div>
              ))}
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-[#CE2029] font-bold text-xl mb-6">Seller Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-500">Seller:</span>
                  <span className="font-bold text-gray-900">Nguyen Van An</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">4</span>
                    <Star size={18} fill="#f59e0b" className="text-amber-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500">Products Sold:</span>
                  <span className="font-bold text-gray-900">120</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin thay đổi */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-4xl font-[900] text-gray-900 tracking-tight leading-tight">
              MSI Raider GE78 Gaming Laptop
            </h2>
            
            {/* Đổ View Upcoming vào đây */}
            <UpcomingView infoRows={infoRows} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}