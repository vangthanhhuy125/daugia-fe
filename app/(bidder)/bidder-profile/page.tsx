"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Sidebar } from "@/components/Sidebar";
import { FeedbackModal } from "@/components/FeedbackModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function UserProfilePage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
    street: "",
    province: "",
    ward: ""
  });

  const [displayRole, setDisplayRole] = useState("Bidder");
  const [memberSince, setMemberSince] = useState("");
  const [avatar, setAvatar] = useState("/avatar.jfif");

  useEffect(() => {
    userService.getProfile("")
      .then(res => {
        if (res.data) {
          setUserData({
            fullname: res.data.fullName || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            street: res.data.street || "",
            province: res.data.province ||"",
            ward: res.data.ward ||""
          });
          if (res.data.role?.name) {
            setDisplayRole(res.data.role.name);
          }
          if (res.data.createdAt) {
            setMemberSince(new Date(res.data.createdAt).getFullYear().toString());
          }
          if (res.data.avatarUrl) {
            setAvatar(res.data.avatarUrl);
          }
        }
      })
      .catch(console.error);
  }, []);

  const profileData = [
    { label: "Fullname:", value: userData.fullname },
    { label: "Email:", value: userData.email, isLink: true },
    { label: "Phone number:", value: userData.phone },
    { label: "Address:", value: `${userData.street || ""}${userData.ward ? `, ${userData.ward}` : ""}${userData.province ? `, ${userData.province}` : ""}` },
    { label: "Member since:", value: memberSince },
  ];

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white`}>
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
           <h1 className="text-3xl font-[900] text-gray-900">User Profile</h1>
           <p className="text-sm font-medium text-gray-400">Home {'>'} <span className="text-gray-400">User Profile</span></p>
        </div>

        <ProfileHeader 
          name={userData.fullname}
          role={displayRole}
          avatarUrl={avatar}
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <Sidebar />

          <section className="md:col-span-9 space-y-8">
            {profileData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-8 text-lg">
                <span className="font-black text-[#0f172a] whitespace-nowrap">{row.label}</span>
                <span className={`font-medium md:col-span-3 ${row.isLink ? "text-blue-600 underline cursor-pointer" : "text-gray-700"} leading-relaxed`}>
                  {row.value}
                </span>
              </div>
            ))}
          </section>
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

      <Footer />
    </div>
  );
}