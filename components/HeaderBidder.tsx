"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, LogOut, UserCircle, User, Lock, Bell, ChevronLeft } from "lucide-react";
import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

const HeaderBidder = () => {
  const [open, setOpen] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = true; 
  const userName = "Huy";

  const notifications = [
    { id: 1, text: "You have a new bid on MSI Raider", time: "2 mins ago" },
    { id: 2, text: "Auction for ASUS ROG has ended", time: "1 hour ago" },
    { id: 3, text: "Welcome to SmartAuction!", time: "1 day ago" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`${jost.className} w-full bg-white border-b border-gray-100 sticky top-0 z-50`}>
      <div className="max-w-screen-xl mx-auto px-6 h-[70px] flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/logo-website.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <span className="text-xl tracking-tighter">
            <span className="font-[900] text-[#1a1a1a]">Smart</span>
            <span className="font-light text-[#1a1a1a]">Auction</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#d32f2f] transition tracking-wider">Auction</span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-[#d32f2f] transition-transform duration-200 group-hover:rotate-180" />
            </div>
            <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <Link href="/auctions/upcoming" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Upcoming Auctions</Link>
              <Link href="/auctions/live" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Live Auctions</Link>
              <Link href="/auctions/results" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Auction Results</Link>
            </div>
          </div>
          <Link href="/about" className="text-[15px] font-medium text-gray-800 hover:text-[#d32f2f] transition tracking-wider">About Us</Link>
          <Link href="/contact" className="text-[15px] font-medium text-gray-800 hover:text-[#d32f2f] transition tracking-wider">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <div className="relative" ref={menuRef}>
                <div 
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setShowNotifications(false); }}
                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 px-3 py-1.5 rounded-full transition-all"
                >
                  <UserCircle size={28} strokeWidth={1.5} className="text-gray-900" />
                  <span className="text-[16px] font-black text-gray-900 tracking-tight">Hi, {userName}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </div>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 transition-all">
                    {!showNotifications ? (
                      <div className="flex flex-col">
                        <Link href="/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
                          <User size={18} className="text-gray-400 group-hover:text-[#d32f2f]" />
                          <span className="text-sm font-bold text-gray-700">Personal Profile</span>
                        </Link>
                        <Link href="/change-password" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
                          <Lock size={18} className="text-gray-400 group-hover:text-[#d32f2f]" />
                          <span className="text-sm font-bold text-gray-700">Change Password</span>
                        </Link>
                        <button 
                          onClick={(e) => { e.preventDefault(); setShowNotifications(true); }}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Bell size={18} className="text-gray-400 group-hover:text-[#d32f2f]" />
                            <span className="text-sm font-bold text-gray-700">Notifications</span>
                          </div>
                          <span className="bg-[#d32f2f] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{notifications.length}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col animate-in slide-in-from-right-4 duration-200">
                        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                          <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft size={18} className="text-gray-500" />
                          </button>
                          <span className="text-sm font-black text-gray-900">Notifications</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map((n) => (
                            <div key={n.id} className="px-5 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                              <p className="text-xs font-bold text-gray-800">{n.text}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                          ))}
                        </div>
                        <button className="py-2 text-[11px] font-black text-[#d32f2f] hover:bg-gray-50 transition-colors text-center">Mark all as read</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-90">
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-800">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-4 shadow-xl">
          {isLoggedIn && (
             <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <UserCircle size={32} className="text-gray-900" />
                <span className="font-black text-gray-900">Hi, {userName}</span>
             </div>
          )}
          <button onClick={() => setAuctionOpen(!auctionOpen)} className="flex items-center justify-between w-full text-gray-800 font-bold tracking-wider">
            Auction <ChevronDown size={16} className={`transition-transform ${auctionOpen ? "rotate-180" : ""}`} />
          </button>
          {auctionOpen && (
            <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-50 text-sm font-medium text-gray-500">
              <button className="text-left">Upcoming Auctions</button>
              <button className="text-left">Live Auctions</button>
              <button className="text-left">Auction Results</button>
            </div>
          )}
          <Link href="/about" className="block text-gray-700 font-bold tracking-wider">About Us</Link>
          <Link href="/contact" className="block text-gray-700 font-bold tracking-wider">Contact</Link>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/profile" className="text-gray-700 font-bold tracking-wider">Personal Profile</Link>
            <button className="flex items-center gap-2 text-[#d32f2f] font-bold tracking-wider"><LogOut size={18} /> Log Out</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderBidder;