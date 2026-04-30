"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BidderSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { name: "Profile", href: "/bidder-profile" },
    { name: "Auctions", href: "/bidder-auctions" },
    { name: "Payments", href: "/bidder-payments" },
    { name: "Statistics", href: "/bidder-statistics" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:col-span-3">
      <aside className="space-y-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`block text-lg font-black transition-colors ${
                isActive ? "text-[#0f172a]" : "text-gray-300 hover:text-[#ff0000]"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </aside>
      
      {/* Vạch kẻ dọc chỉ hiện trên Desktop */}
      <div className="hidden md:flex justify-center md:col-span-1">
        <div className="w-[1px] bg-gray-100 h-full" />
      </div>
    </div>
  );
};