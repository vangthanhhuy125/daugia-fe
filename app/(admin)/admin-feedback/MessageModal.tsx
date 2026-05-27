"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Jost } from "next/font/google";
import { contactService } from "@/services/contactService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReadOnly?: boolean;
  messageId: string;
  onResolve?: () => void;
  onReject?: () => void;
  data: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    message: string;
    response?: string;
  };
}

export const MessageModal = ({
  isOpen,
  onClose,
  isReadOnly,
  messageId,
  onResolve,
  onReject,
  data,
}: MessageModalProps) => {
  const [response, setResponse] = useState(data.response || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setResponse(data.response || "");
      setErrorMessage("");
    }
  }, [data.response, isOpen]);

  if (!isOpen) return null;

  const submitAction = async (action: "resolve" | "reject") => {
    setErrorMessage("");

    if (!response.trim()) {
      setErrorMessage("Response is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        response,
        approve: action === "resolve",
      };
      if (action === "resolve") {
        await contactService.resolve(messageId, payload);
        await Promise.resolve(onResolve?.());
      } else {
        await contactService.reject(messageId, payload);
        await Promise.resolve(onReject?.());
      }
      onClose();
    } catch (error: any) {
      setErrorMessage(error?.message || `Failed to ${action} contact message.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${jost.className} fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4`}>
      <div className="bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col border border-gray-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors z-10">
          <X size={24} strokeWidth={2.5} />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex-shrink-0">Contact Message</h2>

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
            <span className="font-bold w-[140px] min-w-[140px]">Address:</span>
            <span className="text-gray-800 leading-snug">{data.address}</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-bold w-[140px] min-w-[140px] pt-1">Message:</span>
            <p className="text-gray-700 leading-relaxed italic">"{data.message}"</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            {isReadOnly ? (
              <div className="flex items-start gap-4">
                <span className="font-bold w-[140px] min-w-[140px] text-[#CE2029]">Response:</span>
                <p className="text-gray-700 leading-relaxed">{data.response || "No response recorded."}</p>
              </div>
            ) : (
              <>
                <label className="block text-[#CE2029] font-bold mb-2 text-sm">Response:</label>
                <textarea
                  value={response}
                  onChange={(event) => setResponse(event.target.value)}
                  className="w-full h-24 p-4 border border-gray-300 rounded-2xl outline-none focus:border-[#CE2029] focus:ring-1 focus:ring-[#CE2029] transition-all resize-none text-sm bg-gray-50"
                  placeholder="Type your response here..."
                  disabled={isSubmitting}
                />
              </>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
              {errorMessage}
            </div>
          )}
        </div>

        {!isReadOnly && (
          <div className="grid grid-cols-2 gap-4 mt-8 flex-shrink-0">
            <button
              type="button"
              onClick={() => submitAction("reject")}
              disabled={isSubmitting}
              className="w-full px-8 py-3.5 bg-[#CE2029] text-white font-bold rounded-full hover:bg-[#b01b22] transition-all active:scale-[0.98] text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => submitAction("resolve")}
              disabled={isSubmitting}
              className="w-full px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all active:scale-[0.98] text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Resolve & Notify'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
