import { AuctionCard } from "./AuctionCard";
import { Jost } from 'next/font/google';
import Link from "next/link";

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
});

interface AuctionItem {
  label: string;
  time: string;
  image: string;
  title: string;
  priceLabel: string;
  price: string;
}

interface SectionProps {
  id?: string;
  title: string;
  items: AuctionItem[];
  isResult?: boolean;
}

export const AuctionSection = ({ id, title, items }: SectionProps) => (
  <section id={id} className={`${jost.className} py-14 bg-white`}>

    <div className="max-w-screen-xl mx-auto px-6">

      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="hidden sm:block h-[1px] bg-[#d32f2f] flex-1 max-w-[140px]" />

        <h2 className="text-[#d32f2f] text-2xl md:text-3xl font-[900] tracking-[0.1em] text-center">
          {title}
        </h2>

        <div className="hidden sm:block h-[1px] bg-[#d32f2f] flex-1 max-w-[140px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item, idx) => (
          <AuctionCard key={idx} {...item} />
        ))}
      </div>

      <div className="flex justify-center md:justify-start mt-10">
        <Link
          href="/list-auction"
          className="px-6 py-2 border-2 border-[#ce2029] text-[#ce2029] text-sm md:text-base font-bold rounded-md hover:bg-red-50 transition tracking-wider"
        >
          View All
        </Link>
      </div>

    </div>

  </section>
);