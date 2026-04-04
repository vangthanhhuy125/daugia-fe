import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuctionFilters } from "./AuctionFilters";
import { AuctionListCard } from "./AuctionListCard";
import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

const auctions = Array(9).fill({
  image: "/laptop-image.png",
  title: "MSI Raider GE78 Gaming Laptop",
  status: "Upcoming",
  openDate: "15/3/2026",
}).map((item, i) => {
  if (i >= 3 && i < 6) return { ...item, status: "Live", openDate: "8/3/2026", endDate: "12/3/2026" };
  if (i >= 6) return { ...item, status: "Ended", openDate: "1/3/2026", endDate: "1/3/2026" };
  return item;
});

export default function AuctionListPage() {
  return (
    <div className={`${jost.className} flex flex-col min-h-screen bg-[#fdfdfd]`}>
      <Header />
      
      <main className="flex-grow max-w-screen-xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
           <h1 className="text-3xl font-[900] text-gray-900">List Auctions</h1>
           <p className="text-sm font-medium text-gray-400">Home {'>'} <span className="text-gray-400">List Auctions</span></p>
        </div>

        <AuctionFilters />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((item, idx) => (
            <AuctionListCard key={idx} {...item} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button className="px-6 py-2 border-2 border-[#d32f2f] text-[#d32f2f] font-bold rounded-full">Previous</button>
          <div className="w-10 h-10 flex items-center justify-center border-2 border-[#d32f2f] text-[#d32f2f] font-[900] rounded-full">1</div>
          <button className="px-6 py-2 border-2 border-[#d32f2f] text-[#d32f2f] font-bold rounded-full">Next</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}