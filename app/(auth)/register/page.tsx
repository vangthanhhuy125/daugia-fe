"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Jost } from "next/font/google";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/verify"); 
  };

  return (
    <div className={`${jost.className} flex min-h-screen bg-white`}>
      
      <div className="hidden lg:block lg:w-1/3 relative">
        <Image
          src="/nen.jpg" 
          alt="Register Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-10 relative">
        
        <div className="absolute top-10 left-8 md:left-20 lg:left-32">
          <Link href="/home" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-website.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl tracking-tight">
              <span className="font-[900] text-[#1a1a1a]">Smart</span>
              <span className="font-light text-[#1a1a1a]">Auction</span>
            </span>
          </Link>
        </div>

        <div className="max-w-2xl w-full mx-auto lg:mx-0">
          <h1 className="text-5xl font-[900] text-black mb-4 mt-8">Register</h1>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Full name <span className="text-red-500">(*)</span>:
              </label>
              <input
                type="text"
                //required
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Phone number <span className="text-red-500">(*)</span>:
                </label>
                <input
                  type="text"
                  //required
                  className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email address <span className="text-red-500">(*)</span>:
                </label>
                <input
                  type="email"
                  //required
                  className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Password <span className="text-red-500">(*)</span>:
                </label>
                <input
                  type="password"
                  //required
                  className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Confirm password <span className="text-red-500">(*)</span>:
                </label>
                <input
                  type="password"
                  //required
                  className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6 justify-center lg:justify-start">
              <button
                type="submit"
                className="px-8 h-14 bg-[#0a8444] text-white font-[900] text-lg rounded-full shadow-lg hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Register as a Seller
              </button>
              
              <button
                type="submit"
                className="px-8 h-14 bg-blue-600 text-white font-[900] text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Register as a Bidder
              </button>
            </div>
          </form>

          <div className="mt-8 text-center lg:text-left font-medium text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}