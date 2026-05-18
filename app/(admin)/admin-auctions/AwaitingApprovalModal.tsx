"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Jost } from "next/font/google";
import { auctionService } from "@/services/auctionService";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

interface AwaitingApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const AwaitingApprovalModal = ({
  isOpen,
  onClose,
  data,
}: AwaitingApprovalModalProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [auctionDetail, setAuctionDetail] = useState<any>(null);

  useEffect(() => {
    if (isOpen && data?.id) {
      auctionService.getByIdAdmin(data.id)
        .then(res => setAuctionDetail(res.data))
        .catch(err => console.error(err));
    } else {
      setAuctionDetail(null);
    }
  }, [isOpen, data]);

  const handleApproveClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmApprove = async () => {
    if (!data?.id) return;
    try {
      await auctionService.reviewAuction(data.id, { approved: true });
      setShowConfirm(false);
      onClose();
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to approve auction");
    }
  };

  const handleRejectClick = () => {
    if (!reason.trim()) {
      alert("Please enter a reason for refusal.");
      return;
    }
    setShowRejectConfirm(true);
  };

  const handleConfirmReject = async () => {
    if (!data?.id) return;
    try {
      await auctionService.reviewAuction(data.id, { approved: false, rejectionReason: reason });
      setShowRejectConfirm(false);
      onClose();
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to reject auction");
    }
  };

  if (!isOpen || !data) return null;

  const detailRows = auctionDetail ? [
    { label: "Starting price:", value: `${auctionDetail.startingPrice?.toLocaleString()} VND` },
    { label: "Property code:", value: auctionDetail.id?.toString() },
    { label: "Bid increment:", value: `${auctionDetail.bidIncrement?.toLocaleString()} VND` },
    { label: "Buy now price:", value: auctionDetail.buyNowPrice ? `${auctionDetail.buyNowPrice.toLocaleString()} VND` : "N/A" },
    { label: "Status:", value: auctionDetail.status, isStatus: true },
    { label: "Category:", value: auctionDetail.categoryName },
    { label: "Registration time:", value: auctionDetail.createdAt ? new Date(auctionDetail.createdAt).toLocaleString('en-GB') : "N/A" },
    { label: "Bidding start time:", value: auctionDetail.biddingStartTime ? new Date(auctionDetail.biddingStartTime).toLocaleString('en-GB') : "N/A" },
    { label: "Bidding end time:", value: auctionDetail.biddingEndTime ? new Date(auctionDetail.biddingEndTime).toLocaleString('en-GB') : "N/A" },
  ] : [];

  return (
    <div
      className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200`}
    >
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-8 py-6 bg-white shrink-0 border-b border-gray-100">
          <h2 className="text-[28px] font-[900] text-gray-900 tracking-tight">
            Auction awaiting approval
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={32} className="text-gray-900" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={auctionDetail?.images?.[0]?.imageUrl || data.imageUrl || "/banner.jpg"}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="relative w-32 h-24 shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src={auctionDetail?.images?.[1]?.imageUrl || data.imageUrl || "/banner.jpg"}
                    alt="Thumb 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-32 h-24 shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src={auctionDetail?.images?.[2]?.imageUrl || data.imageUrl || "/nen.jpg"}
                    alt="Thumb 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-[24px] p-5 space-y-3 bg-white shadow-sm rounded-2xl">
                <h3 className="text-[#d32f2f] font-[900] text-lg mb-2">
                  Seller Info
                </h3>
                <div className="text-sm font-medium space-y-2">
                    <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-medium">
                        <span className="text-gray-900 font-black">Seller:</span>
                        <span className="text-gray-700">{auctionDetail?.sellerName || "N/A"}</span>
                    </div>

                    <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-gray-900 font-black">Email:</span>
                        <span className="text-gray-700">
                            {auctionDetail?.sellerEmail || "N/A"}
                        </span>
                    </div>

                    <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-gray-900 font-black">Sold:</span>
                        <span className="text-gray-700">0</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-2xl font-[900] text-gray-900">
                {auctionDetail?.productName || data.name}
              </h3>

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex justify-between items-start gap-4 border-b border-gray-50 pb-2">
                  <span className="font-[900] text-[#d32f2f] whitespace-nowrap text-[15px]">
                    Description:
                  </span>
                  <span className="text-right font-medium text-gray-800 text-[14px] leading-relaxed">
                    {auctionDetail?.description || ""}
                  </span>
                </div>

                {detailRows.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center gap-4 border-b border-gray-50 pb-1"
                  >
                    <span className="font-[900] text-[#d32f2f] whitespace-nowrap text-[15px]">
                      {item.label}
                    </span>
                    <span
                      className={`text-right font-medium text-[15px] ${
                        item.isStatus
                          ? "text-orange-500 font-[900]"
                          : "text-gray-900"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-5 mt-4 pb-6">
                <button
                  onClick={handleApproveClick}
                  className="w-full py-3 text-white font-bold rounded-xl hover:opacity-90 transition-all text-base shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#1d4ed8" }}
                >
                  Approve
                </button>

                {showConfirm && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm animate-in zoom-in-95 duration-200">
                      <h3 className="text-lg font-black text-gray-900 mb-2 text-center">
                        Confirmation
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 font-medium">
                        Are you sure you want to approve this auction session?
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowConfirm(false)}
                          className="flex-1 py-2.5 border border-gray-200 text-white font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
                          style={{ backgroundColor: "#f97316" }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmApprove}
                          className="flex-1 py-2.5 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm"
                          style={{ backgroundColor: "#1d4ed8" }}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 bg-gray-50/50">
                  <div className="space-y-1.5">
                    <span className="text-[#d32f2f] font-bold text-xm ml-0.5">
                      Reason for refusal:
                    </span>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason if rejecting..."
                      className="w-full h-32 p-3 text-sm bg-white border border-gray-200 rounded-none outline-none focus:ring-1 focus:ring-gray-300 transition-all resize-none placeholder:text-gray-400 font-medium"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleRejectClick}
                      className="px-12 py-2.5 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-md active:scale-[0.98]"
                      style={{ backgroundColor: "#cc2229" }}
                    >
                      Reject
                    </button>
                  </div>

                  {showRejectConfirm && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
                      <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-black text-[#ce2029] text-center mb-2">
                          Reject Auction
                        </h3>
                        <p className="text-sm text-gray-600 mb-6 font-medium">
                          Are you sure you want to reject this auction? This
                          action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowRejectConfirm(false)}
                            className="flex-1 py-2.5 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-sm active:scale-95"
                            style={{ backgroundColor: "#f97316" }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleConfirmReject}
                            className="flex-1 py-2.5 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-sm active:scale-95"
                            style={{ backgroundColor: "#cc2229" }}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            margin: 10px 0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
            border: 2px solid white;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AwaitingApprovalModal;