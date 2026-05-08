"use client";

import React, { useState } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Sidebar } from "@/components/Sidebar";
import { OverviewCards } from "./OverviewCards";
import { PopularAuctions } from "./PopularAuctions";
import { RevenueChart } from "./RevenueChart";
import { CategoryTable } from "./CategoryTable"; 
import { ManageProductsTable } from "./ManageProductsTable"; 
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { CreateAuctionModal } from "@/components/CreateAuctionModal";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function SellerStatisticsPage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    fullname: "Nguyen Van Huy",
    email: "nguyenvanhuy@gmail.com",
    phone: "0123456789",
    street: "No. 96, Street No. 12, Block 5",
    province: "Ho Chi Minh City",
    ward: "Thu Duc Ward"
  });

  return (
    <div className={`${jost.className} min-h-screen bg-white`}>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <nav className="mb-6">
           <h1 className="text-3xl font-[900]">Statistics</h1>
           <p className="text-sm text-gray-400 font-medium">Home &gt; Statistics</p>
        </nav>

        <ProfileHeader 
          name={userData.fullname}
          role="Seller" 
          avatarUrl="/avatar.jfif"
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditModalOpen(true)}
          onCreateAuctionClick={() => setIsCreateModalOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <Sidebar />
          
          <div className="md:col-span-9 space-y-12">
            <OverviewCards />
            <PopularAuctions />
            <RevenueChart />
            <CategoryTable />
            <ManageProductsTable />
          </div>
        </div>
      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={(val) => console.log("Feedback:", val)}
      />

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={userData}
        onConfirm={(newData) => {
          setUserData(newData);
          setIsEditModalOpen(false);
        }}
      />

      <CreateAuctionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <Footer />
    </div>
  );
}