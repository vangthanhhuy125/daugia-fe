"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Jost } from "next/font/google";
import { authService } from "@/services/authService";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

function CreateNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      
      alert("Password changed successfully!");
      
      router.replace("/login");
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${jost.className} flex min-h-screen bg-white`}>
      <div className="hidden lg:block lg:w-1/3 relative">
        <Image
          src="/nen.jpg" 
          alt="Create New Password Background"
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
          <h1 className="text-5xl font-[900] text-black mb-10">Create New Password</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleReset}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                New Password <span className="text-red-500">(*)</span>:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-8 outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Confirm password <span className="text-red-500">(*)</span>:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-8 outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

            <div className="pt-8 flex justify-center lg:justify-start">
              <button
                type="submit"
                disabled={isLoading}
                className="w-72 h-14 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all disabled:bg-blue-400 disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateNewPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-xl font-medium">Loading...</div>}>
      <CreateNewPasswordContent />
    </Suspense>
  );
}