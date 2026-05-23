"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import { X } from "lucide-react";
import { ProcessingHistoryModal } from "./ProcessingHistoryModal"; 
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface UserData {
  id: string;
  name: string;
  joinDate: string;
  role: "Seller" | "Bidder";
  status: "Active" | "Blocked";
  hasUnlockRequest: boolean;
  email?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string | null;
  lockReason?: string;
  requestReason?: string;
  enabled?: boolean;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const [view, setView] = useState<"details" | "block-confirm" | "unlock-review">("details");
  const [blockReason, setBlockReason] = useState("");
  const [unlockRequestContent, setUnlockRequestContent] = useState("");
  const [unlockResponse, setUnlockResponse] = useState("");
  const [confirmAction, setConfirmAction] = useState<null | "block" | "unlock" | "reject">(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [realUserDetail, setRealUserDetail] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserActuallyLocked, setIsUserActuallyLocked] = useState(false); 

  useEffect(() => {
    if (isOpen && user?.id) {
      setView("details");
      setBlockReason("");
      setUnlockRequestContent(""); 
      setUnlockResponse("");
      setConfirmAction(null);
      setIsSubmitting(false);
      setIsUserActuallyLocked(false);

      userService.getUserById(user.id)
        .then(res => setRealUserDetail(res.data))
        .catch(console.error);

      userService.getAccountLogs(user.id, 0, 50)
        .then(res => {
          const logs = res.data?.content || [];
          
          if (logs.length > 0) {
            const latestLockLog = logs.find((log: any) => log.action === "LOCK");
            const latestRequestLog = logs.find(
              (log: any) => log.action === "REQUEST_UNLOCK" || log.reason?.toLowerCase().includes("request")
            );

            if (latestLockLog) {
              setBlockReason(latestLockLog.reason || "No details provided.");
              setIsUserActuallyLocked(true);
            }

            if (latestRequestLog && latestLockLog) {
              const lockTime = new Date(latestLockLog.createdAt).getTime();
              const requestTime = new Date(latestRequestLog.createdAt).getTime();

              if (requestTime > lockTime) {
                setUnlockRequestContent(latestRequestLog.reason || "I believe my account was locked by mistake.");
              } else {
                setUnlockRequestContent(""); 
              }
            } else if (latestRequestLog && !latestLockLog) {
              setUnlockRequestContent(latestRequestLog.reason || "I believe my account was locked by mistake.");
            }
          }
        })
        .catch(console.error);
    } else {
      setRealUserDetail(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const getFullAddress = () => {
    const source = realUserDetail || user;
    if (!source) return "N/A";

    if (source.address) return source.address;

    const parts = [
      source.street,
      source.ward,
      source.province
    ].filter(part => part && part.trim() !== "");

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const isBlocked = isUserActuallyLocked; 

  const enriched: UserData = {
    ...user,
    name: realUserDetail?.fullName || user.name || "N/A", 
    email: realUserDetail?.email || user.email || "N/A",
    phone: realUserDetail?.phone || user.phone || "N/A",
    avatarUrl: realUserDetail?.avatarUrl !== undefined ? realUserDetail.avatarUrl : user.avatarUrl, 
    address: getFullAddress(), 
    status: isBlocked ? "Blocked" : "Active", 
    lockReason: blockReason || "No details provided.",
    requestReason: unlockRequestContent || "N/A - User has not submitted an unlock request yet.",
  };

  const hasUnlock = user.hasUnlockRequest || unlockRequestContent !== "";

  const handleBlockClick = () => setView("block-confirm");
  
  const handleConfirmBlock = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await userService.lockUser(user.id, blockReason.trim() || "Violated platform terms");
      alert("User has been locked successfully!");
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Failed to block user. Please try again.");
    } finally {
      setIsSubmitting(false);
      setConfirmAction(null);
    }
  };
  
  const handleCancelBlock = () => setView("details");

  const handleUnlockClick = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await userService.unlockUser(user.id, unlockResponse.trim() || "Account restored after admin review");
      alert("User has been unlocked successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to unlock user.");
    } finally {
      setIsSubmitting(false);
      setConfirmAction(null);
    }
  };
  
  const handleRejectClick = () => {
    onClose();
  };

  const handleActionConfirm = () => {
    if (confirmAction === "block") {
      handleConfirmBlock();
    } else if (confirmAction === "unlock") {
      handleUnlockClick();
    } else if (confirmAction === "reject") {
      handleRejectClick();
    }
  };

  const getConfirmMessage = () => {
    if (confirmAction === "block") return "Are you sure you want to block this user?";
    if (confirmAction === "unlock") return "Are you sure you want to unlock this user?";
    if (confirmAction === "reject") return "Are you sure you want to reject this unlock request?";
    return "";
  };

  return (
    <div
      className={`${jost.className} fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4`}
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
    >
      <div className="w-full max-w-[800px] overflow-hidden rounded-3xl bg-white shadow-2xl relative">

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-900 hover:text-gray-600 transition disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={28} strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-8 max-h-[68vh] overflow-y-auto pr-2 custom-scrollbar">
            
            {confirmAction && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-6 rounded-3xl">
                <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
                  <p className="text-lg font-bold text-center text-gray-900 mb-2">Confirm action</p>
                  <p className="text-sm text-gray-600 text-center mb-6">{getConfirmMessage()}</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setConfirmAction(null)}
                      disabled={isSubmitting}
                      className="text-gray-700 text-sm font-semibold px-5 py-2 rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleActionConfirm}
                      disabled={isSubmitting}
                      className="text-white text-sm font-semibold px-5 py-2 rounded-full bg-[#107C41] transition-all hover:bg-[#0d6535] disabled:opacity-50 min-w-[90px] flex items-center justify-center"
                    >
                      {isSubmitting ? "Saving..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-10">
              <div
                className="rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-amber-400 via-amber-300 to-orange-200 border border-gray-100 shadow-inner"
                style={{ width: 140, height: 140 }}
              >
                {enriched.avatarUrl ? (
                  <img src={enriched.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
                    <rect width="88" height="88" fill="#F5A623" rx="44" />
                    <path d="M12 80 C12 62 28 54 44 54 C60 54 76 62 76 80" fill="#3B5998" />
                    <circle cx="44" cy="36" r="18" fill="#F5C67A" />
                    <path d="M26 30 C26 16 62 16 62 30 C62 22 56 16 44 16 C32 16 26 22 26 30Z" fill="#7B4F2E" />
                    <path d="M35 54 L44 64 L53 54" fill="#4A6FA5" />
                  </svg>
                )}
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-4 mb-1">
                  <p className="text-2xl font-bold text-gray-900 leading-none">{enriched.name}</p>
                  <button 
                    className="text-white text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#107C41] transition-all hover:bg-[#0d6535] active:scale-95 leading-none"
                    onClick={() => setIsHistoryModalOpen(true)}
                  >
                    Processing history
                  </button>
                </div>
                <p className="text-lg font-bold italic text-gray-900 mb-5">{enriched.role}</p>

                <div className="grid grid-cols-[130px_1fr] gap-y-3 text-[15px]">
                  <span className="text-gray-900 font-bold">Email:</span>
                  <span className="text-gray-900 underline underline-offset-2 cursor-pointer">{enriched.email}</span>

                  <span className="text-gray-900 font-bold">Phone number:</span>
                  <span className="text-gray-900">{enriched.phone}</span>

                  <span className="text-gray-900 font-bold">Address:</span>
                  <span className="text-gray-900">{enriched.address}</span>

                  <span className="text-gray-900 font-bold">Join date:</span>
                  <span className="text-gray-900">{enriched.joinDate}</span>

                  <span className="text-gray-900 font-bold">Role:</span>
                  <span className="text-gray-900">{enriched.role}</span>

                  <span className="text-gray-900 font-bold flex items-center ">Status:</span>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${isBlocked ? 'text-[#CE2029]' : 'text-blue-800'}`}>
                      {enriched.status}
                    </span>

                    {!isBlocked && (
                      <button
                        onClick={handleBlockClick}
                        className="text-white text-sm font-bold px-6 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "#CE2029" }}
                      >
                        Block
                      </button>
                    )}

                    {isBlocked && hasUnlock && (
                      <button
                        className="text-white text-sm font-bold px-6 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "#0000FF" }} 
                        onClick={() => setView("unlock-review")}
                      >
                        Unlock Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {view === "block-confirm" && (
              <div className="rounded-[20px] border border-gray-300 bg-white p-6 relative">
                <p className="text-[15px] font-bold text-gray-900 mb-3">Enter the reason for blocking the user</p>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full border border-gray-300 rounded-sm p-3 text-[15px] text-gray-800 resize-none outline-none focus:border-gray-500 transition-colors disabled:bg-gray-50"
                />
                <div className="flex justify-center gap-5 pt-4">
                  <button
                    onClick={() => setConfirmAction("block")} 
                    disabled={isSubmitting}
                    className="text-white text-[15px] font-bold px-10 py-2 rounded-full bg-[#CE2029] transition-all hover:bg-[#b71e26] active:scale-95 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCancelBlock}
                    disabled={isSubmitting}
                    className="text-white text-[15px] font-bold px-10 py-2 rounded-full bg-[#FF7F00] transition-all hover:bg-[#e67300] active:scale-95 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {view === "unlock-review" && (
              <div className="rounded-[20px] border border-gray-300 bg-white p-6 relative">
                <div className="grid grid-cols-[130px_1fr] gap-4 text-[15px] mb-4">
                  <span className="font-bold text-gray-900">Lock reason</span>
                  <span className="text-gray-900">{enriched.lockReason}</span>
                </div>

                <div className="grid grid-cols-[130px_1fr] gap-4 text-[15px] mb-4">
                  <span className="font-bold text-gray-900">Request reason</span>
                  <span className="text-gray-900 font-semibold text-blue-700">{enriched.requestReason}</span>
                </div>

                <div className="grid grid-cols-[130px_1fr] gap-4 text-[15px]">
                  <span className="font-bold text-gray-900 mt-2">Response</span>
                  <textarea
                    value={unlockResponse}
                    onChange={(e) => setUnlockResponse(e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full border border-gray-300 rounded-sm p-3 text-[15px] text-gray-800 resize-none outline-none focus:border-gray-500 transition-colors disabled:bg-gray-50"
                  />
                </div>

                <div className="flex justify-center gap-5 pt-6">
                  <button
                    onClick={() => setConfirmAction("reject")}
                    disabled={isSubmitting}
                    className="text-white text-[15px] font-bold px-10 py-2 rounded-full bg-[#CE2029] transition-all hover:bg-[#b71e26] active:scale-95 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setConfirmAction("unlock")}
                    disabled={isSubmitting}
                    className="text-white text-[15px] font-bold px-10 py-2 rounded-full bg-[#0000FF] transition-all hover:bg-blue-800 active:scale-95 disabled:opacity-50"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProcessingHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        userId={user.id}
      />
    </div>
  );
}