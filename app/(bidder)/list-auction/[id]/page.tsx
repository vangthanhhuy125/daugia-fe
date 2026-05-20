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
import { paymentService } from "@/api/apiClient";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState<'Upcoming' | 'Live' | 'Ended'>('Live');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctionDetail, setAuctionDetail] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      auctionService.getByIdPublic(id)
        .then(res => {
          const data = res.data;
          setAuctionDetail(data);
          let s: 'Upcoming' | 'Live' | 'Ended' = 'Upcoming';
          if (data.status === 'ACTIVE') s = 'Live';
          if (data.status === 'ENDED') s = 'Ended';
          setStatus(s);
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
              <Image src={auctionDetail?.images?.[0]?.imageUrl || "/laptop-image.png"} alt="Product" fill className="object-contain p-4" />
            </div>

            <div className="flex gap-4">
              <div className="relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer hover:border-[#CE2029] transition-all">
                <Image src={auctionDetail?.images?.[1]?.imageUrl || "/laptop-sub1.jpg"} alt="Sub" fill className="object-cover" />
              </div>
              <div className="relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer hover:border-[#CE2029] transition-all">
                <Image src={auctionDetail?.images?.[2]?.imageUrl || "/laptop-sub2.jpg"} alt="Sub" fill className="object-cover" />
              </div>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-[#CE2029] font-bold text-xl mb-6">Seller Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-500">Seller:</span>
                  <span className="font-bold text-gray-900">{auctionDetail?.sellerName || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{auctionDetail?.sellerRating || 0}</span>
                    <Star size={18} fill="#f59e0b" className="text-amber-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500">Products Sold:</span>
                  <span className="font-bold text-gray-900">{auctionDetail?.productsSold || 0}</span>
                </div>
              </div>
            </div>

            {status === 'Live' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full h-14 bg-[#FF6600] text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 shadow-lg hover:bg-orange-600 transition-all"
              >
                <ShoppingCart size={20} />
                Buy Now
              </button>
            )}

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 animate-fade-in">
                <div className="relative w-full max-w-md bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-2xl flex flex-col items-center">
                  
                  <button 
                    onClick={() => !isProcessing && setIsModalOpen(false)}
                    disabled={isProcessing}
                    className="absolute top-4 right-5 text-gray-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-[ #CC2424] text-2xl md:text-3xl font-bold mb-4 text-center tracking-wide mt-2">
                    Confirm Purchase
                  </h2>

                  <p className="text-base text-gray-700 text-center font-normal mb-4">
                    You are about to purchase the following items:
                  </p>

                  <div className="text-base text-black text-left space-y-2 mb-6 font-normal bg-gray-50 p-4 rounded-xl w-full">
                    <p><span className="font-bold text-gray-700">Product:</span> {auctionDetail?.productName}</p>
                    <p><span className="font-bold text-gray-700">Buy Now Price:</span> {auctionDetail?.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A"}</p>
                  </div>

                  <p className="text-base text-gray-600 font-medium italic text-center mb-6">
                    Are you sure you want to buy this product?
                  </p>

                  <div className="flex gap-4 w-full justify-center">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      disabled={isProcessing}
                      className="flex-1 h-12 bg-[#CC2424] hover:bg-[#b01e1e] text-white font-bold text-lg rounded-full shadow-sm transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>

                    <button 
                      onClick={async () => {
                        if (!auctionDetail?.id) return;
                        try {
                          setIsProcessing(true);
                          
                          const res = await paymentService.createPayment(auctionDetail.id);

                          // Thêm console.log để debug xem cấu trúc JSON thực tế trả về từ Interceptor là gì
                          console.log("Payment response status:", res);

                          if (res?.data?.paymentUrl) {
                            window.location.href = res.data.paymentUrl;
                          } else {
                            // Trường hợp Backend trả về success=false hoặc message lỗi nằm trong res
                            alert(res?.message || "Could not generate payment link. Please try again!");
                            setIsProcessing(false);
                          }
                        } catch (error: any) {
                          // Chuỗi hóa hoặc lôi thuộc tính message ra để xem lỗi thực sự là gì (401, 403, 404, hay 500)
                          console.error("Detailed Payment Error:", JSON.stringify(error));
                          
                          const errorMsg = error?.data?.message || error?.message || "An error occurred during process execution.";
                          alert(`Payment Failed: ${errorMsg}`);
                          
                          setIsProcessing(false);
                        }
                      }}
                      disabled={isProcessing}
                      className="flex-1 h-12 bg-[#0000FF] hover:bg-[#0000cc] text-white font-bold text-lg rounded-full shadow-sm transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-4xl font-[900] text-gray-900 tracking-tight leading-tight">
              {auctionDetail?.productName || "Loading..."}
            </h2>
            
            {status === 'Upcoming' && <UpcomingView infoRows={infoRows} auctionDetail={auctionDetail} />}
            {status === 'Live' && <LiveView infoRows={infoRows} auctionDetail={auctionDetail} />}
            {status === 'Ended' && <EndedView infoRows={infoRows} auctionDetail={auctionDetail} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}