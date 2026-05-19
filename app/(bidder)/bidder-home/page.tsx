import Header from '@/components/Header'; 
import Footer from '@/components/Footer';
import { Hero } from './Hero';
import { AuctionSection } from './AuctionSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Hero />
        
        <div className="pb-16 space-y-4">
          <AuctionSection id="upcoming-auctions" title="Upcoming Auctions" statusFilter="APPROVED" />
          <AuctionSection title="Ongoing Auctions" statusFilter="ACTIVE" />
          <AuctionSection title="Auction Results" statusFilter="ENDED" />
        </div>
      </main>

      <Footer />
    </div>
  );
}