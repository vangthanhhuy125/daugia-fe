"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Sidebar } from "@/components/Sidebar";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { CreateAuctionModal } from "@/components/CreateAuctionModal";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function SellerProfilePage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [avatar, setAvatar] = useState("/avatar.jfif");
  const [memberSince, setMemberSince] = useState("");

  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
    street: "",
    province: "",
    ward: "",
  });

  useEffect(() => {
    userService.getMe()
      .then((res) => {
        if (res.data) {
          setUserData({
            fullname: res.data.fullName || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            street: res.data.street || "",
            province: res.data.province || "",
            ward: res.data.ward || "",
          });
          if (res.data.avatarUrl) setAvatar(res.data.avatarUrl);
          if (res.data.createdAt) {
            setMemberSince(new Date(res.data.createdAt).getFullYear().toString());
          }
        }
      })
      .catch(console.error);
  }, []);

  const profileData = [
    { label: "Fullname:", value: userData.fullname },
    { label: "Email:", value: userData.email, isLink: true },
    { label: "Phone number:", value: userData.phone },
    { label: "Address:", value: [userData.street, userData.ward, userData.province].filter(Boolean).join(", ") },
    { label: "Member since:", value: memberSince },
  ];

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white`}>
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-[900] text-gray-900">User Profile</h1>
          <p className="text-sm font-medium text-gray-400">Home {'>'} User Profile</p>
        </div>
        <ProfileHeader 
          name={userData.fullname}
          role="Seller"
          avatarUrl={avatar}
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditModalOpen(true)}
          onCreateAuctionClick={() => setIsCreateModalOpen(true)}
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <Sidebar />
          <section className="md:col-span-9 space-y-6">
            {profileData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-8 text-[15px]">
                <span className="font-black text-[#0f172a] whitespace-nowrap">{row.label}</span>
                <span className={`font-medium md:col-span-3 ${row.isLink ? "text-blue-600 underline cursor-pointer" : "text-gray-700"} leading-relaxed`}>
                  {row.value}
                </span>
              </div>
            ))}
          </section>
        </div>
      </main>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} onSubmit={() => {}} />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={userData}
        onConfirm={async (newData) => {
          try {
            const translateAddress = (text: string) => {
              if (!text) return "";
              return text
                .replace(/Thành phố/g, "City")
                .replace(/Tỉnh/g, "Province")
                .replace(/Quận|Huyện/g, "District")
                .replace(/Phường|Xã/g, "Ward")
                .replace(/Đường/g, "Street");
            };

            const translatedStreet = translateAddress(newData.street);
            const translatedProvince = translateAddress(newData.province);
            const translatedWard = translateAddress(newData.ward);

            const service = userService as any;
            if (typeof service.updateProfile === "function") {
              await service.updateProfile({
                fullName: typeof newData.fullname === 'object' ? newData.fullname.value : newData.fullname,
                phone: newData.phone,
                street: translatedStreet,
                province: translatedProvince,
                ward: translatedWard,
              });
            }

            const profileRes = await userService.getMe();
            if (profileRes?.data) {
              setUserData({
                fullname: profileRes.data.fullName,
                email: profileRes.data.email,
                phone: profileRes.data.phone,
                street: profileRes.data.street,
                province: profileRes.data.province,
                ward: profileRes.data.ward,
              });
            }

          } catch (error) {
            console.error("Failed to update profile data", error);
            alert("An error occurred while saving your profile.");
          }
        }}
      />
      <CreateAuctionModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <Footer />
    </div>
  );
}