"use client";

import React, { useState, useMemo } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Search, Calendar, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import AdminAuctionCard from "./AdminAuctionCard"; 
import AuctionDetailModal from "./AuctionDetailModal";

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
  { id: 1, name: "MSI Raider GE78 Gaming Laptop 1", status: "Upcoming", openDate: "15/3/2026", imageUrl: "/laptop-image.png" },
  { id: 2, name: "MSI Raider GE78 Gaming Laptop 2", status: "Upcoming", openDate: "15/3/2026", imageUrl: "/laptop-image.png" },
  { id: 3, name: "MSI Raider GE78 Gaming Laptop 3", status: "Upcoming", openDate: "15/3/2026", imageUrl: "/laptop-image.png" },
  { id: 4, name: "MSI Raider GE78 Gaming Laptop 4", status: "Live", openDate: "5/3/2026", endDate: "12/3/2026", imageUrl: "/laptop-image.png" },
  { id: 5, name: "MSI Raider GE78 Gaming Laptop 5", status: "Live", openDate: "5/3/2026", endDate: "12/3/2026", imageUrl: "/laptop-image.png" },
  { id: 6, name: "MSI Raider GE78 Gaming Laptop 6", status: "Live", openDate: "5/3/2026", endDate: "12/3/2026", imageUrl: "/laptop-image.png" },
  { id: 7, name: "MSI Raider GE78 Gaming Laptop 7", status: "Ended", endedDate: "1/3/2026", imageUrl: "/laptop-image.png" },
  { id: 8, name: "MSI Raider GE78 Gaming Laptop 8", status: "Ended", endedDate: "1/3/2026", imageUrl: "/laptop-image.png" },
];

const mockPending = [
  { id: 101, name: "Awaiting Item 1", registrationDay: "15/3/2026", registrant: "Nguyen Van A", imageUrl: "/laptop-image.png" },
  { id: 102, name: "Awaiting Item 2", registrationDay: "16/3/2026", registrant: "Nguyen Van B", imageUrl: "/laptop-image.png" },
  { id: 103, name: "Awaiting Item 3", registrationDay: "17/3/2026", registrant: "Nguyen Van C", imageUrl: "/laptop-image.png" },
  { id: 104, name: "Awaiting Item 4", registrationDay: "18/3/2026", registrant: "Nguyen Van D", imageUrl: "/laptop-image.png" },
  { id: 105, name: "Awaiting Item 5", registrationDay: "19/3/2026", registrant: "Nguyen Van E", imageUrl: "/laptop-image.png" },
  { id: 106, name: "Awaiting Item 6", registrationDay: "20/3/2026", registrant: "Nguyen Van F", imageUrl: "/laptop-image.png" },
  { id: 107, name: "Awaiting Item 7", registrationDay: "21/3/2026", registrant: "Nguyen Van G", imageUrl: "/laptop-image.png" },
];

