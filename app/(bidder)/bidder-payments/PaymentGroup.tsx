"use client";

import React from "react";
import Image from "next/image";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { paymentService } from "@/services/paymentService";

interface PaymentItem {
  id: string;
  title: string;
  amount: string;
  image: string;
}

interface PaymentGroupProps {
  date: string;
  items: PaymentItem[];
  status: "Pending" | "Paid";
  onPay?: (data: { date: string; items: PaymentItem[] }) => void; 
}

export const PaymentGroup = ({ date, items, status, onPay }: PaymentGroupProps) => {
  const handlePayment = async () => {
    try {
      if (items.length > 0) {
        const res = await paymentService.createPayment(items[0].id);
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (onPay) {
      onPay({ date, items });
    }
  };

  return (
    <div className="relative bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm transition-all hover:shadow-md">
      <div className="absolute top-5 right-6">
        {status === "Pending" ? (
          <button 
            onClick={handlePayment}
            className="hover:scale-110 transition-transform active:opacity-70"
          >
            <CreditCard className="text-yellow-500 opacity-60" size={24} />
          </button>
        ) : (
          <CheckCircle2 className="text-green-500 opacity-60" size={24} />
        )}
      </div>

      <h3 className="text-sm font-[900] italic text-gray-800 mb-4">{date}</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-t border-gray-50 first:border-none"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-9 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <h4 className="font-bold text-gray-900 text-xs">{item.title}</h4>
            </div>
            <span className="font-[900] text-gray-800 text-sm">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};