"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { paymentService } from "@/services/paymentService";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const PaymentModal = ({ isOpen, onClose, data }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !data) return null;

  const totalAmount = data.items.reduce((sum: number, item: any) => {
    const numericAmount = parseInt(item.amount.replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(numericAmount) ? 0 : numericAmount);
  }, 0);

  const handleConfirm = async () => {
    if (!data?.items?.length) return;
    try {
      setIsProcessing(true);
      const res = await paymentService.createPayment(data.items[0].id);
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
          [scrollbar-width:thin]
          [scrollbar-color:theme(colors.gray.200)_transparent]"
      >
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-[900] tracking-tight">
            Payment - <span className="italic font-bold text-gray-800">Complete your purchase securely</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-900" />
          </button>
        </div>

        <div className="border border-gray-100 rounded-2xl p-4 mb-4 space-y-4">
          {data.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <span className="text-[11px] font-black text-gray-800">{item.title}</span>
              </div>
              <span className="text-[11px] font-bold text-gray-600">{item.amount}</span>
            </div>
          ))}
        </div>

        <div className="text-right mb-6">
          <p className="text-blue-700 font-[900] text-sm tracking-tight">
            Total: {totalAmount.toLocaleString()} VND
          </p>
        </div>

        <p className="text-xs font-black text-gray-900 mb-4 tracking-tight">Please select a payment method</p>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer group w-fit">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="w-4 h-4 accent-green-600" 
              />
              <span className="text-xs font-bold text-gray-800 tracking-tight">Credit / Debit Card</span>
            </label>

            {paymentMethod === "card" && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">Card Number <span className="text-red-500">(*)</span></label>
                  <input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">Cardholder Name <span className="text-red-500">(*)</span></label>
                  <input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">Nation <span className="text-red-500">(*)</span></label>
                  <select className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none appearance-none bg-white">
                    <option>Vietnam</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">Expiry Date <span className="text-red-500">(*)</span></label>
                  <input type="text" placeholder="MM/YY" className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">CVV <span className="text-red-500">(*)</span></label>
                  <input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">Phone number</label>
                  <input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-700 ml-1">Email</label>
                  <input type="email" className="w-full h-10 rounded-full border border-gray-200 px-4 outline-none" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
                className="w-4 h-4 accent-green-600" 
              />
              <span className="text-xs font-bold text-gray-800 tracking-tight">E-Wallet</span>
            </label>
            {paymentMethod === "wallet" && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-around items-center animate-in slide-in-from-top-2">
                {["MoMo", "ZaloPay", "VNPay"].map((wallet) => (
                  <label key={wallet} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="wallet-sub" className="w-4 h-4 accent-blue-600" />
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                      <Image src={`/${wallet.toLowerCase()}-logo.png`} alt={wallet} fill className="object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">{wallet}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
                className="w-4 h-4 accent-green-600" 
              />
              <span className="text-xs font-bold text-gray-800 tracking-tight">Bank</span>
            </label>
            {paymentMethod === "bank" && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex gap-6 items-center animate-in slide-in-from-top-2">
                <div className="flex-1 text-[11px] space-y-2 text-gray-800">
                  <p><span className="font-black">Bank:</span> Vietcombank</p>
                  <p><span className="font-black">Account Name:</span> SMARTAUCTION CO.</p>
                  <p><span className="font-black">Account Number:</span> 123456789</p>
                  <br />
                  <p><span className="font-black">Transfer Amount:</span> {totalAmount.toLocaleString()} VND</p>
                  <p><span className="font-black">Transfer Content:</span> SA12345 - {data.items[0]?.title}</p>
                </div>
                <div className="relative w-40 h-40 bg-white p-2 rounded-xl border border-gray-100 flex-shrink-0">
                  <Image src="/vietqr-code.png" alt="QR Code" fill className="p-2 object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pb-2">
          <button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full h-12 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100 tracking-widest disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;