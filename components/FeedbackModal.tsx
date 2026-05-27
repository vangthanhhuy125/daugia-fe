"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Jost } from "next/font/google";
import { feedbackService } from "@/services/feedbackService";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "700", "900"] });

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (text: string) => void;
  title?: string;
  description?: string;
}

export const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Feedback",
  description = "We value your feedback. Please share your experience, suggestions, or report any issues to help us improve SmartAuction.",
}: FeedbackModalProps) => {
  const [text, setText] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const response = await userService.getMe();
        const profile = response?.data;
        if (!cancelled && profile) {
          setFullName(profile.fullName || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setRole(profile.role?.name || "");
        }
      } catch (error: any) {
        if (!cancelled) {
          setErrorMessage(error?.message || "Unable to load your profile.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName || !email || !phone) {
      setErrorMessage("Your profile information is incomplete.");
      return;
    }
    if (!text.trim()) {
      setErrorMessage("Please write your feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackService.submit({
        fullName,
        email,
        phone,
        content: text,
        role,
      });
      setSuccessMessage("Thank you. Your feedback has been submitted.");
      setText("");
      onSubmit?.(text);
      onClose();
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[850px] rounded-[40px] p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-black text-gray-900 leading-none">{title}</h2>
          <button onClick={onClose} className="text-gray-900 hover:scale-110 transition-transform p-1">
            <X size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-4 text-[14px] italic text-gray-700 leading-relaxed text-left max-w-full mx-auto px-1">
          <p>{description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-italic text-sm text-gray-600">
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <span className="font-bold text-gray-900">Full name:</span> {isLoadingProfile ? "Loading..." : fullName || "-"}
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <span className="font-bold text-gray-900">Role:</span> {isLoadingProfile ? "Loading..." : role || "-"}
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <span className="font-bold text-gray-900">Email:</span> {isLoadingProfile ? "Loading..." : email || "-"}
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <span className="font-bold text-gray-900">Phone:</span> {isLoadingProfile ? "Loading..." : phone || "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-56 border-2 border-gray-100 rounded-[30px] p-6 text-lg outline-none focus:border-[#CE2029] transition-colors resize-none placeholder:text-gray-300"
            placeholder="Write your feedback here..."
            disabled={isLoadingProfile || isSubmitting}
          />

          {(successMessage || errorMessage) && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                successMessage
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
              role="alert"
            >
              {successMessage || errorMessage}
            </div>
          )}

          <div className="flex justify-center pt-1">
            <button
              onClick={handleSubmit}
              disabled={isLoadingProfile || isSubmitting}
              className="px-14 py-3 bg-[#CE2029] text-white text-xl font-black rounded-full hover:bg-red-700 transition-all active:scale-95 tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
