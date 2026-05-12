"use client";

import React, { useState } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Search, ChevronDown, Calendar, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import AdminAuctionCard from "./AdminAuctionCard"; 

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

type AuctionStatus = "Upcoming" | "Live" | "Ended";

interface AuctionSession {
  id: number;
  name: string;
  status: AuctionStatus;
  openDate?: string;
  endDate?: string;
  endedDate?: string;
  imageUrl: string;
}

const mockSessions: AuctionSession[] = [
  { id: 1, name: "MSI Raider GE78 Gaming Laptop", status: "Upcoming", openDate: "15/3/2026", imageUrl: "/laptop-image.png" },
  { id: 2, name: "MSI Raider GE78 Gaming Laptop", status: "Upcoming", openDate: "15/3/2026", imageUrl: "/laptop-image.png" },
  { id: 3, name: "MSI Raider GE78 Gaming Laptop", status: "Upcoming", openDate: "15/3/2026", imageUrl: "/laptop-image.png" },
  { id: 4, name: "MSI Raider GE78 Gaming Laptop", status: "Live", openDate: "5/3/2026", endDate: "12/3/2026", imageUrl: "/laptop-image.png" },
  { id: 5, name: "MSI Raider GE78 Gaming Laptop", status: "Live", openDate: "5/3/2026", endDate: "12/3/2026", imageUrl: "/laptop-image.png" },
  { id: 6, name: "MSI Raider GE78 Gaming Laptop", status: "Live", openDate: "5/3/2026", endDate: "12/3/2026", imageUrl: "/laptop-image.png" },
  { id: 7, name: "MSI Raider GE78 Gaming Laptop", status: "Ended", endedDate: "1/3/2026", imageUrl: "/laptop-image.png" },
];

const mockPending = [
  { id: 101, name: "MSI Raider GE78 Gaming Laptop", registrationDay: "15/3/2026", registrant: "Nguyen Van Huy", imageUrl: "/laptop-image.png" },
  { id: 102, name: "MSI Raider GE78 Gaming Laptop", registrationDay: "15/3/2026", registrant: "Nguyen Van Huy", imageUrl: "/laptop-image.png" },
];

