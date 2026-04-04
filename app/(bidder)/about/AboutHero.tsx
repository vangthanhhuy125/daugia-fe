"use client";
import { Jost } from 'next/font/google';
import { motion } from "framer-motion";

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'], 
});

export const AboutHero = () => (
  <section className={`${jost.className} relative w-full py-24 px-6 md:px-20 bg-white overflow-hidden`}>
    
    <div
      className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none animate-pulse"
      style={{
        backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    />

    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-red-100 rounded-full blur-[100px] opacity-50 animate-bounce transition-all duration-[10s]" />
    <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 animate-pulse transition-all duration-[8s]" />

    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-[#d32f2f] text-3xl md:text-3xl font-[900] mb-12 drop-shadow-md">
        Introduction
      </h2>

      <div className="space-y-8 text-gray-800 leading-relaxed text-justify md:text-lg font-medium">
        <p>
          <span className="font-black text-black tracking-tight text-xl">Smart</span>
          <span className="font-light text-black text-xl">Auction</span> 
          {" "}is a modern online auction platform that allows users to buy and sell products through a transparent and competitive bidding process. 
          The platform is designed to make online auctions simple, efficient, and accessible for everyone.
        </p>
        
        <p>
          Users can explore a wide range of products, follow auction activities in real time, and place bids easily through a user-friendly interface.  
          <span className="font-black text-black tracking-tight"> Smart</span>Auction
          creates a dynamic marketplace where buyers and sellers can interact and find valuable opportunities.
        </p>

        <p>
          With a focus on transparency, security, and reliability, 
          <span className="font-black text-black tracking-tight"> Smart</span>Auction aims to provide a trustworthy environment for online 
          auctions and deliver a smarter way to participate in digital marketplaces.
        </p>
      </div>

      {/* Trang trí chân trang intro */}
      <div className="mt-16 flex justify-center">
        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#d32f2f] to-transparent rounded-full" />
      </div>
    </div>
  </section>
);