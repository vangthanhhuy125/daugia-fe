"use client";

import React from "react";
import { X } from "lucide-react";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReadOnly?: boolean;
  data: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    feedback: string;
    response?: string; // Thêm field response để hiển thị khi ở chế độ Read Only
  };
}

export const FeedbackModal = ({ isOpen, onClose, isReadOnly, data }: FeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={`${jost.className} fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4`}>
      <div className="bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col border border-gray-200">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors z-10"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <h2 className="text-2xl text-[#CE2029] font-bold mb-6 flex-shrink-0">Feedback</h2>

        {/* Nội dung chính */}
        <div className="overflow-y-auto pr-2 custom-scrollbar space-y-4 text-sm flex-grow">
          <div className="flex items-center gap-4">
            <span className="font-bold w-[140px] min-w-[140px]">Full name:</span>
            <span className="text-gray-800">{data.fullName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold w-[140px] min-w-[140px]">Role:</span>
            <span className="text-gray-800">{data.role}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold w-[140px] min-w-[140px]">Email:</span>
            <span className="break-words text-gray-800">{data.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold w-[140px] min-w-[140px]">Phone number:</span>
            <span className="text-gray-800">{data.phone}</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-bold w-[140px] min-w-[140px] pt-1">Feedback:</span>
            <p className="text-gray-700 leading-relaxed italic">"{data.feedback}"</p>
          </div>

          {/* Logic hiển thị Response */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            {isReadOnly ? (
              // Chế độ Read Only: Hiển thị text thuần
              <div className="flex items-start gap-4">
                <span className="font-bold w-[140px] min-w-[140px] text-[#CE2029]">Response:</span>
                <p className="text-gray-700 leading-relaxed">
                  {data.response || "No response yet."}
                </p>
              </div>
            ) : (
              // Chế độ Edit: Hiển thị ô nhập liệu
              <>
                <label className="block text-[#CE2029] font-bold mb-2 text-sm">Response:</label>
                <textarea 
                  className="w-full h-24 p-4 border border-gray-300 rounded-2xl outline-none focus:border-[#CE2029] focus:ring-1 focus:ring-[#CE2029] transition-all resize-none text-sm bg-gray-50"
                  placeholder="Type your response here..."
                />
              </>
            )}
          </div>
        </div>

        {/* Chỉ hiện các nút điều hướng nếu KHÔNG PHẢI ReadOnly */}
        {!isReadOnly && (
          <div className="grid grid-cols-2 gap-4 mt-8 flex-shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="w-full px-8 py-3.5 bg-[#CE2029] text-white font-bold rounded-full hover:bg-[#b01b22] transition-all active:scale-[0.98] text-sm shadow-md"
            >
              Reject
            </button>
            <button 
              type="button"
              className="w-full px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all active:scale-[0.98] text-sm shadow-md"
            >
              Resolve & Notify
            </button>
          </div>
        )}
      </div>
    </div>
  );
};