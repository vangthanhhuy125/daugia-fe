"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { decodeJwt } from "@/utils/auth";
import { useAuth } from "@/app/context/AuthContext";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type");
  const { login } = useAuth();

  const [timer, setTimer] = useState(180);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length < 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    if (timer === 0) {
      setError("OTP has expired. Please request a new code.");
      return;
    }

    if (resendCount >= 3) {
      setError("Verification disabled due to maximum retry limit.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      if (type === "forgot") {
        await authService.verifyOtp({
          email,
          otp: otpCode,
          purpose: "FORGOT_PASSWORD",
        });
        
        router.push(`/create-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpCode)}`);
      } else {
        const response = await authService.verifyOtp({
          email,
          otp: otpCode,
          purpose: "REGISTRATION",
        });

        const { access_token, refresh_token, role } = response.data;

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        const payload = decodeJwt(access_token);
        if (payload?.sub) {
          localStorage.setItem("userId", payload.sub);
        }

        const normalizedRole = role.toLowerCase();
        login({ role: normalizedRole, token: access_token });

        if (normalizedRole === "admin") {
          router.push("/admin-home");
        } else if (normalizedRole === "seller") {
          router.push("/seller-profile");
        } else {
          router.push("/bidder-home");
        }
      }
    } catch (err: any) {
      setError(err.message || err.data?.message || "Invalid OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${jost.className} flex min-h-screen bg-white`}>
      <div className="hidden lg:block lg:w-1/3 relative">
        <Image
          src="/nen.jpg" 
          alt="Verify Background"
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
          <h1 className="text-5xl font-[900] text-black mb-6">Verify OTP</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <p className="text-gray-700 font-medium mb-8">
            We sent a code to: <span className="font-bold italic text-black">{email}</span>
          </p>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="flex gap-2 md:gap-4 justify-between lg:justify-start">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={isLoading || resendCount >= 3}
                  className="w-12 h-14 md:w-16 md:h-16 bg-[#e0e0e0] rounded-2xl text-center text-2xl font-bold outline-none focus:ring-4 ring-blue-600/20 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all disabled:opacity-50"
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
              <p className="text-red-500 font-bold text-lg">
                {timer > 0 ? `Code expires in ${formatTime(timer)}` : "Code expired"}
              </p>
              
              <p className="text-gray-700 font-bold">
                Didn't receive code?{" "}
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  disabled={isLoading || resendCount >= 3}
                  className="text-black hover:text-blue-600 underline underline-offset-4 decoration-2 disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                  Resend Code {resendCount > 0 && `(${3 - resendCount} left)`}
                </button>
              </p>
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              <button
                type="submit"
                disabled={isLoading || resendCount >= 3}
                className="w-48 h-14 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all disabled:bg-blue-400 disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-xl font-medium">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}