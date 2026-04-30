"use client";

import React, { useState } from "react";
import { Jost } from "next/font/google";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BidderProfileHeader } from "@/components/BidderProfileHeader";
import { BidderSidebar } from "@/components/BidderSidebar";
import { AuctionCard } from "./AuctionCard";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function BidderAuctionsPage() {
  const [activeTab, setActiveTab] = useState("Watching");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const tabs = ["Watching", "Participating", "History"];
  
  const auctions = [
    { title: "Laptop Gaming", time: "10/3/2026 09:00:00", startingBid: "12,000,000", image: "/laptop-image.png" },
    { title: "Laptop Gaming", time: "10/3/2026 09:00:00", startingBid: "12,000,000", image: "/laptop-image.png" },
    { title: "Laptop Gaming", time: "10/3/2026 09:00:00", startingBid: "12,000,000", image: "/laptop-image.png" },
  ];

  const filterInputClass = "border border-gray-300 rounded-full px-5 py-2 outline-none focus:border-red-500 transition-all text-sm font-medium";

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white`}>
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <nav className="mb-6">
          <h1 className="text-3xl font-[900] text-[#0f172a]">My Auctions</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-tighter">Home {'>'} My Auctions</p>
        </nav>

        <BidderProfileHeader 
          name="Nguyen Van Huy"
          role="Bidder"
          avatarUrl="/avatar.jfif"
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <BidderSidebar />

          <section className="md:col-span-9 space-y-8">
            {/* Tabs Header */}
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-full text-lg font-bold transition-all ${
                    activeTab === tab 
                    ? "bg-gray-200 text-gray-900 shadow-inner" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters Row */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Search */}
                <input type="text" placeholder="Search by keyword..." className={filterInputClass} />
                
                {/* From Date */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 ml-4">From Date:</label>
                  <div className="relative">
                    <input type="text" className={`${filterInputClass} w-full`} />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* To Date */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 ml-4">To Date:</label>
                  <div className="relative">
                    <input type="text" className={`${filterInputClass} w-full`} />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="relative min-w-[200px]">
                  <select className={`${filterInputClass} w-full appearance-none bg-white`}>
                    <option>All Category</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Pagination Simple */}
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <span>1 - 15</span>
                  <ChevronLeft size={16} className="cursor-pointer hover:text-gray-900" />
                  <ChevronRight size={16} className="cursor-pointer hover:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Grid Auctions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {auctions.map((item, idx) => (
                <AuctionCard key={idx} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} onSubmit={() => {}} />
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onConfirm={() => setIsEditOpen(false)}
        initialData={{ fullname: "Nguyen Van Huy", email: "huy@gmail.com", phone: "123", street: "96", province: "HCM", ward: "Thu Duc" }}
      />
      
      <Footer />
    </div>
  );
}