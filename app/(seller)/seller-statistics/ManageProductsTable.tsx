"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { auctionService } from "@/services/auctionService";

export const ManageProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortField, setSortField] = useState("revenue");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    auctionService.getMyAuctions(0, 999)
      .then((res) => {
        const auctionList = res.data?.content || [];
        const mapped = auctionList.map((item: any) => {
          const isEnded = item.status === "ENDED";
          const revenue = isEnded ? (item.buyNowPrice || item.startingPrice || 0) : 0;
          return {
            id: item.id,
            name: item.productName || "No Name",
            category: item.categoryName || "Uncategorized",
            status: item.status || "UNKNOWN",
            date: item.biddingEndTime ? new Date(item.biddingEndTime).toLocaleDateString("en-GB") : "-",
            bids: 0,
            type: item.buyNowPrice ? "Buy now" : "Auction",
            revenue,
            rawDate: item.biddingEndTime ? new Date(item.biddingEndTime).getTime() : 0,
          };
        });
        setProducts(mapped);
      })
      .catch(console.error);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("All Category");
    setStatusFilter("All Status");
    setSortField("revenue");
    setSortOrder("desc");
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = searchTerm.length >= 2 ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchCat = categoryFilter === "All Category" || p.category === categoryFilter;
    const matchStatus = statusFilter === "All Status" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "date") {
      valA = a.rawDate;
      valB = b.rawDate;
    }
    return sortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const SortIcons = ({ field }: { field: string }) => (
    <div className="flex flex-col -space-y-1 ml-1.5">
      <ChevronDown className={`rotate-180 transition-colors ${sortField === field && sortOrder === "asc" ? "text-black-600" : "text-gray-300"}`} size={12} strokeWidth={4} />
      <ChevronDown className={`transition-colors ${sortField === field && sortOrder === "desc" ? "text-black600" : "text-gray-300"}`} size={12} strokeWidth={4} />
    </div>
  );

  return (
    <div className="space-y-6 mt-16">
      <h3 className="text-[#d32f2f] font-[900] text-[22px] tracking-tight">Manage Products</h3>
      
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword..."
            className="w-full h-12 bg-white border border-gray-200 rounded-full px-6 pl-12 text-[13px] outline-none focus:border-gray-300 transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
        </div>

        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-12 border border-gray-200 rounded-full px-6 text-[15px] font-medium text-gray-700 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_15px_center] bg-no-repeat pr-12 min-w-[160px]"
        >
          <option>All Category</option>
          {Array.from(new Set(products.map(p => p.category))).map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 border border-gray-200 rounded-full px-6 text-[15px] font-medium text-gray-700 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_15px_center] bg-no-repeat pr-12 min-w-[160px]"
        >
          <option>All Status</option>
          <option>Upcoming</option>
          <option>Live</option>
          <option>Ended</option>
          <option>ENDED</option>
        </select>

        <RotateCcw 
          size={28} 
          className="text-gray-400 cursor-pointer hover:rotate-[-90deg] hover:text-red-600 transition-all ml-2" 
          onClick={handleReset}
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-center border-collapse min-w-[1000px] bg-white">
            <thead>
            <tr className="bg-gray-50 text-gray-900 font-[900] text-[15px] border-b border-gray-300">
                <th className="py-4 border-r border-gray-200 w-[5%]">No</th>
                <th className="py-4 border-r border-gray-200 w-[20%] cursor-pointer group" onClick={() => handleSort("name")}>
                <div className="flex items-center justify-center gap-1 mx-auto w-fit">
                    Name <SortIcons field="name" />
                </div>
                </th>
                <th className="py-4 border-r border-gray-200 w-[12%]">Category</th>
                <th className="py-4 border-r border-gray-200 w-[10%]">Status</th>
                <th className="py-4 border-r border-gray-200 w-[12%] cursor-pointer group" onClick={() => handleSort("date")}>
                <div className="flex items-center justify-center gap-1 mx-auto w-fit">
                    Date <SortIcons field="date" />
                </div>
                </th>
                <th className="py-4 border-r border-gray-200 w-[8%]">Bids</th>
                <th className="py-4 border-r border-gray-200 w-[10%]">Type</th>
                <th className="py-4 cursor-pointer group" onClick={() => handleSort("revenue")}>
                <div className="flex items-center justify-center gap-1 mx-auto w-fit">
                    Revenue <SortIcons field="revenue" />
                </div>
                </th>
            </tr>
            </thead>
            <tbody>
            {sortedProducts.length > 0 ? (
                sortedProducts.map((item, idx) => {

                return (
                    <tr 
                    key={item.id || idx} 
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 font-normal`}
                    >
                    <td className="py-6 border-r border-gray-100 font-bold">{idx + 1}</td>
                    <td className="py-6 border-r border-gray-100">{item.name}</td>
                    <td className="py-6 border-r border-gray-100">{item.category}</td>
                    <td className="py-6 border-r border-gray-100">{item.status}</td>
                    <td className="py-6 border-r border-gray-100">{item.date}</td>
                    <td className="py-6 border-r border-gray-100">{item.bids}</td>
                    <td className="py-6 border-r border-gray-100">{item.type}</td>
                    <td className="py-6">{item.revenue.toLocaleString('en-US')} VND</td>
                    </tr>
                );
                })
            ) : (
                <tr>
                <td colSpan={8} className="py-20 text-center text-gray-400 font-bold">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                    <Search size={48} strokeWidth={2} />
                    <p className="text-lg">No products found</p>
                    </div>
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    </div>
  );
};