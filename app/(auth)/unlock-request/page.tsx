"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from "next/font/google";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService"; 

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function UnlockAccountPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const usersRes = await userService.getAllUsers(0, 1000);
      const allUsers = usersRes.data?.content || [];
      
      const matchedUser = allUsers.find(
        (u: any) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (!matchedUser) {
        throw new Error("This email address does not exist in our system. Please check again!");
      }

      const finalName = fullName.trim() || matchedUser.fullName || "Unknown User";

      await (authService as any).unlockAccount({ 
        userId: matchedUser.id, 
        fullName: finalName, 
        email: email.trim(), 
        reason: reason.trim(),
        action: "REQUEST_UNLOCK" 
      });

      setSuccess("Your unlock request has been submitted successfully. Admin will review your account soon!");
      setFullName("");
      setEmail("");
      setReason("");
    } catch (err: any) {
      setError(err.message || "Failed to submit unlock request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${jost.className} flex min-h-screen bg-white`}>
      
      <div className="hidden lg:block lg:w-1/3 relative">
        <Image
          src="/nen.jpg" 
          alt="Unlock Account Background"
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

        <div className="max-w-2xl w-full mx-auto lg:mx-0 pt-20">
          <h1 className="text-5xl font-[900] text-black mb-10">Unlock Your Account</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-700 text-sm font-medium animate-in fade-in duration-200">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Fullname:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your full name"
                  className="w-full h-14 bg-[#e0e0e0] rounded-full px-8 outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email Address <span className="text-red-500">(*)</span>:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-14 bg-[#e0e0e0] rounded-full px-8 outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Reason for unlock request <span className="text-red-500">(*)</span>:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                required
                rows={6}
                placeholder="Please describe why your account should be unlocked..."
                className="w-full bg-[#e0e0e0] rounded-[32px] p-8 outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner resize-none disabled:opacity-50"
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-80 h-16 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all tracking-wide disabled:bg-blue-400 disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}