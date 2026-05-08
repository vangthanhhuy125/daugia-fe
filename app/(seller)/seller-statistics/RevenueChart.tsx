"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataBar = [
  { name: '2/3', revenue: 400000 }, 
  { name: '3/3', revenue: 300000 }, 
  { name: '4/3', revenue: 5000000 },
  { name: '5/3', revenue: 6000000 }, 
  { name: '6/3', revenue: 4000000 }, 
  { name: '7/3', revenue: 9000000 }, 
  { name: '8/3', revenue: 2000000 },
];

const dataPie = [
  { name: 'Electronics', value: 400, color: '#FF4D4D' },
  { name: 'Fashion', value: 300, color: '#7ED321' },
  { name: 'Collectibles', value: 300, color: '#4A90E2' },
  { name: 'Others', value: 200, color: '#F8E71C' },
];

const formatVND = (value: number) => {
  return `${value.toLocaleString().replace(/,/g, '.')} VND`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2.5 border border-gray-100 rounded-lg shadow-sm flex flex-col gap-1">
        <p className="font-medium text-gray-600 text-xs">{`Date: ${label}`}</p>
        <p className="font-semibold text-gray-900 text-xs">{`Revenue: ${formatVND(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

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