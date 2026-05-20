"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentService } from "@/services/paymentService";

function VnpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    paymentService
      .vnpayReturn(params)
      .then((res) => {
        if (res.data?.status === "PAID") {
          setStatus("success");
          setMessage("Payment successful! You have won the auction.");
        } else {
          setStatus("failed");
          setMessage("Payment failed or was cancelled.");
        }
      })
      .catch(() => {
        setStatus("failed");
        setMessage("Payment verification failed.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 border rounded-[32px] max-w-md shadow-lg">
        {status === "loading" && (
          <div>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-700">Verifying payment...</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push("/bidder-payments")}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700"
            >
              View My Payments
            </button>
          </div>
        )}
        {status === "failed" && (
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-black text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push("/bidder-payments")}
              className="bg-gray-600 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-700"
            >
              Back to Payments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VnpayReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VnpayReturnContent />
    </Suspense>
  );
}
