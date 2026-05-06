"use client";
import React from "react";

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
        <span className={`text-[11px] font-extrabold ${textLabel}`}>
          {label}
        </span>
        <span className={`text-[22px] font-black leading-tight ${textVal}`}>
          {value}
        </span>
        {unit && (
          <span className={`text-[10px] font-extrabold ${textVal}`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};