import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
});

const Footer = () => {
  return (
    <footer className={`${jost.className} w-full bg-black text-white pt-14 pb-6 border-t border-gray-800`}>

      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        <div className="flex flex-col items-center md:items-center gap-4">
          <div className="relative w-32 h-32 overflow-hidden shadow-lg">
            <Image
              src="/logo-website.png"
              alt="SmartAuction Logo"
              fill
              className="object-contain p-2"
              priority
            />
          </div>

          <div className="text-3xl tracking-tight">
            <span className="font-[900]">Smart</span>
            <span className="font-light">Auction</span>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 tracking-wider">Explore</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/auctions/live" className="hover:text-white transition">
                Live Auctions
              </Link>
            </li>
            <li>
              <Link href="/auctions/upcoming" className="hover:text-white transition">
                Upcoming Auctions
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-white transition">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/popular" className="hover:text-white transition">
                Popular Items
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 tracking-wider">Contact</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <span className="font-semibold text-white block">Email</span>
              support@smartauction.com
            </li>
            <li>
              <span className="font-semibold text-white block">Phone</span>
              +84 xxx xxx xxx
            </li>
            <li>
              <span className="font-semibold text-white block">Address</span>
              Ho Chi Minh City, Vietnam
            </li>
          </ul>
        </div>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-900 text-center text-gray-400 text-sm tracking-widest uppercase">
        © 2026 SmartAuction. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;