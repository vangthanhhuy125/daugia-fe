"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuctionFilters } from "./AuctionFilters";
import { AuctionListCard } from "./AuctionListCard";
import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

const auctionsData = Array(30).fill({
  image: "/laptop-image.png",
  title: "MSI Raider GE78 Gaming Laptop",
  status: "Upcoming",
  openDate: "2026-03-15",
  category: "Electronics",
}).map((item, i) => {
  if (i >= 5 && i < 15) return { ...item, id: i, status: "Live", openDate: "2026-04-08", endDate: "2026-04-12" };
  if (i >= 15) return { ...item, id: i, status: "Ended", openDate: "2026-04-01", endDate: "2026-04-05", category: "Property" };
  return { ...item, id: i };
});

export default function AuctionListPage() {
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get("status");

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "All category",
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: statusFromUrl ? [statusFromUrl] : [] as string[],
  });

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      setFilters(prev => ({ ...prev, status: [status] }));
      setCurrentPage(1);
    }
  }, [searchParams]);

  const ITEMS_PER_PAGE = 9;

  const filteredAuctions = useMemo(() => {
    return auctionsData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesCategory = filters.category === "All category" || item.category === filters.category;
      const matchesStatus = filters.status.length === 0 || filters.status.includes(item.status);
      
      const itemDate = new Date(item.openDate);
      const matchesStart = !filters.startDate || itemDate >= filters.startDate;
      const matchesEnd = !filters.endDate || itemDate <= filters.endDate;

      return matchesSearch && matchesCategory && matchesStatus && matchesStart && matchesEnd;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredAuctions.length / ITEMS_PER_PAGE);
  const currentAuctions = filteredAuctions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`${jost.className} flex flex-col min-h-screen bg-[#fdfdfd]`}>
      <Header />
      
      <main className="flex-grow max-w-screen-xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
           <h1 className="text-3xl font-[900] text-gray-900">List Auctions</h1>
           <p className="text-sm font-medium text-gray-400">Home {'>'} <span className="text-gray-400">List Auctions</span></p>
        </div>

        <AuctionFilters 
          onFilterChange={handleFilterChange} 
          initialStatus={filters.status} 
        />

        {currentAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentAuctions.map((item) => (
              <AuctionListCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-xl font-bold">No auctions found matching your filters.</p>
          </div>
        )}

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
      </main>

      <Footer />
    </div>
  );
}