"use client";

import React, { useState } from "react";
import { X, Trash2, ImagePlus, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAuctionModal = ({ isOpen, onClose }: CreateAuctionModalProps) => {
  // Mock mảng hình ảnh (Sau này thay bằng state file upload thật)
  const [images, setImages] = useState([
    "/banner.jpg", // Ảnh chính giả lập
    "/nen.jpg",    // Ảnh phụ giả lập
  ]);

  if (!isOpen) return null;

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200`}>
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden scale-in-center animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-4">
          <h2 className="text-3xl font-[900] text-gray-900 tracking-tight">Create New Auction</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={32} className="text-gray-900" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-grow overflow-y-auto p-8 pt-4 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* CỘT TRÁI: QUẢN LÝ HÌNH ẢNH */}
            <div className="space-y-4">
              {/* Ảnh chính */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-[24px] overflow-hidden border border-gray-200 group">
                {images[0] ? (
                  <>
                    <Image src={images[0]} alt="Main product" fill className="object-cover" />
                    <button className="absolute top-4 right-4 p-2.5 bg-white text-black rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImagePlus size={48} strokeWidth={1.5} className="mb-2" />
                    <span className="font-bold">Add Main Image</span>
                  </div>
                )}
              </div>

              {/* Danh sách ảnh phụ */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="relative w-28 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group">
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                    <button className="absolute top-2 right-2 p-1.5 bg-white text-black rounded-full shadow hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                
                {/* Nút thêm ảnh */}
                <button className="w-28 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors">
                  <ImagePlus size={28} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* CỘT PHẢI: FORM NHẬP LIỆU */}
            <div className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[15px] font-[900] text-gray-900">Product name:</label>
                <input 
                  type="text" 
                  defaultValue="ASUS ROG Strix G16 Gaming Laptop"
                  className="w-full h-14 border border-gray-400 rounded-2xl px-5 outline-none focus:border-blue-600 font-bold text-gray-900 text-lg transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-[900] text-gray-900">Description:</label>
                <textarea 
                  rows={4}
                  defaultValue="High-performance gaming laptop equipped with Intel Core i7 processor, NVIDIA RTX 4060 GPU, 16GB RAM, and 1TB SSD. Ideal for gaming, streaming, and high-end graphics work."
                  className="w-full border border-gray-400 rounded-2xl p-5 outline-none focus:border-blue-600 font-medium text-gray-800 resize-none transition-colors leading-relaxed"
                />
              </div>

              {/* Group Price */}
              <div className="space-y-1.5">
                <label className="text-[15px] font-[900] text-gray-900">Starting price:</label>
                <div className="relative">
                  <input type="text" defaultValue="19,000,000" className="w-full h-14 border border-gray-400 rounded-2xl pl-5 pr-16 outline-none focus:border-blue-600 font-medium text-gray-900 transition-colors" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-medium text-gray-900">VND</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-[900] text-gray-900">Bid increment:</label>
                <div className="relative">
                  <input type="text" defaultValue="200,000" className="w-full h-14 border border-gray-400 rounded-2xl pl-5 pr-16 outline-none focus:border-blue-600 font-medium text-gray-900 transition-colors" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-medium text-gray-900">VND</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-[900] text-gray-900">Buy now price:</label>
                <div className="relative">
                  <input type="text" defaultValue="27,000,000" className="w-full h-14 border border-gray-400 rounded-2xl pl-5 pr-16 outline-none focus:border-blue-600 font-medium text-gray-900 transition-colors" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-medium text-gray-900">VND</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-[900] text-gray-900">Category:</label>
                <div className="relative">
                  <select className="w-full h-14 border border-gray-400 rounded-2xl px-5 outline-none focus:border-blue-600 font-medium text-gray-900 appearance-none transition-colors cursor-pointer">
                    <option>Electronics</option>
                    <option>Property</option>
                    <option>Vehicles</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" strokeWidth={3} size={20} />
                </div>
              </div>

              {/* Time Pickers */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[15px] font-[900] text-gray-900">Bidding start time:</label>
                <div className="flex flex-wrap sm:flex-nowrap gap-4">
                  <div className="w-full sm:w-1/2">
                    <span className="text-sm font-medium text-gray-700 block mb-1">Start Date</span>
                    <div className="relative">
                      <input type="text" placeholder="dd/mm/yyyy" className="w-full h-12 border border-gray-300 rounded-full px-4 outline-none focus:border-blue-600 font-medium text-gray-700 transition-colors" />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="text-sm font-medium text-gray-700 block mb-1">Start Time</span>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full">
                        <select className="w-full h-12 border border-gray-300 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium appearance-none transition-colors cursor-pointer">
                          <option>08</option><option>09</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">Hour</span>
                      <div className="relative w-full">
                        <select className="w-full h-12 border border-gray-300 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium appearance-none transition-colors cursor-pointer">
                          <option>00</option><option>30</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">Minute</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[15px] font-[900] text-gray-900">Bidding end time:</label>
                <div className="flex flex-wrap sm:flex-nowrap gap-4">
                  <div className="w-full sm:w-1/2">
                    <span className="text-sm font-medium text-gray-700 block mb-1">End Date</span>
                    <div className="relative">
                      <input type="text" placeholder="dd/mm/yyyy" className="w-full h-12 border border-gray-300 rounded-full px-4 outline-none focus:border-blue-600 font-medium text-gray-700 transition-colors" />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="text-sm font-medium text-gray-700 block mb-1">End Time</span>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full">
                        <select className="w-full h-12 border border-gray-300 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium appearance-none transition-colors cursor-pointer">
                          <option>20</option><option>21</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">Hour</span>
                      <div className="relative w-full">
                        <select className="w-full h-12 border border-gray-300 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium appearance-none transition-colors cursor-pointer">
                          <option>00</option><option>30</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">Minute</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 pb-4">
                <button className="bg-blue-600 text-white font-[900] px-16 py-4 rounded-full text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all">
                  Create
                </button>
              </div>

            </div>
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
          }
        `}</style>
      </div>
    </div>
  );
};