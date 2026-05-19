"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "./StatCard";
import { Gavel, CheckCircle, Trophy, Wallet } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { userService } from "@/services/userService";
import { auctionService } from "@/services/auctionService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

const COLORS = ["#ef4444", "#10b981"];

export default function BidderStatisticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("/avatar.jfif");
  const [stats, setStats] = useState({
    totalBids: 0,
    participated: 0,
    won: 0,
    totalSpent: 0
  });
  const [bidsData, setBidsData] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);

  useEffect(() => {
    userService.getMe()
      .then(res => {
        if (res.data) {
          setUserName(res.data.fullName || "");
          if (res.data.avatarUrl) setAvatar(res.data.avatarUrl);
        }
      })
      .catch(console.error);

    auctionService.searchPublic({ size: 100 })
      .then(() => {
        setStats({
          totalBids: 0,
          participated: 0,
          won: 0,
          totalSpent: 0,
        });
        setBidsData([]);
        setResultsData([]);
      })
      .catch(console.error);
  }, [timeRange]);

  return (
    <div className={`${jost.className} min-h-screen flex flex-col bg-white text-[#1a1a1a]`}>
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <nav className="mb-6">
          <h1 className="text-3xl font-[900]">Statistics</h1>
          <p className="text-sm font-medium text-gray-400">Home {">"} Statistics</p>
        </nav>

        <ProfileHeader
          name={userName}
          role="Bidder"
          avatarUrl={avatar}
          bannerUrl="/banner.jpg"
          onFeedbackClick={() => {}}
          onEditClick={() => {}}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 px-4">
          <Sidebar />

          <section className="md:col-span-9 space-y-12">
            <div>
              <h3 className="text-lg font-[900] text-red-600 mb-6">Overview Cards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard 
                        label="Total Bids" 
                        value={stats.totalBids} 
                        icon={<Gavel className="text-yellow-500" size={28} />} 
                        borderColor="border-yellow-400" 
                        labelColor="text-[#FACC15]"
                    />
                    <StatCard 
                        label="Participated" 
                        value={stats.participated} 
                        icon={<CheckCircle className="text-green-500" size={28} />} 
                        borderColor="border-green-400" 
                        labelColor="text-[#FACC15]"
                    />
                    <StatCard 
                        label="Won" 
                        value={stats.won} 
                        icon={<Trophy className="text-orange-500" size={28} />} 
                        borderColor="border-orange-400"
                        labelColor="text-[#FACC15]"
                    />
                    <StatCard 
                        label="Total Spent" 
                        value={stats.totalSpent} 
                        icon={<Wallet className="text-blue-600" size={28} />} 
                        borderColor="border-blue-600" 
                        labelColor="text-[#FACC15]"
                        unit="VND" 
                    />
                    </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-lg font-[900] text-red-600">Bids Chart</h3>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm font-bold border rounded-full px-4 py-2 bg-gray-50 outline-none"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bidsData}>
                    <XAxis dataKey="date" axisLine={true} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                    <YAxis label={{ value: 'Bids', angle: -90, position: 'insideLeft', fontWeight: 700 }} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    <Bar dataKey="bids" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-[900] text-red-600 mb-6">Auction Results Chart</h3>
              <div className="h-[300px] w-full flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resultsData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {resultsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}