"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "700", "900"] });

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  title?: string;
  description?: string;
}

export const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Feedback",
  description = "We value your feedback. Please share your experience, suggestions, or report any issues to help us improve SmartAuction."
}: FeedbackModalProps) => {
  const [text, setText] = useState("");

  if (!isOpen) return null;

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[850px] rounded-[40px] p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-black text-gray-900 leading-none">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-900 hover:scale-110 transition-transform p-1"
          >
            <X size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="text-center space-y-5">
          <p className="text-[14px] italic text-gray-700 leading-relaxed text-left max-w-full mx-auto px-4">
            {description}
          </p>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-56 border-2 border-gray-100 rounded-[30px] p-6 text-lg outline-none focus:border-[#CE2029] transition-colors resize-none placeholder:text-gray-300"
            placeholder="Write your feedback here..."
          />

          <div className="flex justify-center pt-1">
            <button
              onClick={() => { onSubmit(text); setText(""); onClose(); }}
              className="px-14 py-3 bg-[#CE2029] text-white text-xl font-black rounded-full hover:bg-red-700 transition-all active:scale-95 tracking-wider"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};