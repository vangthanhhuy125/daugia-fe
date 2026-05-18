"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { OverviewCards } from "./OverviewCards";
import { PopularAuctions } from "./PopularAuctions";
import { AdminCharts } from "./Charts";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function AdminHomePage() {
  const [adminData, setAdminData] = useState({
    fullname: "",
    role: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await userService.getAllUsers(0, 1);
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
          const detailRes = await userService.getUserById(currentUserId);
          if (detailRes.data) {
            setAdminData({
              fullname: detailRes.data.fullName,
              role: detailRes.data.role?.name || "",
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminProfile();
  }, []);

  return (
    <div className={`${jost.className} min-h-screen bg-white`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
          <div className="md:col-span-3">
            <Sidebar />
          </div>
          
          <div className="md:col-span-9 pl-0 space-y-16">
            
            <section>
              <OverviewCards />
            </section>

            <section>
              <PopularAuctions />
            </section>

            <section className="space-y-12">
              <AdminCharts />
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}