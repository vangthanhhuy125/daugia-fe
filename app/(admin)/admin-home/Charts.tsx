"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { auctionService } from "@/services/auctionService";
import { userService } from "@/services/userService";

const COLORS = ['#2DD4BF', '#F87171', '#FB923C', '#818CF8', '#8B5CF6', '#EC4899'];

export const AdminCharts = () => {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [userStats, setUserStats] = useState({ sellers: 0, bidders: 0 });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [bidsData, setBidsData] = useState<any[]>([]);

  useEffect(() => {
    userService.getAllUsers(0, 999)
      .then(res => {
        const userList = res.data?.content || [];
        const sellers = userList.filter((u: any) => u.role?.name === "SELLER" || u.role === "SELLER").length;
        const bidders = userList.filter((u: any) => u.role?.name === "BIDDER" || u.role === "BIDDER").length;
        setUserStats({ sellers, bidders });
      })
      .catch(console.error);

    auctionService.searchPublic({ size: 999 })
      .then(res => {
        const auctionList = res.data?.content || [];

        const categoryCounts: Record<string, number> = {};
        auctionList.forEach((item: any) => {
          const catName = item.categoryName || "Others";
          categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        });

        const formattedCatData = Object.keys(categoryCounts).map(cat => ({
          name: cat,
          quantity: categoryCounts[cat]
        }));
        setCategoryData(formattedCatData);

        const now = new Date();
        const pastLimitDate = new Date(now);
        if (timeRange === "Last 7 Days") {
          pastLimitDate.setDate(now.getDate() - 7);
        } else if (timeRange === "Last 30 Days") {
          pastLimitDate.setDate(now.getDate() - 30);
        }
        pastLimitDate.setHours(0, 0, 0, 0);

        const bidsGroupedByDate: Record<string, number> = {};
        
        auctionList.forEach((item: any) => {
          const targetTime = item.biddingStartTime || item.createdAt;
          if (!targetTime) return;

          const itemTime = new Date(targetTime).getTime();
          if (itemTime >= pastLimitDate.getTime() && itemTime <= now.getTime()) {
            const dateStr = new Date(targetTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
            const bidsCount = item.bidsCount || item.myBidsCount || item.calculatedBids || 0; 
            bidsGroupedByDate[dateStr] = (bidsGroupedByDate[dateStr] || 0) + bidsCount;
          }
        });

        const formattedBidsData = Object.keys(bidsGroupedByDate).map(date => ({
          date: date,
          bids: bidsGroupedByDate[date]
        }));

        formattedBidsData.sort((a, b) => {
          const [dayA, monthA] = a.date.split('/').map(Number);
          const [dayB, monthB] = b.date.split('/').map(Number);
          return monthA === monthB ? dayA - dayB : monthA - monthB;
        });

        setBidsData(formattedBidsData);
      })
      .catch(console.error);
  }, [timeRange]);

  const resultsData = [
    { name: 'Seller', value: userStats.sellers },
    { name: 'Bidder', value: userStats.bidders },
  ];

  return (
    <div className="flex flex-col gap-12 ml-[-4px]">
      
      <div className="">
        <h3 className="text-lg font-[900] text-red-600 mb-6">User Chart</h3>
        <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resultsData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {resultsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4 md:pl-10 w-full">
             <div className="text-[14px] font-medium text-gray-700 space-y-1">
                <p>Total number of sellers: <span className="font-black text-gray-900">{userStats.sellers}</span></p>
                <p>Total number of bidders: <span className="font-black text-gray-900">{userStats.bidders}</span></p>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <h3 className="text-lg font-[900] text-red-600 mb-6">Category Chart</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={true} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 700}} 
              />
              <YAxis tickLine={false} label={{ value: 'Quantity', angle: -90, position: 'insideLeft', fontWeight: 700 }} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="quantity" fill="#FB923C" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-[900] text-red-600">Bid Chart</h3>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm font-bold border rounded-full px-4 py-2 bg-gray-50 outline-none cursor-pointer"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bidsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                axisLine={true} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 700}} 
              />
              <YAxis tickLine={false} label={{ value: 'Bids', angle: -90, position: 'insideLeft', fontWeight: 700 }} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="bids" fill="#2DFFB2" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};