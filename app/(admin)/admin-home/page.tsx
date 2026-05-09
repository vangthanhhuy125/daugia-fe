"use client";

import React, { useState } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { OverviewCards } from "./OverviewCards";
import { PopularAuctions } from "./PopularAuctions";
import { AdminCharts } from "./Charts";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export default function AdminHomePage() {
  const [adminData] = useState({
    fullname: "Admin Huy",
    role: "Administrator",
  });

  return (
    <div className={`${jost.className} min-h-screen bg-white`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
          {/* Sidebar giữ nguyên cột */}
          <div className="md:col-span-3">
            <Sidebar />
          </div>
          
          {/* Main content: pl-0 để sát lề trái, thẳng hàng với Sidebar */}
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