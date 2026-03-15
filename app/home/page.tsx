import Header from '@/components/Header'; 
import Footer from '@/components/Footer';
import { Hero } from './Hero';
import { AuctionSection } from './AuctionSection';

export default function HomePage() {
  const upcomingItems = Array(4).fill({
    label: "Auction Time",
    time: "10/3/2026 09:00:00",
    image: "/laptop-image.png", 
    title: "Laptop Gaming",
    priceLabel: "Starting Bid",
    price: "12,000,000 VND"
  });

  const ongoingItems = Array(4).fill({
    label: "Auction End Time",
    time: "15/3/2026 23:00:00",
    image: "/laptop-image.png",
    title: "Laptop Gaming",
    priceLabel: "Current Bid",
    price: "12,000,000 VND"
  });

  const resultItems = Array(4).fill({
    label: "Auction End Time",
    time: "1/3/2026 14:30:00",
    image: "/laptop-image.png",
    title: "Laptop Gaming",
    priceLabel: "Winning Bid",
    price: "12,000,000 VND"
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Hero />
        
        <div className="pb-16 space-y-4">
          <AuctionSection id="upcoming-auctions"title="Upcoming Auctions" items={upcomingItems} />
          <AuctionSection title="Ongoing Auctions" items={ongoingItems} />
          <AuctionSection title="Auction Results" items={resultItems} isResult />
        </div>
      </main>

      <Footer />
    </div>
  );
}