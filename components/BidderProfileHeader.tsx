"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, MessageSquare, Edit3 } from "lucide-react";

interface BidderProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl: string;
  bannerUrl: string;
  onFeedbackClick: () => void;
  onEditClick: () => void;
}

export const BidderProfileHeader = ({
  name,
  role,
  avatarUrl,
  bannerUrl,
  onFeedbackClick,
  onEditClick,
}: BidderProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraButtonClick = () => fileInputRef.current?.click();

  return (
    <div className="bg-white rounded-[40px] shadow-[0_10px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      {/* Banner */}
      <div className="relative w-full h-48 md:h-64">
        <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
      </div>

      {/* Info Section */}
      <div className="relative px-6 md:px-12 pb-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 md:-mt-24">
          <div className="relative">
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-[6px] border-white overflow-hidden bg-orange-400 shadow-2xl">
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={handleCameraButtonClick}
              className="absolute bottom-4 right-2 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-all border border-gray-100 z-10"
            >
              <Camera size={18} className="text-gray-900" />
            </button>
          </div>

          <div className="flex-grow text-center md:text-left pb-2">
            <h2 className="text-2xl md:text-4xl font-[900] text-[#0f172a] tracking-tight">
              {name}
            </h2>
            <p className="text-xl font-[900] italic text-[#0f172a] mt-1">
              {role}
            </p>
          </div>

          <div className="flex gap-3 pb-2">
            <button
              onClick={onFeedbackClick}
              className="flex items-center gap-2 bg-[#ff0000] text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-[0_8px_20px_-6px_rgba(255,0,0,0.4)]"
            >
              <MessageSquare size={18} fill="white" /> Feedback
            </button>
            <button 
              onClick={onEditClick}
              className="flex items-center gap-2 bg-[#e2e8f0] text-[#0f172a] px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-300 transition-all"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};