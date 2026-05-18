"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { auctionService } from "@/services/auctionService";

const formatVND = (value: number) => {
  return `${value.toLocaleString().replace(/,/g, '.')} VND`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2.5 border border-gray-100 rounded-lg shadow-sm flex flex-col gap-1">
        <p className="font-medium text-gray-600 text-xs">{`Date: ${label}`}</p>
        <p className="font-semibold text-gray-900 text-xs">{`Revenue: ${new Intl.NumberFormat('en-US').format(payload[0].value)} VND`}</p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [dataBar, setDataBar] = useState<any[]>([]);
  const [dataPie, setDataPie] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    auctionService.getMyAuctions(0, 999)
      .then(res => {
        const auctionList = res.data?.content || [];
        const completedAuctions = auctionList.filter((item: any) => item.status === "COMPLETED");

        const revenueByDate: Record<string, number> = {};
        const revenueByCategory: Record<string, number> = {};

        completedAuctions.forEach((item: any) => {
          const amount = item.buyNowPrice || item.startingPrice || 0;
          
          if (item.biddingEndTime) {
            const dateStr = new Date(item.biddingEndTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
            revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + amount;
          }

          const catName = item.categoryName || "Others";
          revenueByCategory[catName] = (revenueByCategory[catName] || 0) + amount;
        });

        const formattedBarData = Object.keys(revenueByDate).map(date => ({
          name: date,
          revenue: revenueByDate[date]
        }));
        setDataBar(formattedBarData);

        const colors = ['#FF4D4D', '#7ED321', '#4A90E2', '#F8E71C', '#8B5CF6', '#EC4899'];
        const formattedPieData = Object.keys(revenueByCategory).map((cat, idx) => ({
          name: cat,
          value: revenueByCategory[cat],
          color: colors[idx % colors.length]
        }));
        setDataPie(formattedPieData);
      })
      .catch(console.error);
  }, [timeRange]);

  if (!isMounted) {
    return <div className="h-[350px] w-full bg-gray-50 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-[#d32f2f] font-[900] text-lg">Revenue Chart</h3>
      
      <div className="bg-white md:p-8 rounded-[24px]">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-[13px] font-bold border border-gray-200 rounded-full px-5 py-2 bg-[#f8f9fa] outline-none cursor-pointer mb-8"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={true} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 500, fill: '#6b7280'}} 
                dy={10} 
              />
              <YAxis 
                axisLine={true} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 500, fill: '#6b7280'}} 
                tickFormatter={(value) => value.toLocaleString()} 
                width={80} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="revenue" fill="#2DFFB2" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="text-[#d32f2f] font-[900] text-lg">Category Performance</h3>

      <div className="bg-white p-6 md:p-8 rounded-[24px] flex flex-col items-center">
        
        <div className="flex flex-row items-center justify-center w-full gap-2">
          
          <div style={{ width: '220px', height: '220px' }} className="flex-shrink-0 ml-[15%]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={dataPie} 
                  innerRadius={0}
                  outerRadius={100} 
                  paddingAngle={0} 
                  dataKey="value" 
                  stroke="none"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-y-4 ml-8">
            {dataPie.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 flex-shrink-0" 
                  style={{backgroundColor: item.color}}
                ></div>
                <span className="text-[15px] font-medium text-gray-700 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};