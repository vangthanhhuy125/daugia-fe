"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { paymentService } from "@/services/paymentService";
import { auctionService } from "@/services/auctionService";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    amount: string;
    image: string;
  } | null;
}

const PaymentModal = ({ isOpen, onClose, data }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [auctionDetail, setAuctionDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    if (!isOpen || !data?.id) {
      setAuctionDetail(null);
      setDetailError("");
      return;
    }

    const fetchDetail = async () => {
      try {
        setIsLoadingDetail(true);
        setDetailError("");
        const res = await auctionService.getByIdPublic(data.id);
        setAuctionDetail(res.data);
      } catch {
        setDetailError("Failed to load auction details.");
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [isOpen, data?.id]);

  if (!isOpen || !data) return null;

  const totalAmount = Number(data.amount.replace(/[^0-9]/g, "")) || 0;

  const handleConfirm = async () => {
    if (!data?.id) return;
    try {
      setIsProcessing(true);
      setPaymentError("");
      const res = await paymentService.createPayment(data.id);
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
        return;
      }
      setPaymentError("Payment URL not available. Please try again.");
    } catch (error) {
      setPaymentError("Failed to create payment. Please try again.");
    }
    setIsProcessing(false);
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
          <h2 className="text-xl font-[900] tracking-tight">Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-900" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
              <Image src={auctionDetail?.images?.[0]?.imageUrl || data.image} alt={data.title} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100">
                <Image src={auctionDetail?.images?.[1]?.imageUrl || data.image} alt="Sub 1" fill className="object-cover" />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100">
                <Image src={auctionDetail?.images?.[2]?.imageUrl || data.image} alt="Sub 2" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-gray-900">{auctionDetail?.productName || data.title}</h3>

            {isLoadingDetail && <div className="text-sm font-bold text-gray-500">Loading details...</div>}
            {detailError && <div className="text-sm font-bold text-red-600">{detailError}</div>}

            {auctionDetail && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold text-[#d32f2f] whitespace-nowrap text-[15px]">Description:</span>
                  <span className="text-right text-gray-900">
                    {auctionDetail?.description || ""}
                  </span>
                </div>
              <div className="flex items-center justify-between">
                <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Amount:</span>
                <span className="font-bold text-sm text-[#CE2029]">{data.amount}</span>
              </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Starting price:</span>
                  <span className="text-gray-900">{auctionDetail.startingPrice?.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Current price:</span>
                  <span className="text-gray-900">{auctionDetail.currentPrice?.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Bid increment:</span>
                  <span className="text-gray-900">{auctionDetail.bidIncrement?.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Buy now price:</span>
                  <span className="text-gray-900">
                    {auctionDetail.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Status:</span>
                  <span className="text-gray-900">{auctionDetail.status}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Category:</span>
                  <span className="text-gray-900">{auctionDetail.categoryName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Bidding start:</span>
                  <span className="text-gray-900">
                    {auctionDetail.biddingStartTime ? new Date(auctionDetail.biddingStartTime).toLocaleString("en-GB") : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#CE2029] font-bold text-sm whitespace-nowrap">Bidding end:</span>
                  <span className="text-gray-900">
                    {auctionDetail.biddingEndTime ? new Date(auctionDetail.biddingEndTime).toLocaleString("en-GB") : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-right mb-6">
          <p className="text-blue-700 font-[900] text-sm tracking-tight">
            Total: {totalAmount.toLocaleString()} VND
          </p>
        </div>

        {paymentError && (
          <div className="mt-4 text-sm font-bold text-red-600">{paymentError}</div>
        )}

        <div className="mt-10 pb-2">
          <button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full h-12 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100 tracking-widest disabled:opacity-50"
          >
            {isProcessing ? "Redirecting..." : "Pay with VNPay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;