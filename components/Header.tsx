"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

const Header = () => {
  const [open, setOpen] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);

  return (
    <header className={`${jost.className} w-full bg-white border-b border-gray-200 sticky top-0 z-50`}>
      
      <div className="max-w-screen-xl mx-auto px-6 h-[70px] flex items-center justify-between">

        <Link href="/home" className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo-website.png"
              alt="SmartAuction Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="text-xl tracking-tight">
            <span className="font-[900] text-[#1a1a1a]">Smart</span>
            <span className="font-light text-[#1a1a1a]">Auction</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">

          <div className="relative group">
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#d32f2f] transition tracking-wider">
                Auction
              </span>

              <ChevronDown
                size={16}
                className="text-gray-500 group-hover:text-[#d32f2f] transition-transform duration-200 group-hover:rotate-180"
              />
            </div>

            <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

              <button
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#d32f2f] transition"
              >
                Upcoming Auctions
              </button>

              <button                        
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#d32f2f] transition"
              >
                Ongoing Auctions
              </button>

              <button
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#d32f2f] transition"
              >
                Auction Results
              </button>

            </div>
          </div>

          <Link
            href="/about"
            className="text-[15px] font-medium text-gray-800 hover:text-[#d32f2f] transition tracking-wider"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-[15px] font-medium text-gray-800 hover:text-[#d32f2f] transition tracking-wider"
          >
            Contact
          </Link>

        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-[15px] font-medium text-gray-700 hover:text-black transition tracking-wider"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="px-6 py-2 border-2 border-[#d32f2f] rounded-md bg-white hover:bg-[#d32f2f] hover:text-white transition group"
          >
            <span className="text-[15px] font-[900] text-[#d32f2f] group-hover:text-white">
              Sign Up
            </span>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-6 space-y-4 shadow-inner">

          <button
            onClick={() => setAuctionOpen(!auctionOpen)}
            className="flex items-center justify-between w-full text-gray-800 font-bold tracking-wider"
          >
            Auction
            <ChevronDown
              size={16}
              className={`transition-transform ${auctionOpen ? "rotate-180" : ""}`}
            />
          </button>

          {auctionOpen && (
            <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-100">

              <button className="text-left text-gray-600 font-medium">
                Upcoming Auctions
              </button>

              <button className="text-left text-gray-600 font-medium">
                Ongoing Auctions
              </button>

              <button className="text-left text-gray-600 font-medium">
                Auction Results
              </button>

            </div>
          )}

          <Link href="/about" className="block text-gray-700 font-bold tracking-wider">
            About Us
          </Link>

          <Link href="/contact" className="block text-gray-700 font-bold tracking-wider">
            Contact
          </Link>

          <div className="border-t pt-4 flex flex-col gap-3">
            <Link href="/login" className="text-gray-700 font-bold tracking-wider">
              Log In
            </Link>

            <Link
              href="/signup"
              className="px-5 py-3 bg-[#d32f2f] text-white text-center font-[900] rounded-md tracking-widest shadow-md"
            >
              Sign Up
            </Link>
          </div>

        </div>
      )}

    </header>
  );
};

export default Header;