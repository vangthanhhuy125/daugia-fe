"use client";

import { useEffect, useState } from "react";
import { AuctionCard } from "./AuctionCard";
import { Jost } from 'next/font/google';
import Link from "next/link";
import { auctionService } from "@/services/auctionService";

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
});

interface SectionProps {
  id?: string;
  title: string;
  statusFilter: "APPROVED" | "ACTIVE" | "ENDED";
}

export const AuctionSection = ({ id, title, statusFilter }: SectionProps) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await auctionService.searchPublic({ status: statusFilter as any, size: 4 });
        const mapped = res.data.content.map((item: any) => {
          let label = "Upcoming";
          let priceLabel = "Starting Price";
          
          if (statusFilter === "ACTIVE") {
            label = "Auction End Time";
            priceLabel = "Current Bid";
          } else if (statusFilter === "ENDED") {
            label = "Auction End Time";
            priceLabel = "Final Bid";
          } else if (statusFilter === "APPROVED") {
            label = "Auction Time";
            priceLabel = "Starting Price";
          }

          const dateStr = item.biddingStartTime ? new Date(item.biddingStartTime).toLocaleString('en-GB') : "";

          return {
            id: item.id.toString(),
            label: label,
            time: dateStr,
            image: item.thumbnailUrl || "/laptop-image.png",
            title: item.productName,
            priceLabel: priceLabel,
            price: item.currentPrice || item.startingPrice
          };
        });
        setItems(mapped);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuctions();
  }, [statusFilter]);

  return (
    <section id={id} className={`${jost.className} py-14 bg-white`}>
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="hidden sm:block h-[1px] bg-[#d32f2f] flex-1 max-w-[140px]" />
          <h2 className="text-[#d32f2f] text-2xl md:text-3xl font-[900] tracking-[0.1em] text-center">
            {title}
          </h2>
          <div className="hidden sm:block h-[1px] bg-[#d32f2f] flex-1 max-w-[140px]" />
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, idx) => (
              <AuctionCard key={idx} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 font-medium py-8">
            No auctions found.
          </div>
        )}

        <div className="flex justify-center md:justify-start mt-10">
          <Link
            href={`/list-auction?status=${statusFilter === 'APPROVED' ? 'Upcoming' : statusFilter === 'ACTIVE' ? 'Live' : 'Ended'}`}
            className="px-6 py-2 border-2 border-[#ce2029] text-[#ce2029] text-sm md:text-base font-bold rounded-md hover:bg-red-50 transition tracking-wider"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};