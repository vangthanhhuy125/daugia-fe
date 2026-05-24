import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface BuyNowPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionDetail: any;
  remainingSeconds: number;
  paymentUrl: string | null;
}

export const BuyNowPaymentModal: React.FC<BuyNowPaymentModalProps> = ({
  isOpen,
  onClose,
  auctionDetail,
  remainingSeconds,
  paymentUrl
}) => {
  const [secondsLeft, setSecondsLeft] = useState(remainingSeconds);

  useEffect(() => {
    if (!isOpen) return;
    
    setSecondsLeft(remainingSeconds);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, remainingSeconds]);

  if (!isOpen) return null;

  const imagesList = auctionDetail?.images || [];
  const mainImage = imagesList[0]?.imageUrl || "/placeholder.png";

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, "0")}`;
  const isExpired = secondsLeft <= 0;

  const handlePay = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 animate-fade-in ${jost.className}`}>
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[#CC2424] text-2xl md:text-3xl font-bold mb-6 text-center tracking-wide">
          Complete Your Purchase
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image & Basic Info */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-[24px] overflow-hidden border border-gray-100 bg-gray-50">
              <Image src={mainImage} alt="Product" fill className="object-contain p-2" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{auctionDetail?.productName}</h3>
          </div>

          {/* Right Column: Details & Payment */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-bold text-gray-500">Property Code:</span>
                <span className="font-bold text-gray-900">{auctionDetail?.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-bold text-gray-500">Seller:</span>
                <span className="font-bold text-gray-900">{auctionDetail?.sellerName || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-500">Total Amount:</span>
                <span className="font-bold text-[#CE2029] text-lg">
                  {auctionDetail?.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A"}
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              {isExpired ? (
                <p className="text-red-600 font-bold text-lg">Reservation expired</p>
              ) : (
                <p className={`font-bold text-lg ${secondsLeft < 60 ? "text-red-600" : "text-[#FF6600]"}`}>
                  Reserve expires in {timeString}
                </p>
              )}
            </div>

            <button 
              onClick={handlePay}
              disabled={isExpired || !paymentUrl}
              className="w-full h-14 bg-[#0000FF] hover:bg-[#0000cc] text-white font-bold text-lg rounded-[32px] shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Pay with VNPay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
