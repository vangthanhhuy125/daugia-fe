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

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState<'Upcoming' | 'Live' | 'Ended'>('Live');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctionDetail, setAuctionDetail] = useState<any>(null);

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