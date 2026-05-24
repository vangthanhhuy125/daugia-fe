import React from "react";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface BuyNowConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  buyNowPrice: number | undefined;
  isLoading: boolean;
}

export const BuyNowConfirmModal: React.FC<BuyNowConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  buyNowPrice,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 animate-fade-in ${jost.className}`}>
      <div className="relative w-full max-w-md bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-2xl flex flex-col items-center">
        <button 
          onClick={() => !isLoading && onClose()}
          disabled={isLoading}
          className="absolute top-4 right-5 text-gray-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[#CC2424] text-2xl md:text-3xl font-bold mb-4 text-center tracking-wide mt-2">
          Confirm Purchase
        </h2>

        <p className="text-base text-gray-700 text-center font-normal mb-4">
          You are about to purchase the following item:
        </p>

        <div className="text-base text-black text-left space-y-2 mb-4 font-normal bg-gray-50 p-4 rounded-xl w-full">
          <p><span className="font-bold text-gray-700">Product:</span> {productName}</p>
          <p><span className="font-bold text-gray-700">Buy Now Price:</span> {buyNowPrice ? `${buyNowPrice.toLocaleString()} VND` : "N/A"}</p>
        </div>

        <p className="text-sm text-[#FF6600] font-medium italic text-center mb-6 px-2">
          Warning: This will reserve the item for 5 minutes while you complete payment.
        </p>

        <div className="flex gap-4 w-full justify-center">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 bg-[#CC2424] hover:bg-[#b01e1e] text-white font-bold text-lg rounded-full shadow-sm transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-12 bg-[#0000FF] hover:bg-[#0000cc] text-white font-bold text-lg rounded-full shadow-sm transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};