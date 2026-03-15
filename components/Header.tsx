"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setOpen(false);
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      
      <div className="max-w-screen-xl mx-auto px-6 h-[70px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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
            <span className="font-extrabold text-[#1a1a1a]">Smart</span>
            <span className="font-normal text-[#1a1a1a]">Auction</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">

          {/* Auction Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-[15px] font-medium text-gray-800 group-hover:text-blue-600 transition">
                Auction
              </span>

              <ChevronDown
                size={16}
                className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180"
              />
            </div>

            <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

              <button
                onClick={() => scrollToSection("upcoming-auctions")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Upcoming Auctions
              </button>

              <button
                onClick={() => scrollToSection("ongoing-auctions")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Ongoing Auctions
              </button>

              <button
                onClick={() => scrollToSection("auction-results")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Auction Results
              </button>

            </div>
          </div>

          <Link
            href="/about"
            className="text-[15px] font-medium text-gray-800 hover:text-blue-600 transition"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-[15px] font-medium text-gray-800 hover:text-blue-600 transition"
          >
            Contact
          </Link>

        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-[15px] font-medium text-gray-700 hover:text-black transition"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 border border-[#4a2b2b] rounded-md bg-white hover:bg-gray-50 transition"
          >
            <span className="text-[15px] font-bold text-[#1a1a1a]">
              Sign Up
            </span>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-3">

          {/* Auction Dropdown */}
          <button
            onClick={() => setAuctionOpen(!auctionOpen)}
            className="flex items-center justify-between w-full text-gray-800 font-medium"
          >
            Auction
            <ChevronDown
              size={16}
              className={`transition-transform ${auctionOpen ? "rotate-180" : ""}`}
            />
          </button>

          {auctionOpen && (
            <div className="pl-4 flex flex-col gap-2">

              <button
                onClick={() => scrollToSection("upcoming-auctions")}
                className="text-left text-gray-600"
              >
                Upcoming Auctions
              </button>

              <button
                onClick={() => scrollToSection("ongoing-auctions")}
                className="text-left text-gray-600"
              >
                Ongoing Auctions
              </button>

              <button
                onClick={() => scrollToSection("auction-results")}
                className="text-left text-gray-600"
              >
                Auction Results
              </button>

            </div>
          )}

          <Link href="/about" className="block text-gray-700 font-medium">
            About Us
          </Link>

          <Link href="/contact" className="block text-gray-700 font-medium">
            Contact
          </Link>

          <div className="border-t pt-3 flex flex-col gap-2">
            <Link href="/login" className="text-gray-700 font-medium">
              Log In
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 border border-[#4a2b2b] rounded-md text-center font-bold"
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