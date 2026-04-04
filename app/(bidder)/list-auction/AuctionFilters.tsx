"use client";

import { Search, RotateCcw, Calendar, ChevronDown } from "lucide-react";
import { Jost } from 'next/font/google';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const jost = Jost({ subsets: ['latin'], weight: ['400', '500', '600', '700', '900'] });

export const AuctionFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className={`${jost.className} w-full mb-12 select-none`}>
      <div className="flex items-center gap-2">
        <h3 className="text-[#CE2029] font-bold text-xl">Search</h3>
        <button 
          onClick={handleReset}
          className="p-1 hover:rotate-180 transition-transform duration-500 text-gray-400 hover:text-[#CE2029]"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-8">
        <div className="flex-grow min-w-[280px]">
          <div className="relative group">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword..." 
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-12 outline-none font-medium text-gray-700 focus:border-[#CE2029] transition-all" 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CE2029]" size={18} />
          </div>
        </div>

        <div className="w-full md:w-64">
          <div className="relative group">
            <select className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-700 appearance-none cursor-pointer focus:border-[#CE2029] transition-all">
              <option>All category</option>
              <option>Electronics</option>
              <option>Property</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5">
          <label className="text-xs font-bold text-gray-400 ml-2">From date:</label>
          <div className="relative custom-datepicker">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              placeholderText="dd/mm/yyyy"
              dateFormat="dd/MM/yyyy"
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-600 focus:border-[#CE2029] transition-all"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5">
          <label className="text-xs font-bold text-gray-400 ml-2">To date:</label>
          <div className="relative custom-datepicker">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              placeholderText="dd/mm/yyyy"
              dateFormat="dd/MM/yyyy"
              minDate={startDate || undefined}
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-600 focus:border-[#CE2029] transition-all"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 py-4 px-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl w-full md:w-max">
        <span className="text-[#CE2029] font-bold text-xm">Status</span>
        <div className="flex gap-6">
          {['Upcoming', 'Live', 'Ended'].map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#CE2029] checked:border-[#CE2029] transition-all cursor-pointer"
                />
                <svg
                  className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

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
          background-color: #CE2029 !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};