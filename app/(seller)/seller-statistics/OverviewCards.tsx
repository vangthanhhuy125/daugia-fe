"use client";
import React from "react";
import { Package, PlayCircle, ShoppingCart, DollarSign } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
  unit?: string;
}

const borderToTextMap: Record<string, string> = {
  "border-yellow-400": "text-yellow-400",
  "border-green-500": "text-green-500",
  "border-green-400": "text-green-400",
  "border-orange-400": "text-orange-400",
  "border-blue-600": "text-blue-600",
};

export const StatCard = ({
  label,
  value,
  icon,
  borderColor,
  unit,
}: StatCardProps) => {
  const textLabel = borderToTextMap[borderColor] ?? "text-gray-900";

  return (
    <div
      className={`
        flex items-center gap-3
        border-[2.5px] ${borderColor} bg-white
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
          {value}
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
  return (
    <div className="space-y-4">
      <h3 className="text-[#d32f2f] font-[900] text-lg">Overview Cards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Products Listed"
          value="24"
          icon={<Package size={30} strokeWidth={2.5} />}
          borderColor="border-yellow-400"
        />
        <StatCard
          label="Active Auctions"
          value="5"
          icon={<PlayCircle size={30} strokeWidth={2.5} />}
          borderColor="border-green-500"
        />
        <StatCard
          label="Sold Items"
          value="12"
          icon={<ShoppingCart size={30} strokeWidth={2.5} />}
          borderColor="border-orange-400"
        />
        <StatCard
          label="Total Revenue"
          value="12,000,000"
          unit="VND"
          icon={<DollarSign size={30} strokeWidth={2.5} />}
          borderColor="border-blue-600"
        />
      </div>
    </div>
  );
};