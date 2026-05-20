"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from "next/font/google";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { decodeJwt } from "@/utils/auth";
import { X } from "lucide-react"; // Import thêm X icon để làm nút đóng modal

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  
  // Trạng thái điều khiển ẩn/hiện Modal thông báo Khóa tài khoản
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authService.authenticate({
        identifier: identity,
        password: password,
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
    } catch (err: any) {
      // BẪY LỖI: Kiểm tra xem lỗi trả về từ Backend có phải là trạng thái LOCKED không
      const errorMsg = err.message || err.data?.message || "";
      const isLockedStatus = err.status === 423 || errorMsg.toLowerCase().includes("lock");

      if (isLockedStatus) {
        // Nếu dính lỗi khóa, bung ngay modal thông báo lên màn hình thay vì alert thông thường
        setIsLockedModalOpen(true);
      } else {
        alert(errorMsg || "Invalid credentials");
      }
    }
  };

  return (
    <div className={`${jost.className} flex min-h-screen bg-white relative`}>
      
      {isLockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[32px] p-6 md:p-8 shadow-2xl relative border border-gray-100 flex flex-col items-center animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsLockedModalOpen(false)}
              className="absolute top-5 right-5 text-gray-900 hover:text-gray-500 transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="text-5xl mb-4">⚠️</div>

            <h2 className="text-[#CE2029] text-2xl font-[900] mb-4 text-center tracking-tight">
              Account Locked
            </h2>

            <p className="text-base text-gray-800 text-center leading-relaxed font-medium max-w-sm mb-6">
              Your account has been temporarily locked due to suspicious activity or policy violations. 
              Please request to unlock your account or contact support for assistance.
            </p>

            <button
              onClick={() => {
                setIsLockedModalOpen(false);
                router.push("/unlock-request"); 
              }}
              className="w-56 h-12 bg-blue-600 hover:bg-blue-700 text-white font-[900] text-lg rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center"
            >
              Unlock request
            </button>

          </div>
        </div>
      )}

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

      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative pt-32 pb-12">
        
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Email address:
              </label>
              <input
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-14 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-blue-600 transition"
                required
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
                className="w-full h-14 bg-blue-600 text-white font-[900] text-xl rounded-full shadow-lg hover:bg-blue-700 hover:scale-[1.01] transition-all"
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