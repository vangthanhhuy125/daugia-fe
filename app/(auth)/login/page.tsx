"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from "next/font/google";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function LoginPage() {
  return (
    <div className={`${jost.className} flex min-h-screen bg-white`}>
      
      <div className="hidden lg:block lg:w-1/3 relative">
        <Image
          src="/nen.jpg" 
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative">
        
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

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-5xl font-[900] text-black mb-8">Login</h1>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Email address or phone number:
              </label>
              <input
                type="text"
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Password:
              </label>
              <input
                type="password"
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
              />
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-black">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-gray-600 hover:text-black underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-14 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-8 text-center lg:text-left font-medium text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}