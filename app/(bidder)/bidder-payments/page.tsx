"use client";

import React, { useState } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BidderProfileHeader } from "@/components/BidderProfileHeader";
import { BidderSidebar } from "@/components/BidderSidebar";
import { PaymentGroup } from "./PaymentGroup";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import PaymentModal from "./PaymentModal";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function BidderPaymentPage() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Paid">("Pending");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // State quản lý Modal thanh toán và dữ liệu nhóm được chọn
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState<any>(null);

  const paymentData = {
    Pending: [
      {
        date: "March 10, 2026",
        items: [
          { id: "p1", title: "ASUS ROG Strix G16 Gaming Laptop", amount: "20,000,000 VND", image: "/laptop-image.png" },
          { id: "p2", title: "ASUS ROG Strix G16 Gaming Laptop", amount: "20,000,000 VND", image: "/laptop-image.png" },
        ],
      },
      {
        date: "March 01, 2026",
        items: [
          { id: "p3", title: "ASUS ROG Zephyrus G14", amount: "20,000,000 VND", image: "/laptop-image.png" },
        ],
      },
    ],
    Paid: [
      {
        date: "February 25, 2026",
        items: [
          { id: "p5", title: "Macbook Pro M3 Max", amount: "80,000,000 VND", image: "/laptop-image.png" },
        ],
      },
    ],
  };

  const tabs = ["Pending", "Paid"];

  // Hàm xử lý mở thanh toán cho từng group
  const handleOpenPayment = (groupData: any) => {
    setSelectedPaymentData(groupData);
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

        <BidderProfileHeader
          name="Nguyen Van Huy"
          role="Bidder"
          avatarUrl="/avatar.jfif"
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <BidderSidebar />

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
              {paymentData[activeTab].map((group, idx) => (
                <PaymentGroup 
                  key={idx} 
                  date={group.date} 
                  items={group.items} 
                  status={activeTab} 
                  onPay={handleOpenPayment}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} onSubmit={() => {}} />
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onConfirm={() => setIsEditOpen(false)} initialData={{ fullname: "Nguyen Van Huy", email: "huy@gmail.com", phone: "123", street: "96", province: "HCM", ward: "Thu Duc" }} />
      
      {/* Modal thanh toán nhận data động */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        data={selectedPaymentData}
      />

      <Footer />
    </div>
  );
}