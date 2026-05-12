"use client";

import React from "react";
import Image from "next/image";

export interface AdminAuctionCardProps {
  id: number;
  title: string;
  image: string;
  status: "Upcoming" | "Live" | "Ended";
  openDate?: string;
  endDate?: string;
  endedDate?: string;
  onDetailsClick: (id: number) => void;
}

const AdminAuctionCard = ({
  id,
  title,
  image,
  status,
  openDate,
  endDate,
  endedDate,
  onDetailsClick,
}: AdminAuctionCardProps) => {
  const isLive = status === "Live";

  // ĐỒNG BỘ MÀU STATUS Y CHANG SELLER
  const statusColor = 
    status === "Upcoming" ? "text-amber-500" : // Màu vàng cam đặc trưng
    status === "Live" ? "text-blue-600" :      // Màu xanh dương cho Live
    "text-red-600";                           // Màu đỏ cho Ended

  return (
    <div className="relative flex flex-col border border-gray-200 rounded-[32px] p-6 bg-white transition-shadow hover:shadow-lg h-full">
      
      {/* Hiệu ứng chớp nháy (Ping) - Giữ lại vì nó quá đẹp và giống Seller */}
      {isLive && (
        <div className="absolute top-6 right-6 flex h-2.5 w-2.5 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
        </div>
      )}

      {/* Box hình ảnh chuẩn Figma */}
      <div className="relative w-full h-40 mb-6 bg-white rounded-xl overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-300" 
        />
      </div>

      <div className="flex flex-col flex-1 text-left">
        {/* Tên sản phẩm */}
        <h3 className="font-bold text-[17px] leading-tight mb-4 text-black min-h-[44px] line-clamp-2">
          {title}
        </h3>
        
        {/* Trạng thái - Đã đồng bộ màu */}
        <p className="text-sm mb-2 text-gray-800">
          Status: <span className={`font-bold ${statusColor}`}>{status}</span>
        </p>

        {/* Thời gian hiển thị chuẩn Figma */}
        <div className="text-sm text-gray-800 mb-6 space-y-1.5">
          {status === 'Upcoming' && <p>Open: {openDate}</p>}
          {status === 'Live' && (
            <>
              <p>Open: {openDate}</p>
              <p>End: {endDate}</p>
            </>
          )}
          {status === 'Ended' && <p>Ended: {endedDate}</p>}
        </div>

        {/* Nút Details chuẩn Figma & Seller (Đã ép màu đỏ đô) */}
        <button 
          onClick={() => onDetailsClick(id)}
          className="mt-auto w-fit py-2.5 px-8 text-white text-sm font-bold rounded-lg hover:opacity-80 transition-all active:scale-95"
          style={{ backgroundColor: '#cc2229' }}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default AdminAuctionCard;