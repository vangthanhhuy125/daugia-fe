"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { userService } from "@/services/userService";

export const Sidebar = () => {
  const pathname = usePathname();
  const { role } = useAuth(); 
  const currentRole = role || "bidder"; 
  const [profileRole, setProfileRole] = useState<string | null>(null);

  useEffect(() => {
    userService.getMe()
      .then(res => {
        if (res.data?.role?.name) {
          setProfileRole(res.data.role.name.toLowerCase());
        }
      })
      .catch(console.error);
  }, []);

  const resolvedRole = profileRole || currentRole;

  const bidderMenu = [
    { name: "Profile", href: "/bidder-profile" },
    { name: "Auctions", href: "/bidder-auctions" },
    { name: "Payments", href: "/bidder-payments" },
    { name: "Statistics", href: "/bidder-statistics" },
  ];

  const sellerMenu = [
    { name: "Profile", href: "/seller-profile" },
    { name: "Auctions", href: "/seller-auctions" },
    { name: "Statistics", href: "/seller-statistics" },
  ];

  const adminMenu = [
    { name: "Home", href: "/admin-home" },
    { name: "Auction", href: "/admin-auctions" },
    { name: "Categories", href: "/admin-categories" },
    { name: "Feedback", href: "/admin-feedback" },
    { name: "Permissions", href: "/admin-permissions" },
  ];

  const getMenuItems = () => {
    switch (resolvedRole) {
      case "admin":
        return adminMenu;
      case "seller":
        return sellerMenu;
      default:
        return bidderMenu;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="md:col-span-3 flex flex-col md:grid md:grid-cols-3 gap-0 mb-8 md:mb-0">
      <aside className="flex flex-row md:flex-col gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 border-b border-gray-100 md:border-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`block whitespace-nowrap text-lg font-black transition-all relative ${
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