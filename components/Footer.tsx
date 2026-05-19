"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from 'next/font/google';
import { useAuth } from "@/app/context/AuthContext"; 
import { userService } from "@/services/userService";

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
});

const Footer = () => {
  const { isLoggedIn, role } = useAuth();
  const [currentRole, setCurrentRole] = useState(role || "guest");

  useEffect(() => {
    if (isLoggedIn) {
      userService.getMe()
        .then(res => {
          if (res.data?.role?.name) {
            setCurrentRole(res.data.role.name.toLowerCase());
          }
        })
        .catch(console.error);
    } else {
      setCurrentRole("guest");
    }
  }, [isLoggedIn, role]);
  
  const isAdminOrSeller = currentRole === "admin" || currentRole === "seller";

  return (
    <footer className={`${jost.className} w-full bg-black text-white pt-14 pb-6 border-t border-gray-800`}>

      <div className={`max-w-screen-xl mx-auto px-6 grid gap-10 ${
        isAdminOrSeller 
          ? 'grid-cols-1 md:grid-cols-3 items-center md:items-start' 
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
      }`}>

        {/* --- Logo Section --- */}
        <div className="flex flex-col items-center gap-4">
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

        {/* --- Quick Links Section --- */}
        <div className={`text-center md:text-left ${isAdminOrSeller ? 'md:pl-20' : ''}`}>
          <h3 className={`text-lg mb-4 tracking-wider ${isAdminOrSeller ? 'font-bold' : 'font-semibold'}`}>
            Quick Links
          </h3>
          
          {currentRole === "admin" && (
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link href="/admin-home" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/admin-auctions" className="hover:text-white transition">Auctions</Link></li>
              <li><Link href="/admin-categories" className="hover:text-white transition">Category</Link></li>
              <li><Link href="/admin-feedback" className="hover:text-white transition">Feedback</Link></li>
            </ul>
          )}

          {currentRole === "seller" && (
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link href="/seller-profile" className="hover:text-white transition">Profile</Link></li>
              <li><Link href="/seller-auctions" className="hover:text-white transition">Auctions</Link></li>
              <li><Link href="/seller-statistics" className="hover:text-white transition">Statistics</Link></li>
            </ul>
          )}

          {!isAdminOrSeller && (
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/bidder-home" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          )}
        </div>

        {/* --- Explore Section (Bidder/Guest Only) --- */}
        {!isAdminOrSeller && (
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 tracking-wider">Explore</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/list-auction?status=Live" className="hover:text-white transition">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link href="/list-auction?status=Upcoming" className="hover:text-white transition">
                  Upcoming Auctions
                </Link>
              </li>
              <li>
                <Link href="/popular" className="hover:text-white transition">
                  Popular Items
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* --- Contact Section --- */}
        <div className="text-center md:text-left">
          <h3 className={`text-lg mb-4 tracking-wider ${isAdminOrSeller ? 'font-bold' : 'font-semibold'}`}>
            Contact
          </h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <span className={`text-white ${isAdminOrSeller ? 'font-bold mr-2' : 'font-semibold block'}`}>
                Email{isAdminOrSeller ? ':' : ''}
              </span>
              support@smartauction.com
            </li>
            <li>
              <span className={`text-white ${isAdminOrSeller ? 'font-bold mr-2' : 'font-semibold block'}`}>
                Phone{isAdminOrSeller ? ':' : ''}
              </span>
              +84 xxx xxx xxx
            </li>
            <li>
              <span className={`text-white ${isAdminOrSeller ? 'font-bold mr-2' : 'font-semibold block'}`}>
                Address{isAdminOrSeller ? ':' : ''}
              </span>
              Ho Chi Minh City, Vietnam
            </li>
          </ul>
        </div>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-900 text-center text-gray-400 text-sm">
        © 2026 SmartAuction. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;