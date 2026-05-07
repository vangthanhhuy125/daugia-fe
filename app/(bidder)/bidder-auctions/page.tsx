"use client";

import React, { useState } from "react";
import { Jost } from "next/font/google";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Search, RotateCcw } from "lucide-react";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BidderProfileHeader } from "@/components/ProfileHeader";
import { BidderSidebar } from "@/components/Sidebar";
import AuctionCard from "./AuctionCard";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function BidderAuctionsPage() {
  const [activeTab, setActiveTab] = useState<"Watching" | "Participating" | "History">("Watching");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All category");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [historyStatus, setHistoryStatus] = useState("All status");

  const tabs = ["Watching", "Participating", "History"];
  
  const allAuctions = [
    { id: "1", title: "Laptop Gaming MSI", category: "Electronics", time: "10/3/2026 09:00:00", price: "12,000,000 VND", priceLabel: "Starting Bid", image: "/laptop-image.png", status: "Watching" },
    { id: "2", title: "Laptop Gaming Dell", category: "Electronics", time: "10/3/2026 09:00:00", price: "12,000,000 VND", priceLabel: "Starting Bid", image: "/laptop-image.png", status: "Watching" },
    { id: "3", title: "Laptop Gaming ASUS", category: "Electronics", time: "10/3/2026 09:00:00", price: "15,500,000 VND", priceLabel: "Current Bid", image: "/laptop-image.png", status: "Participating", isLeading: true },
    { id: "6", title: "Laptop Gaming ABCDS", category: "Electronics", time: "10/3/2026 09:00:00", price: "15,500,000 VND", priceLabel: "Current Bid", image: "/laptop-image.png", status: "Participating", isLeading: false },
    { id: "4", title: "Laptop Gaming HP", category: "Electronics", time: "10/3/2026 09:00:00", price: "20,000,000 VND", priceLabel: "Winning Bid", image: "/laptop-image.png", status: "History", result: "won" },
    { id: "5", title: "Laptop Gaming Razer", category: "Electronics", time: "10/3/2026 09:00:00", price: "12,000,000 VND", priceLabel: "Final Bid", image: "/laptop-image.png", status: "History", result: "lost" },
  ];

  const handleReset = () => {
    setSearchTerm("");
    setCategory("All category");
    setStartDate(null);
    setEndDate(null);
    setHistoryStatus("All status");
  };

  const filteredAuctions = allAuctions.filter(item => {
    const matchesTab = item.status === activeTab;
    const matchesSearch = searchTerm.length >= 2 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    const matchesCategory = category === "All category" 
      ? true 
      : item.category === category;
    
    return matchesTab && matchesSearch && matchesCategory;
  });

  const filterInputClass = "bg-[#f5f5f5] rounded-xl px-6 py-3 outline-none border-none focus:ring-2 ring-gray-200 transition-all text-sm font-medium w-full h-12";

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white text-[#1a1a1a]`}>
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <nav className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-[900] text-[#1a1a1a]">My Auctions</h1>
          </div>
          <p className="text-sm font-medium text-gray-400">Home {'>'} My Auctions</p>
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
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-10 py-3 rounded-full text-sm font-[900] transition-all ${
                    activeTab === tab 
                    ? "bg-[#e0e0e0] text-gray-900 shadow-inner" 
                    : "bg-[#f5f5f5] text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search by keywords..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${filterInputClass} pl-12 h-12 bg-white border border-gray-200 focus:border-[#d32f2f]`} 
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d32f2f]" size={18} />
                </div>
                
                <div className="space-y-1.5 custom-datepicker">
                  <label className="text-xs font-bold text-gray-400 ml-2">From date:</label>
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-600 focus:border-[#d32f2f] transition-all"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-1.5 custom-datepicker">
                  <label className="text-xs font-bold text-gray-400 ml-2">To date:</label>
                  <div className="relative">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      minDate={startDate || undefined}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-600 focus:border-[#d32f2f] transition-all"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="relative min-w-[200px]">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-700 appearance-none cursor-pointer focus:border-[#d32f2f] transition-all"
                    >
                      <option value="All category">All category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Property">Property</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-400 font-[900] text-xs uppercase tracking-widest">
                  <span>1 - 15</span>
                  <div className="flex gap-2">
                    <ChevronLeft size={18} className="cursor-pointer hover:text-gray-900 transition" />
                    <ChevronRight size={18} className="cursor-pointer hover:text-gray-900 transition" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAuctions.length > 0 ? (
                filteredAuctions.map((item) => (
                  <AuctionCard 
                    key={item.id} 
                    id={item.id}
                    title={item.title}
                    time={item.time}
                    image={item.image}
                    price={item.price}
                    priceLabel={item.priceLabel}
                    status={item.status.toLowerCase() as any}
                    result={item.result as any}
                    isLeading={item.isLeading}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                  <Search size={48} className="mb-4 opacity-10" />
                  <p className="font-[900] tracking-widest text-lg uppercase">No results found</p>
                </div>
              )}
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

      <style jsx global>{`
        .custom-datepicker .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border-radius: 12px;
          border: 1px solid #eee;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #eee;
        }
        .react-datepicker__day--selected {
          background-color: #d32f2f !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}