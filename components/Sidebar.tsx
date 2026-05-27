"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { userService } from "@/services/userService";
import { backupApi } from "@/services/backupApi";
import { Database } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { role } = useAuth(); 
  const currentRole = role || "bidder"; 
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [backupFailed, setBackupFailed] = useState(false);

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

  useEffect(() => {
    if (resolvedRole !== "admin") return;
    backupApi.getStatus()
      .then(res => {
        const lastStatus = res.data?.lastFullBackup?.status;
        setBackupFailed(lastStatus === "FAILED");
      })
      .catch(() => setBackupFailed(false));
  }, [resolvedRole]);

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
    { name: "Backups", href: "/admin/backups", alert: backupFailed },
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
          const Icon = (item as any).icon as React.ComponentType<any> | undefined;
          const showAlert = (item as any).alert as boolean | undefined;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-2 whitespace-nowrap text-lg font-black transition-all relative ${
                isActive ? "text-[#0f172a]" : "text-gray-300 hover:text-[#ff0000]"
              }`}
            >
              {Icon && <Icon size={16} strokeWidth={2.5} className="text-current" />}
              <span>{item.name}</span>
              {showAlert && <span className="ml-2 h-2 w-2 rounded-full bg-red-500" />}
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