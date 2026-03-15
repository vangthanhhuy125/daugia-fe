import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const MissionVision = () => (
  <section className={`${jost.className} w-full py-12 px-6 md:px-20 space-y-20 bg-[#f9f9f9]`}>
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-[#d32f2f] text-3xl font-[900] mb-8 drop-shadow-sm">Our Mission</h2>
      <p className="text-gray-700 mb-10 max-w-4xl mx-auto italic text-center font-medium">
        Our mission is to build a reliable and transparent auction platform where users can confidently participate in auction activities. 
        <span className="font-[900] text-black italic"> Smart</span>Auction aims to simplify the auction process and provide equal opportunities for buyers and sellers in the Vietnamese market in particular and the world in general.
      </p>
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <img src="/OurMission.png" alt="Mission" className="w-full h-auto" />
      </div>
    </div>

    <div className="max-w-5xl mx-auto text-center pt-10">
      <h2 className="text-[#d32f2f] text-3xl font-[900] mb-8 drop-shadow-sm">Our Vision</h2>
      <p className="text-gray-700 mb-10 max-w-4xl mx-auto italic text-center font-medium">
        We envision <span className="font-[900] text-black italic"> Smart</span>Auction becoming a leading online auction platform that leverages modern technology to create a smarter, faster, and more trustworthy bidding experience.
      </p>
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <img src="/OurVision.jpg" alt="Vision" className="w-full h-auto" />
      </div>
    </div>
  </section>
);