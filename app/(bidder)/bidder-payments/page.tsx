"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Sidebar } from "@/components/Sidebar";
import { PaymentGroup } from "./PaymentGroup";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import PaymentModal from "./PaymentModal";
import { userService } from "@/services/userService";
import { paymentService } from "@/services/paymentService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function BidderPaymentPage() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Paid">("Pending");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState<any>(null);

  const [paymentData, setPaymentData] = useState<{ Pending: any[]; Paid: any[] }>({ Pending: [], Paid: [] });
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getMe();
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoadingPayments(true);
        setPaymentError("");
        const res = await paymentService.getMyPayments();
        const payments = res.data || [];

        const pending: any[] = [];
        const paid: any[] = [];

        payments.forEach((item: any) => {
          const dateSource = item.biddingEndTime || item.createdAt;
          const dateStr = dateSource ? new Date(dateSource).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) : "Unknown Date";
          const rawAmount = item.currentPrice ?? item.amount ?? item.startingPrice ?? 0;
          const formattedItem = {
            id: item.auctionId?.toString() || "",
            title: item.auctionTitle || `Auction ${item.auctionId || ""}`,
            amount: `${Number(rawAmount).toLocaleString()} VND`,
            image: item.thumbnailUrl || "/laptop-image.png"
          };

          if (item.status === "PAID") {
            let group = paid.find(g => g.date === dateStr);
            if (!group) {
              group = { date: dateStr, items: [] };
              paid.push(group);
            }
            group.items.push(formattedItem);
          } else {
            let group = pending.find(g => g.date === dateStr);
            if (!group) {
              group = { date: dateStr, items: [] };
              pending.push(group);
            }
            group.items.push(formattedItem);
          }
        });

        setPaymentData({ Pending: pending, Paid: paid });
      } catch (error) {
        setPaymentError("Failed to load payments. Please try again later.");
      } finally {
        setIsLoadingPayments(false);
      }
    };
    fetchPayments();
  }, []);

  const tabs = ["Pending", "Paid"];

  const handleOpenPayment = (item: any) => {
    setSelectedPaymentData(item);
    setIsPaymentOpen(true);
  };

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white text-[#1a1a1a]`}>
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <nav className="mb-6">
          <h1 className="text-3xl font-[900]">Payments</h1>
          <p className="text-sm font-medium text-gray-400">Home {">"} Payments</p>
        </nav>

        <ProfileHeader
          name={profile?.fullName || "Loading..."}
          role={profile?.role?.name || "Bidder"}
          avatarUrl={profile?.avatarUrl || "/avatar.jfif"}
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <Sidebar />

          <section className="md:col-span-9 space-y-8">
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-10 py-3 rounded-full text-sm font-[900] transition-all ${
                    activeTab === tab 
                    ? "bg-[#e0e0e0] text-gray-900 shadow-inner" 
                    : "bg-[#f5f5f5] text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {tab === "Pending" ? "Pending Confirmation" : "Paid"}
                </button>
              ))}
            </div>

            <div className="space-y-10">
              {isLoadingPayments && (
                <div className="text-gray-500 font-medium py-10">Loading payments...</div>
              )}
              {!isLoadingPayments && paymentError && (
                <div className="text-red-600 font-medium py-10">{paymentError}</div>
              )}
              {paymentData[activeTab]?.map((group: any, idx: number) => (
                <PaymentGroup 
                  key={idx} 
                  date={group.date} 
                  items={group.items} 
                  status={activeTab} 
                  onPayItem={handleOpenPayment}
                />
              ))}
              {!isLoadingPayments && !paymentError && (!paymentData[activeTab] || paymentData[activeTab].length === 0) && (
                <div className="text-gray-400 font-medium py-10">No {activeTab.toLowerCase()} payments found.</div>
              )}
            </div>
          </section>
        </div>
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} onSubmit={() => {}} />
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onConfirm={() => setIsEditOpen(false)} initialData={profile || {}} />
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        data={selectedPaymentData}
      />

      <Footer />
    </div>
  );
}