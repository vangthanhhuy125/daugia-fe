"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Jost } from "next/font/google";
import { authService } from "@/services/authService";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      router.push(`/create-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
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
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-1 text-gray-700 font-medium mb-8">
            <p>Enter your registered email address.</p>
            <p>We will send a 6-digit verification code (OTP) to your email.</p>
          </div>

          <form className="space-y-10" onSubmit={handleSendCode}>
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                placeholder="Email address"
                className="w-full h-16 bg-[#e0e0e0] rounded-full px-8 text-lg outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

            <div className="pt-4 flex flex-col items-center lg:items-start gap-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all disabled:bg-blue-400 disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send Verification Code"
                )}
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