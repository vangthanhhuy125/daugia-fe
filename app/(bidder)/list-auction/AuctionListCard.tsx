import Image from "next/image";
import { Jost } from 'next/font/google';
import Link from "next/link"; 

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

interface AuctionItemProps {
  id: string | number; 
  image: string;
  title: string;
  status: 'Upcoming' | 'Live' | 'Ended';
  openDate: string;
  endDate?: string;
}

export const AuctionListCard = ({ id, image, title, status, openDate, endDate }: AuctionItemProps) => {
  const statusColors = {
    Upcoming: 'text-yellow-500',
    Live: 'text-blue-600',
    Ended: 'text-[#d32f2f]'
  };

  return (
    <div className={`${jost.className} bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col`}>
      <div className="relative w-full h-48 mb-6 overflow-hidden rounded-xl bg-gray-50">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
        />
      </div>

      <h3 className="font-[800] text-gray-900 leading-tight line-clamp-2 mb-4 tracking-tight h-10">
        {title}
      </h3>

      <div className="space-y-1 mb-6 text-sm font-bold flex-grow">
        <p className="text-gray-600">Status: <span className={statusColors[status]}>{status}</span></p>
        <p className="text-gray-600">Open: {openDate}</p>
        {endDate && <p className="text-gray-600">End: {endDate}</p>}
      </div>

      <Link href={`/list-auction/${id}`} className="w-full block">
        <button className="w-full py-3 bg-[#d32f2f] text-white text-xm font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all">
          Details
        </button>
      </Link>
    </div>
  );
};