export default function AdminAuctionsPage() {
  const [activeTab, setActiveTab] = useState<"sessions" | "awaiting">("sessions");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setStatusFilters([]);
    setCurrentPage(1);
  };

  const handleStatusToggle = (status: string) => {
    setStatusFilters(prev => {
      const updated = prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status];
      setCurrentPage(1); 
      return updated;
    });
  };

  const handleDetailsClick = (id: number) => {
    const auction = activeTab === "sessions" 
      ? mockSessions.find(i => i.id === id) 
      : mockPending.find(i => i.id === id);
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const parseDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredData = useMemo(() => {
    if (activeTab === "sessions") {
      return mockSessions.filter(session => {
        const matchesSearch = searchTerm.length >= 2 ? session.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesStatus = statusFilters.length === 0 || statusFilters.length === 3 || statusFilters.includes(session.status);
        let matchesDate = true;
        const itemDate = parseDate(session.openDate || session.endedDate);
        if (itemDate && (startDate || endDate)) {
          if (startDate && endDate) matchesDate = itemDate >= startDate && itemDate <= endDate;
          else if (startDate) matchesDate = itemDate >= startDate;
          else if (endDate) matchesDate = itemDate <= endDate;
        }
        return matchesSearch && matchesStatus && matchesDate;
      });
    } else {
      return mockPending.filter(auction => {
        const matchesSearch = searchTerm.length >= 2 ? auction.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        let matchesDate = true;
        const itemDate = parseDate(auction.registrationDay);
        if (itemDate && (startDate || endDate)) {
          if (startDate && endDate) matchesDate = itemDate >= startDate && itemDate <= endDate;
          else if (startDate) matchesDate = itemDate >= startDate;
          else if (endDate) matchesDate = itemDate <= endDate;
        }
        return matchesSearch && matchesDate;
      });
    }
  }, [activeTab, searchTerm, statusFilters, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                    onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
                    className={`pb-3 text-lg font-bold transition-colors border-b-2 capitalize ${
                      activeTab === tab ? "text-[#ce2029] border-[#ce2029]" : "text-gray-400 hover:text-gray-800 border-transparent"
                    }`}
                  >
                    {tab === "sessions" ? "List of auction sessions" : "List awaiting approval"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[#ce2029] font-bold text-xl">Search</h3>
                  <button onClick={handleResetFilters} className="p-1 hover:rotate-180 transition-transform duration-500 text-gray-400 hover:text-[#cc2229]">
                    <RotateCcw size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white">
                  <div className="flex-grow min-w-[280px]">
                    <div className="relative group">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                        placeholder="Search by keyword..."
                        className="w-full h-12 bg-white border border-gray-200 rounded-xl px-12 outline-none font-medium text-gray-700 focus:border-[#CE2029] transition-all"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CE2029]" size={18} />
                    </div>
                  </div>

                  <div className="w-36 relative custom-datepicker">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => {setStartDate(date); setCurrentPage(1);}}
                      placeholderText="From date"
                      dateFormat="dd/MM/yyyy"
                      className={filterInputClass}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>

                  <div className="w-36 relative custom-datepicker">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => {setEndDate(date); setCurrentPage(1);}}
                      placeholderText="To date"
                      dateFormat="dd/MM/yyyy"
                      className={filterInputClass}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                  
                  <div className="flex items-center justify-between w-full border-b border-gray-100 pb-2">
                    {activeTab === "sessions" ? (
                      <div className="flex items-center gap-4 ml-2 h-11">
                        <span className="text-[#ce2029] font-bold text-sm mr-1">Status:</span>
                        {['Upcoming', 'Live', 'Ended'].map((status) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox" checked={statusFilters.includes(status)}
                              onChange={() => handleStatusToggle(status)}
                              className="w-4 h-4 border-2 border-gray-300 rounded checked:bg-[#cc2229] transition-all"
                            />
                            <span className="text-xs font-bold text-gray-600 group-hover:text-black transition-colors">{status}</span>
                          </label>
                        ))}
                      </div>
                    ): <div className="h-11" />}

                    <div className="flex justify-end"> 
                      <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                        <span>{filteredData.length > 0 ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}` : 0} / {filteredData.length}</span>
                        <div className="flex gap-1">
                          <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} className="p-1 hover:text-black transition-colors disabled:opacity-30"><ChevronLeft size={16} /></button>
                          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => goToPage(currentPage + 1)} className="p-1 hover:text-black transition-colors disabled:opacity-30"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    activeTab === "sessions" ? (
                      <AdminAuctionCard 
                        key={item.id} 
                        id={item.id}
                        title={(item as AuctionSession).name}
                        image={(item as AuctionSession).imageUrl}
                        status={(item as AuctionSession).status}
                        openDate={(item as AuctionSession).openDate}
                        endDate={(item as AuctionSession).endDate}
                        endedDate={(item as AuctionSession).endedDate}
                        onDetailsClick={handleDetailsClick} 
                      />
                    ) : (
                      <div key={item.id} className="border border-dashed border-gray-300 rounded-[32px] p-6 flex flex-col bg-white hover:border-[#cc2229] transition-all group hover:shadow-lg min-h-[450px]">
                        <div className="relative w-full h-48 mb-4 bg-[#f8f8f8] rounded-2xl overflow-hidden flex-shrink-0">
                          <Image 
                            src={(item as any).imageUrl} 
                            alt={(item as any).name} 
                            fill 
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                        
                        <h3 className="font-bold text-[16px] leading-tight mb-3 text-gray-900 min-h-[40px] line-clamp-2">
                          {(item as any).name}
                        </h3>
                        
                        <div className="text-sm text-gray-600 mb-6 space-y-2 flex-grow">
                          <p className="flex justify-between items-center">
                            <span>Registration day:</span>
                            <span className="font-bold text-[#cc2229]">{(item as any).registrationDay}</span>
                          </p>
                          <p className="flex justify-between items-center">
                            <span>Registrant:</span>
                            <span className="font-bold text-gray-900">{(item as any).registrant}</span>
                          </p>
                        </div>

                        <button 
                          onClick={() => handleDetailsClick(item.id)}
                          className="mt-auto w-fit py-2.5 px-8 text-white text-sm font-bold rounded-lg hover:opacity-80 transition-all active:scale-95"
                          style={{ backgroundColor: '#cc2229' }}
                        >
                          Details
                        </button>
                      </div>
                    )
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="font-black tracking-widest text-lg text-gray-300">No results found</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className={`px-6 py-2 border-2 font-bold rounded-full transition-all ${
                      currentPage === 1 
                      ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                      : "border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 flex items-center justify-center border-2 rounded-full font-[900] transition-all ${
                        currentPage === page
                        ? "bg-[#d32f2f] border-[#d32f2f] text-white shadow-lg"
                        : "border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className={`px-6 py-2 border-2 font-bold rounded-full transition-all ${
                      currentPage === totalPages 
                      ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                      : "border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <AuctionDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          data={selectedAuction} 
        />
      </main>

      <Footer />
    </div>
  );
}