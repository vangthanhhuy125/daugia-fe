"use client";
import React from "react";
import { Users, Gavel, MousePointer2, Box } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
  unit?: string;
}

const borderToTextMap: Record<string, string> = {
  "border-blue-600": "text-blue-600",
  "border-yellow-500": "text-yellow-500",
  "border-green-500": "text-green-500",
  "border-purple-600": "text-purple-600",
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
    <div className="space-y-4 ml-[-4px]">
      <h3 className="text-[#d32f2f] font-[900] text-lg tracking-tight">
        Overview Cards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Users"
          value="40"
          icon={<Users size={30} strokeWidth={2.5} />}
          borderColor="border-blue-600"
        />
        <StatCard
          label="Valid Auction"
          value="20"
          icon={<Gavel size={30} strokeWidth={2.5} />}
          borderColor="border-yellow-500"
        />
        <StatCard
          label="Total Bid"
          value="125"
          icon={<MousePointer2 size={30} strokeWidth={2.5} />}
          borderColor="border-green-500"
        />
        <StatCard
          label="Category"
          value="9"
          icon={<Box size={30} strokeWidth={2.5} />}
          borderColor="border-purple-600"
        />
      </div>
    </div>
  );
};