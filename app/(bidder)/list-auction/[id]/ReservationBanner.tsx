import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface ReservationBannerProps {
  remainingSeconds: number;
  paymentUrl: string | null;
}

export const ReservationBanner: React.FC<ReservationBannerProps> = ({
  remainingSeconds,
  paymentUrl
}) => {
  const [secondsLeft, setSecondsLeft] = useState(remainingSeconds);

  useEffect(() => {
    setSecondsLeft(remainingSeconds);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const isExpired = secondsLeft <= 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, "0")}`;

  const handlePay = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className={`w-full rounded-xl border p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-6 shadow-sm ${jost.className} ${isExpired ? 'bg-red-50 border-red-400' : 'bg-amber-50 border-amber-400'}`}>
      <div className="flex-1">
        <h4 className={`font-bold ${isExpired ? 'text-red-700' : 'text-amber-800'}`}>
          {isExpired ? "Your reservation has expired." : "You have a pending reservation."}
        </h4>
        <p className={`text-sm ${isExpired ? 'text-red-600' : 'text-amber-700'}`}>
          {isExpired 
            ? "You may try again if the item is still available." 
            : `Please complete payment within ${timeString} or it will be cancelled.`}
        </p>
      </div>
      
      {!isExpired && paymentUrl && (
        <button
          onClick={handlePay}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          Pay Now
        </button>
      )}
    </div>
  );
};