export default function AdminAuctionsPage() {
  const [activeTab, setActiveTab] = useState<"sessions" | "awaiting">("sessions");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All category");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("All category");
    setStartDate(null);
    setEndDate(null);
    setStatusFilters([]);
  };

  const handleStatusToggle = (status: string) => {
    setStatusFilters(prev => {
      const isAlreadySelected = prev.includes(status);
      if (isAlreadySelected) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setStartDate(null);
    }
  };

  const parseDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = searchTerm.length >= 2 ? session.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    
    const matchesStatus = statusFilters.length === 0 || statusFilters.length === 3 || statusFilters.includes(session.status);
    
    let matchesDate = true;
    const itemDate = parseDate(session.openDate || session.endedDate);
    if (itemDate) {
      if (startDate && endDate) matchesDate = itemDate >= startDate && itemDate <= endDate;
      else if (startDate) matchesDate = itemDate >= startDate;
      else if (endDate) matchesDate = itemDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });  

  const filteredPending = mockPending.filter(auction => {
    let matchesDate = true;
    const itemDate = parseDate(auction.registrationDay);
    if (itemDate) {
      if (startDate && endDate) matchesDate = itemDate >= startDate && itemDate <= endDate;
      else if (startDate) matchesDate = itemDate >= startDate;
      else if (endDate) matchesDate = itemDate <= endDate;
    }
    return matchesDate;
  });

  const filterInputClass = "bg-[#f5f5f5] rounded-xl px-4 h-11 outline-none border border-transparent focus:border-[#cc2229] focus:bg-white transition-all text-sm font-medium w-full";

  return (
    <div className={`${jost.className} min-h-screen bg-white flex flex-col text-gray-900`}>
      <Header />

      <main className="max-w-screen-xl mx-auto w-full py-10 flex-1 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3">
            <Sidebar />
          </aside>

          <div className="md:col-span-9 pl-2">
            <div className="space-y-8">
              
              <div className="flex border-b border-gray-200 gap-8">
                {["sessions", "awaiting"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => { setActiveTab(tab as any); handleResetFilters(); }}
                    className={`pb-3 text-lg font-bold transition-colors border-b-2 capitalize ${
                      activeTab === tab ? "text-[#cc2229] border-[#cc2229]" : "text-gray-400 hover:text-gray-800 border-transparent"
                    }`}
                  >
                    {tab === "sessions" ? "List of auction sessions" : "List awaiting approval"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[#ce2029] font-bold text-xl">Search & Filter</h3>
                  <button onClick={handleResetFilters} className="p-1 hover:rotate-180 transition-transform duration-500 text-gray-400 hover:text-[#cc2229]">
                    <RotateCcw size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white">
                  <div className="flex-grow min-w-[200px] relative">
                    <input 
                      type="text" placeholder="Search..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`${filterInputClass} pl-10`} 
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>

                  <div className="w-40 relative">
                    <select 
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      className={`${filterInputClass} appearance-none pr-10`}
                    >
                      <option value="All category">All category</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>

                  <div className="w-36 relative custom-datepicker">
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      startDate={startDate}
                      endDate={endDate}                    
                      maxDate={endDate || undefined} 
                      placeholderText="From date"
                      dateFormat="dd/MM/yyyy"
                      className={filterInputClass}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>

                  <div className="w-36 relative custom-datepicker">
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || undefined}
                      placeholderText="To date"
                      dateFormat="dd/MM/yyyy"
                      className={filterInputClass}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>

                  <div className="flex items-center gap-4 ml-2 h-11">
                    <span className="text-[#ce2029] font-bold text-sm mr-1">Status:</span>
                    {['Upcoming', 'Live', 'Ended'].map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox" checked={statusFilters.includes(status)}
                            onChange={() => handleStatusToggle(status)}
                            className="w-4 h-4 border-2 border-gray-300 rounded checked:bg-[#cc2229] checked:border-[#cc2229] transition-all"
                          />
                          <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-600 group-hover:text-black transition-colors">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === "sessions" ? (
                  filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <AdminAuctionCard 
                        key={session.id} 
                        id={session.id}
                        title={session.name}
                        image={session.imageUrl}
                        status={session.status}
                        openDate={session.openDate}
                        endDate={session.endDate}
                        endedDate={session.endedDate}
                        onDetailsClick={() => {}} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="font-black tracking-widest text-lg text-gray-300">NO RESULTS FOUND</p>
                    </div>
                  )
                ) : (
                  filteredPending.length > 0 ? (
                    filteredPending.map((auction) => (
                      <div key={auction.id} className="border border-dashed border-gray-300 rounded-[32px] p-6 flex flex-col bg-white hover:border-[#cc2229] transition-colors group hover:shadow-lg">
                        <div className="relative h-36 mb-4 w-full flex items-center justify-center overflow-hidden bg-white rounded-xl">
                          <Image src={auction.imageUrl} alt={auction.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <h3 className="font-bold text-[15px] leading-tight mb-4 text-black min-h-[40px]">{auction.name}</h3>
                        <div className="text-sm text-gray-800 min-h-[45px] mb-4 space-y-2">
                          <p>Registration day: <span className="font-bold text-[#cc2229]">{auction.registrationDay}</span></p>
                          <p>Registrant: <span className="font-bold text-gray-900">{auction.registrant}</span></p>
                        </div>
                        <button className="mt-auto w-fit py-2 px-6 bg-[#cc2229] hover:bg-[#b71c1c] text-white text-sm font-bold rounded transition-colors active:scale-95 shadow-md">
                          Details
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="font-black tracking-widest text-lg text-gray-300">NO RESULTS FOUND</p>
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-end pt-4">
                <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                  <span>1 - {activeTab === "sessions" ? filteredSessions.length : filteredPending.length}</span>
                  <div className="flex gap-1">
                    <button className="p-1 hover:text-black transition-colors"><ChevronLeft size={16} /></button>
                    <button className="p-1 hover:text-black transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .custom-datepicker .react-datepicker-wrapper { width: 100%; }
        .react-datepicker { font-family: inherit; border-radius: 12px; border: 1px solid #eee; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .react-datepicker__header { background-color: white; border-bottom: 1px solid #eee; }
        .react-datepicker__day--selected { background-color: #cc2229 !important; border-radius: 6px; }
      `}</style>
    </div>
  );
}