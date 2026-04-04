"use client";
import { motion } from "framer-motion";
import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export const Hero = () => {
  return (
    <section className={`${jost.className} relative w-full bg-[#fdfdfd] py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 overflow-hidden min-h-[600px]`}>

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-50px] left-[-50px] w-[350px] h-[350px] bg-red-100 rounded-full blur-[80px] opacity-60 z-0"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-80px] right-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-60 z-0"
      />

      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 space-y-6 z-10"
      >
        <div className="space-y-2">
          <p className="text-gray-500 font-medium tracking-wide">
            Welcome <span className="font-[900] text-black">Smart</span>
            <span className="font-light text-black">Auction</span>
          </p>

          <h1 className="text-5xl md:text-6xl font-[900] text-[#d32f2f] leading-tight uppercase tracking-tight">
            Smart Bidding, <br />
            <span className="text-gray-900">Better Deals</span>
          </h1>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed max-w-md font-medium">
          <span className="font-[900] text-black">Smart</span>Auction is an online auction platform that allows users to discover products, 
          place bids in real time, and experience a fair and transparent bidding process. 
          Our system is designed to provide a simple, secure, and efficient auction experience for everyone
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() =>
              document
                .getElementById("upcoming-auctions")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-10 py-4 bg-[#d32f2f] text-white font-black rounded-lg shadow-lg hover:bg-red-700 hover:shadow-red-200 transition-all transform hover:-translate-y-1">
            Discover
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full max-w-md z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 rounded-2xl transform translate-x-4 translate-y-4 -z-10 opacity-20"></div>

          <div className="bg-[#3b59ff] rounded-2xl p-2 shadow-2xl transform transition-transform hover:scale-[1.02] cursor-pointer">
            <img
              src="/auction-online-bg.webp"
              alt="Auction Illustration"
              className="rounded-xl w-full h-auto object-cover shadow-inner"
            />
          </div>
        </div>
      </motion.div>

    </section>
  );
};