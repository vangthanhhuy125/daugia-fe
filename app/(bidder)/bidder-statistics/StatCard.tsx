"use client";

import React, { useState, useEffect } from "react";
import { Package, PlayCircle, ShoppingCart, DollarSign } from "lucide-react";
import { auctionService } from "@/services/auctionService";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
  labelColor: string;
  unit?: string;
  filled?: boolean;
  filledBg?: string;
}

const borderToTextMap: Record<string, string> = {
  "border-yellow-400": "text-yellow-400",
  "border-green-500":  "text-green-500",
  "border-green-400":  "text-green-400",
  "border-orange-400": "text-orange-400",
  "border-blue-600":   "text-blue-600",
};

export const StatCard = ({
  label,
  value,
  icon,
  borderColor,
  unit,
  filled,
  filledBg,
}: StatCardProps) => {
  const bg = filled && filledBg ? filledBg : "bg-white";
  const textVal = filled ? "text-white" : "text-gray-900";
  const textLabel = filled ? "text-white" : (borderToTextMap[borderColor] ?? "text-gray-900");

  return (
    <div
      className={`
        flex items-center gap-3
        border-[2.5px] ${borderColor} ${bg}
        rounded-2xl px-[18px] py-[14px]
      `}
    >
      <div className={`text-[30px] leading-none flex-shrink-0 ${textLabel}`}>
        {icon}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={`text-[15px] font-extrabold ${textLabel}`}>
          {label}
        </span>
        <span className={`text-[22px] font-black leading-tight text-gray-900`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className={`text-[10px] font-extrabold text-gray-900`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export const OverviewCards = () => {
  const [stats, setStats] = useState({
    productsListed: 0,
    activeAuctions: 0,
    soldItems: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    auctionService.getMyAuctions(0, 999)
      .then(res => {
        const auctionList = res.data?.content || [];
        const productsListed = auctionList.length;
        const activeAuctions = auctionList.filter((item: any) => item.status === "ACTIVE").length;
        const soldAuctions = auctionList.filter((item: any) => item.status === "ENDED");
        const soldItems = soldAuctions.length;
        const totalRevenue = soldAuctions.reduce((sum: number, item: any) => {
          return sum + (item.winningPrice || item.currentPrice || item.startingPrice || item.buyNowPrice || 0);
        }, 0);

        setStats({
          productsListed,
          activeAuctions,
          soldItems,
          totalRevenue
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-[#d32f2f] font-[900] text-lg">Overview Cards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Products Listed"
          value={stats.productsListed}
          icon={<Package size={28} />}
          borderColor="border-yellow-400"
          labelColor="text-gray-500"
        />
        <StatCard
          label="Active Auctions"
          value={stats.activeAuctions}
          icon={<PlayCircle size={28} />}
          borderColor="border-green-500"
          labelColor="text-gray-500"
        />
        <StatCard
          label="Sold Items"
          value={stats.soldItems}
          icon={<ShoppingCart size={28} />}
          borderColor="border-orange-400"
          labelColor="text-gray-500"
        />
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue.toLocaleString()}
          unit="VND"
          icon={<DollarSign size={28} />}
          borderColor="border-blue-600"
          labelColor="text-gray-500"
        />
      </div>
    </div>
  );
};