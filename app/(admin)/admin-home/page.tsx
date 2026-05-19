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
    userService.getMe()
      .then(res => {
        if (res.data) {
          setAdminData({
            fullname: res.data.fullName || "Admin",
            role: res.data.role?.name || "ADMIN",
          });
        }
      })
      .catch(console.error);
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