"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Jost } from "next/font/google";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UpcomingView } from "./UpcomingView";
import { LiveView } from "./LiveView";
import { EndedView } from "./EndedView";
import { auctionService } from "@/services/auctionService";
import { userService } from "@/services/userService";
import { paymentService } from "@/services/paymentService";
import { biddingService } from "@/services/biddingService";
import { BuyNowReservationStatus } from "@/types/payment";
import { BuyNowConfirmModal } from "./BuyNowConfirmModal";
import { BuyNowPaymentModal } from "./BuyNowPaymentModal";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState<'Upcoming' | 'Live' | 'Ended'>('Live');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctionDetail, setAuctionDetail] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<BuyNowReservationStatus | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Gọi song song 2 API: Chi tiết cuộc đấu giá công khai VÀ cấu hình Auto Bid của riêng bồ
      Promise.all([
        auctionService.getByIdPublic(id),
        biddingService.getOwnAutoBid(id).catch(() => null),
        paymentService.getReservationStatus(id).catch(() => null)
      ])
        .then(([auctionRes, autoBidRes, reservationRes]) => {
          const data = auctionRes.data as any;
          
          if (data) {
            // Nếu có cấu hình Auto Bid của người dùng này trả về từ BE
            if (autoBidRes && autoBidRes.data) {
              data.active = autoBidRes.data.active;
              data.maxAmount = autoBidRes.data.maxAmount;
            } else {
              data.active = false;
              data.maxAmount = null;
            }
          }

          setAuctionDetail(data);
          let s: 'Upcoming' | 'Live' | 'Ended' = 'Upcoming';
          if (data.status === 'ACTIVE') s = 'Live';
          if (data.status === 'ENDED') s = 'Ended';
          setStatus(s);

          if (reservationRes && reservationRes.data) {
             setReservationStatus(reservationRes.data as BuyNowReservationStatus);
          }
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const infoRows = auctionDetail ? [
    { label: "Starting price:", value: `${auctionDetail.startingPrice?.toLocaleString()} VND` },
    { label: "Property code:", value: auctionDetail.id?.toString() },
    { label: "Bid increment:", value: `${auctionDetail.bidIncrement?.toLocaleString()} VND` },
    { label: "Buy now price:", value: auctionDetail.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A" },
    { label: "Status:", value: status, statusColor: status === 'Upcoming' ? 'text-yellow-500' : status === 'Live' ? 'text-blue-600' : 'text-[#CE2029]' },
    { label: "Category:", value: auctionDetail.categoryName || "N/A" },
    { label: "Bidding start time:", value: auctionDetail.biddingStartTime ? new Date(auctionDetail.biddingStartTime).toLocaleString('en-GB') : "N/A" },
    { label: "Bidding end time:", value: auctionDetail.biddingEndTime ? new Date(auctionDetail.biddingEndTime).toLocaleString('en-GB') : "N/A" },
  ] : [];

  const imagesList = auctionDetail?.images || [];
  const mainImage = imagesList[0]?.imageUrl || "/laptop-image.png";
  const subImages = imagesList.slice(1);

  const renderBuyNowButton = () => {
    if (status !== 'Live') return null;

    if (reservationStatus?.hasReservation && !reservationStatus?.isOwner) {
      return (
        <div className="w-full space-y-1">
          <button 
            disabled
            className="w-full h-14 bg-gray-400 text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 shadow-lg cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            Buy Now
          </button>
          <p className="text-sm text-[#FF6600] font-medium text-center">Another buyer is completing this purchase</p>
        </div>
      );
    }

    if (reservationStatus?.isOwner) {
      return (
        <button 
          onClick={() => {
             setPaymentUrl(reservationStatus.paymentUrl);
             setIsPaymentModalOpen(true);
          }}
          className="w-full h-14 bg-[#0000FF] hover:bg-[#0000cc] text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <ShoppingCart size={20} />
          Resume Payment
        </button>
      );
    }

    return (
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full h-14 bg-[#FF6600] text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 shadow-lg hover:bg-orange-600 transition-all"
      >
        <ShoppingCart size={20} />
        Buy Now
      </button>
    );
  };

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white`}>
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        <nav className="mb-8">
          <h1 className="text-3xl font-[900] text-gray-900 mb-1">List Auctions</h1>
          <p className="text-xs font-bold text-gray-400">
            Home {">"} List Auctions {">"} Auction Item: {auctionDetail?.productName || "Loading..."}
          </p>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="relative aspect-video rounded-[32px] overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
              <Image src={mainImage} alt="Product" fill className="object-contain p-4" priority />
            </div>

            {subImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {subImages.map((img: any, idx: number) => (
                  <div 
                    key={img.id || idx} 
                    className="relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 flex-shrink-0"
                  >
                    <Image src={img.imageUrl || "/laptop-sub1.jpg"} alt={`Sub ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-[#CE2029] font-bold text-xl mb-6">Seller Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-500">Seller:</span>
                  <span className="font-bold text-gray-900">{auctionDetail?.sellerName || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-500">Email:</span>
                  <span className="font-bold text-gray-900">{auctionDetail?.sellerEmail || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500">Products Sold:</span>
                  <span className="text-gray-700">
                    {auctionDetail?.status === "ENDED" && (auctionDetail?.winnerEmail || auctionDetail?.bidderEmailMasked) ? 1 : 0}
                  </span>
                </div>
              </div>
            </div>

            {renderBuyNowButton()}

            <BuyNowConfirmModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              productName={auctionDetail?.productName || ""}
              buyNowPrice={auctionDetail?.buyNowPrice}
              isLoading={isProcessing}
              onConfirm={async () => {
                if (!auctionDetail?.id) return;
                try {
                  setIsProcessing(true);
                  const res = await paymentService.createPayment(auctionDetail.id);
                  if (res?.data?.paymentUrl) {
                     setPaymentUrl(res.data.paymentUrl);
                     setIsModalOpen(false);
                     setIsPaymentModalOpen(true);
                     const resStatus = await paymentService.getReservationStatus(auctionDetail.id);
                     if (resStatus?.data) setReservationStatus(resStatus.data as BuyNowReservationStatus);
                  } else {
                     alert(res?.message || "Could not generate payment link.");
                  }
                } catch (error: any) {
                  const errorMsg = error?.response?.data?.message || error?.message || "An error occurred.";
                  alert(`Payment Failed: ${errorMsg}`);
                } finally {
                  setIsProcessing(false);
                }
              }}
            />

            <BuyNowPaymentModal
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              auctionDetail={auctionDetail}
              remainingSeconds={reservationStatus?.remainingSeconds || 300}
              paymentUrl={paymentUrl}
            />
          </div>

          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-4xl font-[900] text-gray-900 tracking-tight leading-tight">
              {auctionDetail?.productName || "Loading..."}
            </h2>
            
            {status === 'Upcoming' && <UpcomingView infoRows={infoRows} auctionDetail={auctionDetail} />}
            {status === 'Live' && <LiveView infoRows={infoRows} auctionDetail={auctionDetail} reservationStatus={reservationStatus} />}
            {status === 'Ended' && <EndedView infoRows={infoRows} auctionDetail={auctionDetail} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}