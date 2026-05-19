"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { auctionService } from "@/services/auctionService";

export const CategoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    auctionService.getMyAuctions(0, 999)
      .then(res => {
        const auctionList = res.data?.content || [];

        const aggregated = auctionList.reduce((acc: Record<string, { category: string; sold: number; revenue: number }>, item: any) => {
          const catName = item.categoryName || "Uncategorized";
          if (!acc[catName]) {
            acc[catName] = { category: catName, sold: 0, revenue: 0 };
          }
          if (item.status === "ENDED") {
            acc[catName].sold += 1;
            acc[catName].revenue += (item.buyNowPrice || item.startingPrice || 0);
          }
          return acc;
        }, {});

        const sorted = Object.values(aggregated)
          .sort((a: any, b: any) => b.revenue - a.revenue)
          .map((item: any, index: number) => ({
            no: index + 1,
            ...item
          }));

        setCategoriesData(sorted);
      })
      .catch(console.error);
  }, []);

  const sortedByRevenue = [...categoriesData].sort((a, b) => b.revenue - a.revenue);

  const filteredData = sortedByRevenue.filter((item) => {
    if (searchTerm.length < 2) return true;
    return item.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const topCategoryNo = sortedByRevenue[0]?.no;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword..."
            className="w-full h-11 bg-[#f8f9fa] rounded-full px-6 pl-12 text-[13px] font-medium outline-none border border-transparent focus:border-gray-200 shadow-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
        <RotateCcw 
          size={22} 
          className="text-gray-400 cursor-pointer hover:rotate-[-90deg] transition-all" 
          onClick={() => setSearchTerm("")}
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-center border-collapse min-w-[600px] bg-white">
          <thead>
            <tr className="bg-gray-50 text-gray-900 font-[900] text-[15px] border-b border-gray-300">
              <th className="py-4 border-r border-gray-200 w-[10%]">No</th>
              <th className="py-4 border-r border-gray-200 w-[30%]">Category</th>
              <th className="py-4 border-r border-gray-200 w-[30%]">Sold Items</th>
              <th className="py-4">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isTop = item.no === topCategoryNo;                
                const rowStyle = isTop ? "text-blue-600 font-normal" : "text-gray-900 font-normal";
                
                return (
                  <tr key={item.no} className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${rowStyle}`}>
                    <td className="py-4 border-r border-gray-100 font-bold">{item.no}</td>
                    <td className="py-4 border-r border-gray-100">{item.category}</td>
                    <td className="py-4 border-r border-gray-100">{item.sold}</td>
                    <td className="py-4">{item.revenue.toLocaleString('en-US')} VND</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400 font-bold">
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Search size={48} strokeWidth={2} />
                    <p className="text-lg">No results found</p>
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