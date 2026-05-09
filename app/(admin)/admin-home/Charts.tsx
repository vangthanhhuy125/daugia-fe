"use client";

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

// --- DATA DUMMY ---
const bidsData = [
  { date: '2/3', bids: 20 },
  { date: '3/3', bids: 15 },
  { date: '4/3', bids: 35 },
  { date: '5/3', bids: 45 },
  { date: '6/3', bids: 20 },
  { date: '7/3', bids: 60 },
  { date: '8/3', bids: 10 },
];

const categoryData = [
  { name: 'Electronics', quantity: 20 },
  { name: 'Fashion', quantity: 55 },
  { name: 'Collectibles', quantity: 10 },
  { name: 'Home & Furniture', quantity: 65 },
  { name: 'Vehicles', quantity: 30 },
];

const resultsData = [
  { name: 'Seller', value: 10 },
  { name: 'Bidder', value: 30 },
];

const COLORS = ['#2DD4BF', '#F87171', '#FB923C', '#818CF8'];

export const AdminCharts = () => {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  return (
    <div className="flex flex-col gap-12 ml-[-4px]">
      
      {/* 1. Uer Chart (Auction Results Style) */}
      <div className="">
        <h3 className="text-lg font-[900] text-red-600 mb-6">Uer Chart</h3>
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
                <p>Total number of sellers: <span className="font-black text-gray-900">10</span></p>
                <p>Total number of bidders: <span className="font-black text-gray-900">30</span></p>
             </div>
             <div className="space-y-1">
                <p className="font-black text-gray-900 text-[14px]">Number of visits:</p>
                <p className="text-xs font-bold text-gray-500">- Last month: 300 visits</p>
                <p className="text-xs font-bold text-gray-500">- This month: 150 visits</p>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Category Chart (Bids Chart Style) */}
      <div className="pt-8 border-t border-gray-100">
        <h3 className="text-lg font-[900] text-red-600 mb-6">Category Chart</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis 
                dataKey="name" 
                axisLine={true} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 700}} 
              />
              <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft', fontWeight: 700 }} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="quantity" fill="#FB923C" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Bid Chart (Bids Chart Style with Select) */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-[900] text-red-600">Bid Chart</h3>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm font-bold border rounded-full px-4 py-2 bg-gray-50 outline-none"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bidsData}>
              <XAxis 
                dataKey="date" 
                axisLine={true} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 700}} 
              />
              <YAxis label={{ value: 'Bids', angle: -90, position: 'insideLeft', fontWeight: 700 }} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="bids" fill="#2DFFB2" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};