import Image from "next/image";
import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
});

interface AuctionCardProps {
  label: string;
  time: string;
  image: string;
  title: string;
  priceLabel: string;
  price: string;
}

export const AuctionCard = ({
  label,
  time,
  image,
  title,
  priceLabel,
  price,
}: AuctionCardProps) => (
  <div className={`${jost.className} group w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center`}>

    <p className="text-gray-400 text-xs">{label}</p>

    <p className="text-[#1a1a1a] font-bold text-sm md:text-base mb-3">
      {time}
    </p>

    <div className="relative w-full h-32 mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <h3 className="text-gray-700 font-semibold text-sm md:text-base mb-1 line-clamp-2">
      {title}
    </h3>

    <p className="text-gray-600 text-xs md:text-sm mb-4">
      {priceLabel}: <span className="font-bold">{price}</span>
    </p>

    <button className="w-full py-2 bg-[#d32f2f] text-white text-sm md:text-base font-bold rounded-md hover:bg-red-700 transition-colors">
      Details
    </button>

  </div>
);