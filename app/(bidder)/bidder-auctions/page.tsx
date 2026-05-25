"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Search, RotateCcw } from "lucide-react";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Sidebar } from "@/components/Sidebar";
import AuctionCard from "./AuctionCard";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { auctionService } from "@/services/auctionService";
import { userService } from "@/services/userService";

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
  
  const [watchingAuctions, setWatchingAuctions] = useState<any[]>([]);
  const [myBidAuctions, setMyBidAuctions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getMe();
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const [publicRes, myBidRes] = await Promise.all([
          auctionService.searchPublic({ size: 100 }),
          auctionService.getMyBidAuctions(0, 200)
        ]);

        const watching = publicRes.data.content.map((item: any) => {
          const rawDate = item.biddingStartTime;
          const dateStr = rawDate ? new Date(rawDate).toLocaleString("en-GB") : "N/A";
          const priceVal = item.currentPrice ?? item.startingPrice ?? 0;

          return {
            id: item.id.toString(),
            title: item.productName,
            category: item.categoryName,
            time: dateStr,
            price: `${Number(priceVal).toLocaleString()} VND`,
            priceLabel: "Starting Bid",
            image: item.thumbnailUrl,
            status: "Watching",
            backendStatus: item.status,
            isLeading: false,
            result: undefined,
            rawDate: rawDate
          };
        });

        const myBids = myBidRes.data.content.map((item: any) => {
          const backendStatus = item.status;
          let displayStatus = "Participating";
          if (backendStatus === "ENDED") displayStatus = "History";

          let label = "Current Bid";
          if (displayStatus === "History") label = "Final Bid";

          const rawDate = displayStatus === "History"
            ? (item.endTime || item.biddingEndTime)
            : item.biddingStartTime;
          const dateStr = rawDate ? new Date(rawDate).toLocaleString("en-GB") : "N/A";
          const priceVal = item.currentPrice ?? item.startingPrice ?? 0;
          const isWinner = item.isWinner ?? item.winner ?? false;

          return {
            id: item.id.toString(),
            title: item.productName,
            category: item.categoryName,
            time: dateStr,
            price: `${Number(priceVal).toLocaleString()} VND`,
            priceLabel: label,
            image: item.thumbnailUrl || "/laptop-image.png",
            status: displayStatus,
            isLeading: Boolean(isWinner) && displayStatus === "Participating",
            result: displayStatus === "History" ? (isWinner ? "won" : "lost") : undefined,
            rawDate: rawDate
          };
        });

        setWatchingAuctions(watching);
        setMyBidAuctions(myBids);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuctions();
  }, []);

  const handleReset = () => {
    setSearchTerm("");
    setCategory("All category");
    setStartDate(null);
    setEndDate(null);
    setHistoryStatus("All status");
  };

  const sourceAuctions = activeTab === "Watching" ? watchingAuctions : myBidAuctions;
  const filteredAuctions = sourceAuctions.filter(item => {
    const matchesTab = item.status === activeTab;

    if (activeTab === "Watching") {
      const isUpcomingOrApproved = item.backendStatus === "UPCOMING" || item.backendStatus === "APPROVED";
      if (!isUpcomingOrApproved) return false;
    }
    
    const matchesSearch = searchTerm.length >= 2 
      ? item.title?.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    const matchesCategory = category === "All category" 
      ? true 
      : item.category === category;

    let matchesDate = true;
    if (item.rawDate) {
      const itemDate = new Date(item.rawDate);
      itemDate.setHours(0, 0, 0, 0);
      
      if (startDate && endDate) {
        matchesDate = itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        matchesDate = itemDate >= startDate;
      } else if (endDate) {
        matchesDate = itemDate <= endDate;
      }
    }

    return matchesTab && matchesSearch && matchesCategory && matchesDate;
  });

  const filterInputClass = "bg-[#f5f5f5] rounded-xl px-6 py-3 outline-none border-none focus:ring-2 ring-gray-200 transition-all text-sm font-medium w-full h-12";

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setStartDate(date);
    }
  };

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

        <ProfileHeader 
          name={profile?.fullName || "Loading..."}
          role={profile?.role?.name || "Bidder"}
          avatarUrl={profile?.avatarUrl || "/avatar.jfif"}
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <Sidebar />

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
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={endDate || undefined}
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
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || undefined}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
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
                  <span>{filteredAuctions.length > 0 ? `1 - ${filteredAuctions.length}` : "0"}</span>
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
                  <p className="font-[900] tracking-widest text-lg">No results found</p>
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
        initialData={profile || {}}
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