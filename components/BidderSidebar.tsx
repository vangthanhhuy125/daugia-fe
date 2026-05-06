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
    <div className="md:col-span-3 flex flex-col md:grid md:grid-cols-3 gap-0 mb-8 md:mb-0">
      <aside className="flex flex-row md:flex-col gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 border-b border-gray-100 md:border-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`block whitespace-nowrap text-lg font-black transition-colors ${
                isActive ? "text-[#0f172a]" : "text-gray-300 hover:text-[#ff0000]"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </aside>
      
      <div className="hidden md:flex justify-center md:col-span-1">
        <div className="w-[1px] bg-gray-100 h-full" />
      </div>
    </div>
  );
};