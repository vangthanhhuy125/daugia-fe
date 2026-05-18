"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, Menu, X, LogOut, UserCircle, 
  User, Lock, Bell, ChevronLeft, LayoutDashboard, PlusCircle, AlertCircle
} from "lucide-react";
import { Jost } from 'next/font/google';
import { useAuth } from "@/app/context/AuthContext"; 
import { userService } from "@/services/userService";

const jost = Jost({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

const Header = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState(""); 

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      userService.getProfile("")
        .then(res => {
          if (res.data) {
            setUserName(res.data.fullName || "");
          }
        })
        .catch(console.error);
    } else {
      setUserName("");
    }
  }, [isLoggedIn]);

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

  const confirmLogout = () => {
    const currentRole = role;
    logout();
    
    if (currentRole === 'bidder') {
      window.location.href = "/bidder-home";
    } else if (currentRole === 'seller' || currentRole === 'admin') {
      window.location.href = "/login";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className={`${jost.className} w-full bg-white border-b border-gray-100 sticky top-0 z-50`}>
      <div className="max-w-screen-xl mx-auto px-6 h-[70px] flex items-center justify-between">
        

        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/logo-website.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <span className="text-xl tracking-tighter">
            <span className="font-[900] text-[#1a1a1a]">Smart</span>
            <span className="font-light text-[#1a1a1a]">Auction</span>
            
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {(!isLoggedIn || role === 'bidder') ? (
            <>
              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#d32f2f] transition tracking-wider">Auction</span>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-[#d32f2f] transition-transform duration-200 group-hover:rotate-180" />
                </div>
                <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link href="/list-auction?status=Upcoming" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Upcoming Auctions</Link>
                  <Link href="/list-auction?status=Live" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Live Auctions</Link>
                  <Link href="/list-auction?status=Ended" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Auction Results</Link>
                </div>
              </div>
              <Link href="/about" className="text-[15px] font-medium text-gray-800 hover:text-[#d32f2f] transition tracking-wider">About Us</Link>
              <Link href="/contact" className="text-[15px] font-medium text-gray-800 hover:text-[#d32f2f] transition tracking-wider">Contact</Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full select-none">
                <UserCircle size={28} strokeWidth={1.5} className="text-gray-900" />
                <span className="text-[16px] font-black text-gray-900 tracking-tight">
                  Hi, {role === 'admin' ? `Admin ${userName}` : userName}
                </span>
                
                {role !== 'admin' && (
                  <div 
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setShowNotifications(false); }}
                    className="cursor-pointer relative"
                  >
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </div>
                )}
              </div>

              {userMenuOpen && role !== 'admin' && (
                <div ref={menuRef} className="absolute right-20 mt-48 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {!showNotifications ? (
                    <div className="flex flex-col">
                      <Link href={role === 'seller' ? "/seller-profile" : "/bidder-profile"} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
                        <User size={18} className="text-gray-400 group-hover:text-[#d32f2f]" />
                        <span className="text-sm font-bold text-gray-700">{role === 'seller' ? 'Seller Profile' : 'Personal Profile'}</span>
                      </Link>

                      <button 
                        onClick={() => {
                          setShowChangePasswordModal(true);
                          setUserMenuOpen(false); 
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <Lock size={18} className="text-gray-400 group-hover:text-[#d32f2f]" />
                        <span className="text-sm font-bold text-gray-700">Change Password</span>
                      </button>

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
                          <div key={n.id} className="px-5 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50">
                            <p className="text-xs font-bold text-gray-800">{n.text}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                      <button className="py-2 text-[11px] font-black text-[#d32f2f] hover:bg-gray-50 text-center">Mark all as read</button>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => setShowLogoutModal(true)} 
                className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-90"
              >
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-[15px] font-medium text-gray-700 hover:text-black transition tracking-wider">Log In</Link>
              <Link href="/register" className="px-6 py-2 border-2 border-[#d32f2f] rounded-md bg-white hover:bg-[#d32f2f] hover:text-white transition group">
                <span className="text-[15px] font-[900] text-[#d32f2f] group-hover:text-white">Sign Up</span>
              </Link>
            </div>
          )}

          {role !== 'admin' && (
            <button onClick={() => setOpen(!open)} className="md:hidden text-gray-800">
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>
      </div>

      {open && role !== 'admin' && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-4 shadow-xl">
          {isLoggedIn && (
             <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <UserCircle size={32} className="text-gray-900" />
                <span className="font-black text-gray-900">Hi, {userName}</span>
             </div>
          )}
          
          {(!isLoggedIn || role === 'bidder') ? (
            <>
              <button onClick={() => setAuctionOpen(!auctionOpen)} className="flex items-center justify-between w-full text-gray-800 font-bold tracking-wider">
                Auction <ChevronDown size={16} className={`transition-transform ${auctionOpen ? "rotate-180" : ""}`} />
              </button>
              {auctionOpen && (
                <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-50 text-sm font-medium text-gray-500">
                  <Link href="/list-auction?status=Upcoming">Upcoming Auctions</Link>
                  <Link href="/list-auction?status=Live" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#d32f2f] transition">Live Auctions</Link>
                  <Link href="/list-auction?status=Ended">Auction Results</Link>
                </div>
              )}
              
              <Link href="/about" className="block text-gray-700 font-bold tracking-wider">About Us</Link>
              <Link href="/contact" className="block text-gray-700 font-bold tracking-wider">Contact</Link>
            </>
          ) : role === 'seller' ? (
            <>
              <Link href="/seller-home" className="block text-gray-700 font-bold tracking-wider hover:text-[#d32f2f]">Dashboard</Link>
              <Link href="/seller-auctions" className="block text-[#d32f2f] font-black tracking-wider">Create New Auction</Link>
            </>
          ) : null}
          
          <div className="pt-4 flex flex-col gap-3 border-t border-gray-50">
            {isLoggedIn ? (
              <>
                <Link href={role === 'seller' ? "/seller-profile" : "/bidder-profile"} className="text-gray-700 font-bold tracking-wider">Personal Profile</Link>
                <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2 text-[#d32f2f] font-bold tracking-wider">
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 font-bold tracking-wider">Log In</Link>
                <Link href="/register" className="px-5 py-3 bg-[#d32f2f] text-white text-center font-[900] rounded-md tracking-widest shadow-md">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 scale-in-center animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={28} className="text-[#d32f2f]" />
              </div>
              <h3 className="text-xl font-[900] text-gray-900 mb-2">Log out</h3>
              <p className="text-sm text-gray-500 font-medium mb-8">
                Are you sure you want to log out?
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-200 transition active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-[#d32f2f] text-white text-sm font-[900] rounded-full shadow-lg hover:bg-red-700 transition active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChangePasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] shadow-2xl max-w-[500px] w-full p-6 md:p-8 relative scale-in-center animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute right-5 top-5 text-black hover:text-gray-500 transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <h2 className="text-[26px] font-bold text-black mb-6">Change Password</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[15px] font-medium text-black mb-1.5">
                  Enter Current Password <span className="text-[#CE2029]">(*)</span>
                </label>
                <input 
                  type="password" 
                  className="w-full border border-gray-400 rounded-full px-4 py-2.5 outline-none focus:border-blue-600 transition-colors text-[15px]"
                />
              </div>

              <div>
                <label className="block text-[15px] font-medium text-black mb-1.5">
                  Enter New Password <span className="text-[#CE2029]">(*)</span>
                </label>
                <input 
                  type="password" 
                  className="w-full border border-gray-400 rounded-full px-4 py-2.5 outline-none focus:border-blue-600 transition-colors text-[15px]"
                />
              </div>

              <div>
                <label className="block text-[15px] font-medium text-black mb-1.5">
                  Confirm New Password <span className="text-[#CE2029]">(*)</span>
                </label>
                <input 
                  type="password" 
                  className="w-full border border-gray-400 rounded-full px-4 py-2.5 outline-none focus:border-blue-600 transition-colors text-[15px]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => {
                  setShowChangePasswordModal(false);
                }}
                className="bg-[#0000FF] text-white text-[16px] font-bold rounded-full px-12 py-2.5 hover:bg-blue-800 transition-all active:scale-95 shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;