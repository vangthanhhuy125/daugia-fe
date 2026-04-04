import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

const stats = [
  { label: "10,000+ Users", color: "border-yellow-400 text-yellow-500" },
  { label: "2,500+ Auctions", color: "border-gray-400 text-black" },
  { label: "5,000+ Products", color: "border-green-400 text-green-600" },
  { label: "98% Satisfaction", color: "border-blue-400 text-blue-600" },
];

export const PlatformStats = () => (
  <section className={`${jost.className} w-full py-20 px-6 bg-white`}>
    <h2 className="text-[#d32f2f] text-3xl font-[900] text-center mb-12 drop-shadow-sm">
      Platform Statistics
    </h2>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`py-6 px-6 border-2 rounded-2xl text-center font-bold text-xl shadow-sm hover:scale-105 transition-transform duration-300 ${stat.color}`}
        >
          {stat.label}
        </div>
      ))}
    </div>
  </section>
);