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

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/verify");
  };

  return (
    <div className={`${jost.className} flex min-h-screen bg-white`}>
      
      <div className="hidden lg:block lg:w-1/3 relative">
        <Image
          src="/nen.jpg" 
          alt="Forgot Password Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-10 relative">
        
        <div className="absolute top-14 left-12 md:left-24 lg:left-32">
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 transition-transform group-hover:rotate-12">
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

        <div className="max-w-xl w-full mx-auto lg:mx-0 pt-20">
          <h1 className="text-5xl font-[900] text-black mb-8">Forgot password</h1>
          
          <div className="space-y-1 text-gray-700 font-medium mb-8">
            <p>Enter your registered email address.</p>
            <p>We will send a 6-digit verification code (OTP) to your email.</p>
          </div>

          <form className="space-y-10" onSubmit={handleSendCode}>
            <div className="space-y-2">
              <input
                type="email"
                //required
                placeholder="Email address"
                className="w-full h-16 bg-[#e0e0e0] rounded-full px-8 text-lg outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

            <div className="pt-4 flex flex-col items-center lg:items-start gap-8">
              <button
                type="submit"
                className="w-full h-14 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all"
              >
                Send Verification Code
              </button>

              <div className="mt-8 text-center lg:text-left font-medium text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-bold hover:underline underline-offset-4"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}