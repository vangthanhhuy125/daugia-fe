"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(180);
  const [resendCount, setResendCount] = useState(0);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async () => {
    if (resendCount >= 3) {
      setError("Maximum of 3 retries reached. Verification disabled.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setTimer(180);
      setOtp(new Array(6).fill(""));
      setResendCount(prev => prev + 1);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    if (timer === 0) {
      setError("OTP has expired. Please request a new code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp: otpCode,
        newPassword,
        confirmPassword,
      });
      
      alert("Password changed successfully!");
      
      router.replace("/login");
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);

    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to reset password.";
      setError(errMsg);
      alert(`Error: ${errMsg}`);
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
          <h1 className="text-5xl font-[900] text-black mb-4">Reset Password</h1>
          
          <p className="text-gray-700 font-medium mb-8">
            Enter the code sent to <span className="font-bold italic text-black">{email}</span> and your new password.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleReset}>
            {/* GỘP KHỐI NHẬP OTP */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Verification Code (OTP) <span className="text-red-500">(*)</span>:
              </label>
              <div className="flex gap-2 md:gap-4 justify-between lg:justify-start">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    disabled={isLoading || resendCount >= 3}
                    className="w-12 h-14 md:w-14 md:h-14 bg-[#e0e0e0] rounded-2xl text-center text-2xl font-bold outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all disabled:opacity-50 shadow-inner"
                  />
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-1 pt-1 text-sm">
                <p className="text-red-500 font-bold">
                  {timer > 0 ? `Code expires in ${formatTime(timer)}` : "Code expired"}
                </p>
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  disabled={isLoading || resendCount >= 3}
                  className="text-black font-bold hover:text-blue-600 underline underline-offset-4 decoration-2 disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                  Resend Code {resendCount > 0 && `(${3 - resendCount} left)`}
                </button>
              </div>
            </div>

            {/* KHỐI NHẬP MẬT KHẨU MỚI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                New Password <span className="text-red-500">(*)</span>:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading || resendCount >= 3}
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
                disabled={isLoading || resendCount >= 3}
                required
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-8 outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all shadow-inner"
              />
            </div>

            <div className="pt-6 flex justify-center lg:justify-center">
              <button
                type="submit"
                disabled={isLoading || resendCount >= 3}
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