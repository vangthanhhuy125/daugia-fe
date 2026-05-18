"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Trash2, ImagePlus, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Jost } from "next/font/google";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import { auctionService } from "@/services/auctionService";
import { categoryService } from "@/services/categoryService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAuctionModal = ({ isOpen, onClose }: CreateAuctionModalProps) => {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [thumbFiles, setThumbFiles] = useState<File[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMin, setStartMin] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMin, setEndMin] = useState("");

  const mainInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      categoryService.getAll(0, 100)
        .then(res => setCategories(res.data?.content || []))
        .catch(console.error);
    }
  }, [isOpen]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainFile(e.target.files[0]);
      setMainImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleThumbImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setThumbFiles(prev => [...prev, ...filesArray]);
      const urlsArray = filesArray.map(file => URL.createObjectURL(file));
      setThumbnails(prev => [...prev, ...urlsArray]);
    }
  };

  const handleCreate = async () => {
    try {
      if (!startDate || !endDate || !startHour || !startMin || !endHour || !endMin) return;

      const fullStartDate = new Date(startDate);
      fullStartDate.setHours(parseInt(startHour), parseInt(startMin), 0, 0);

      const fullEndDate = new Date(endDate);
      fullEndDate.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

      const requestData = {
        productName,
        description,
        startingPrice: Number(startingPrice),
        bidIncrement: Number(bidIncrement),
        buyNowPrice: buyNowPrice ? Number(buyNowPrice) : undefined,
        categoryId: Number(selectedCategoryId),
        biddingStartTime: fullStartDate.toISOString(),
        biddingEndTime: fullEndDate.toISOString()
      };

      const allFiles: File[] = [];
      if (mainFile) allFiles.push(mainFile);
      if (thumbFiles.length > 0) allFiles.push(...thumbFiles);

      await auctionService.createAuction(requestData, allFiles);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200`}>
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden scale-in-center animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center px-8 py-6 bg-white z-10">
          <h2 className="text-[28px] font-[900] text-gray-900 tracking-tight">Create New Auction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={32} className="text-gray-900" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 pt-2 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={mainInputRef} 
                onChange={handleMainImageChange} 
              />
              
              <div 
                onClick={() => !mainImage && mainInputRef.current?.click()}
                className="relative w-full aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group"
              >
                {mainImage ? (
                  <>
                    <Image src={mainImage} alt="Main product" fill className="object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMainImage(null); setMainFile(null); }}
                      className="absolute top-4 right-4 p-2 bg-white text-black rounded-full shadow hover:bg-red-50 hover:text-red-600 transition-colors z-10"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-gray-500">
                    <ImagePlus size={40} strokeWidth={1.5} className="mb-2" />
                    <span className="text-sm font-bold">Add main image</span>
                  </div>
                )}
              </div>

              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                ref={thumbInputRef} 
                onChange={handleThumbImageChange} 
              />

              <div className="flex gap-4 overflow-x-auto pb-2">
                {thumbnails.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 group"
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${idx}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                      onClick={() => {
                        setThumbnails((prev) => prev.filter((_, i) => i !== idx));
                        setThumbFiles((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur text-black rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors z-10"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => thumbInputRef.current?.click()}
                  className="w-32 h-24 flex-shrink-0 rounded-3xl border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-400 hover:text-gray-500 transition-colors bg-gray-50"
                >
                  <ImagePlus size={30} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Product name:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full h-14 border border-gray-400 rounded-2xl px-5 outline-none focus:border-blue-600 font-bold text-gray-900 text-lg transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Description:</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-400 rounded-2xl p-5 outline-none focus:border-blue-600 font-medium text-gray-800 resize-none transition-colors leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">
                    Starting price:
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-16 outline-none focus:border-blue-600 font-medium text-gray-900 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">
                      VND
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">
                    Bid increment:
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={bidIncrement}
                      onChange={(e) => setBidIncrement(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-16 outline-none focus:border-blue-600 font-medium text-gray-900 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">
                      VND
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">
                    Buy now price:
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={buyNowPrice}
                      onChange={(e) => setBuyNowPrice(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-16 outline-none focus:border-blue-600 font-medium text-gray-900 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">
                      VND
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">
                    Category:
                  </label>

                  <div className="relative">
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-10 outline-none focus:border-blue-600 font-medium text-gray-900 appearance-none cursor-pointer transition-colors bg-white"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5 custom-datepicker">
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Bidding start time:</label>
                  <span className="text-sm font-medium text-gray-700 block mb-1">Start Date</span>
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      className="w-full h-12 bg-white border border-gray-400 rounded-full pl-4 pr-10 outline-none font-medium text-gray-700 focus:border-blue-600 transition-colors cursor-pointer"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5 opacity-0 hidden sm:block">Spacer</label>
                  <span className="text-sm font-medium text-gray-700 block mb-1">Start Time</span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select value={startHour} onChange={(e) => setStartHour(e.target.value)} className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium text-gray-900 appearance-none cursor-pointer transition-colors bg-white">
                        <option value="" disabled>--</option>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>{i.toString().padStart(2, "0")}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Hour</span>
                    <div className="relative flex-1">
                      <select value={startMin} onChange={(e) => setStartMin(e.target.value)} className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium text-gray-900 appearance-none cursor-pointer transition-colors bg-white">
                        <option value="" disabled>--</option>
                        {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>{i.toString().padStart(2, "0")}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Minute</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 custom-datepicker">
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Bidding end time:</label>
                  <span className="text-sm font-medium text-gray-700 block mb-1">End Date</span>
                  <div className="relative">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      minDate={startDate || undefined}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      className="w-full h-12 bg-white border border-gray-400 rounded-full pl-4 pr-10 outline-none font-medium text-gray-700 focus:border-blue-600 transition-colors cursor-pointer"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5 opacity-0 hidden sm:block">Spacer</label>
                  <span className="text-sm font-medium text-gray-700 block mb-1">End Time</span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select value={endHour} onChange={(e) => setEndHour(e.target.value)} className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium text-gray-900 appearance-none cursor-pointer transition-colors bg-white">
                        <option value="" disabled>--</option>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>{i.toString().padStart(2, "0")}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Hour</span>
                    <div className="relative flex-1">
                      <select value={endMin} onChange={(e) => setEndMin(e.target.value)} className="w-full h-12 border border-gray-400 rounded-full pl-4 pr-8 outline-none focus:border-blue-600 font-medium text-gray-900 appearance-none cursor-pointer transition-colors bg-white">
                        <option value="" disabled>--</option>
                        {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>{i.toString().padStart(2, "0")}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Minute</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 pb-2">
                <button onClick={handleCreate} className="bg-blue-600 text-white font-[900] w-40 py-4 rounded-full text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all">
                  Create
                </button>
              </div>

            </div>

          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            margin: 10px 0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
            border: 2px solid white;
          }
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
            background-color: #2563eb !important;
            border-radius: 8px;
          }
        `}</style>

      </div>
    </div>
  );
};