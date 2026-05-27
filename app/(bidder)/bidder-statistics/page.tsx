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
  PieChart, Pie, Cell, Legend, CartesianGrid
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

    auctionService.getMyBidAuctions(0, 999)
      .then(res => {
        const rawAuctions = res.data?.content || [];
        const now = new Date();
        const pastLimitDate = new Date(now);

        if (timeRange === "Last 7 Days") {
          pastLimitDate.setDate(now.getDate() - 7);
        } else if (timeRange === "Last 30 Days") {
          pastLimitDate.setDate(now.getDate() - 30);
        }
        pastLimitDate.setHours(0, 0, 0, 0);

        const filteredAuctions = rawAuctions.filter((item: any) => {
          const targetTime = item.biddingStartTime || item.createdAt;
          if (!targetTime) return false;
          const itemTime = new Date(targetTime).getTime();
          return itemTime >= pastLimitDate.getTime() && itemTime <= now.getTime();
        });

        let totalBidsCount = 0;
        let wonCount = 0;
        let spentSum = 0;
        const uniqueAuctionIds = new Set();

        const bidsGroupedByDate: Record<string, number> = {};

        filteredAuctions.forEach((item: any) => {
          uniqueAuctionIds.add(item.id);
          
          const bidsCount = item.myBidsCount || item.bidsCount || 1; 
          totalBidsCount += bidsCount;

          const targetDate = item.biddingStartTime || item.createdAt;
          if (targetDate) {
            const dateStr = new Date(targetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
            bidsGroupedByDate[dateStr] = (bidsGroupedByDate[dateStr] || 0) + bidsCount;
          }

          const isWinner = item.isWinner ?? item.winner ?? false;
          if (item.status === "ENDED" && isWinner) {
            wonCount += 1;
            const finalPrice = item.winningPrice || item.currentPrice || 0;
            spentSum += finalPrice;
          }
        });

        setStats({
          totalBids: totalBidsCount,
          participated: uniqueAuctionIds.size,
          won: wonCount,
          totalSpent: spentSum
        });

        const formattedBarData = Object.keys(bidsGroupedByDate).map(date => ({
          date: date,
          bids: bidsGroupedByDate[date]
        }));
        
        formattedBarData.sort((a, b) => {
          const [dayA, monthA] = a.date.split('/').map(Number);
          const [dayB, monthB] = b.date.split('/').map(Number);
          return monthA === monthB ? dayA - dayB : monthA - monthB;
        });
        setBidsData(formattedBarData);

        const endedAuctions = filteredAuctions.filter((item: any) => item.status === "ENDED");
        const totalEnded = endedAuctions.length;
        const lostCount = totalEnded - wonCount;

        setResultsData([
          { name: "Lost Auctions", value: totalEnded === 0 ? 0 : lostCount },
          { name: "Won Auctions", value: totalEnded === 0 ? 0 : wonCount }
        ]);
      })
      .catch(err => {
        console.error("Fetch statistics failed:", err);
      });
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
          name={userName || "Loading..."}
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
                  labelColor="text-gray-500"
                />
                <StatCard 
                  label="Participated" 
                  value={stats.participated} 
                  icon={<CheckCircle className="text-green-500" size={28} />} 
                  borderColor="border-green-400" 
                  labelColor="text-gray-500"
                />
                <StatCard 
                  label="Won" 
                  value={stats.won} 
                  icon={<Trophy className="text-orange-500" size={28} />} 
                  borderColor="border-orange-400"
                  labelColor="text-gray-500"
                />
                <StatCard 
                  label="Total Spent" 
                  value={stats.totalSpent.toLocaleString() + " VND"} 
                  icon={<Wallet className="text-blue-600" size={28} />} 
                  borderColor="border-blue-600" 
                  labelColor="text-gray-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-lg font-[900] text-red-600">Bids Chart</h3>
                <div>
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm font-bold border border-gray-200 rounded-full px-5 py-2 bg-[#f8f9fa] outline-none cursor-pointer"
                  >
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-white p-4 border border-gray-100 rounded-[24px] shadow-sm">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bidsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" axisLine={true} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#6b7280'}} dy={8} />
                      <YAxis tickLine={false} axisLine={true} tick={{fontSize: 12, fontWeight: 500, fill: '#6b7280'}} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} />
                      <Bar dataKey="bids" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-[900] text-red-600 mb-6">Auction Results Chart</h3>
              <div className="bg-white p-6 border border-gray-100 rounded-[24px] shadow-sm flex flex-col items-center">
                <div className="h-[300px] w-full max-w-md">
                  {resultsData.length > 0 && (resultsData[0].value > 0 || resultsData[1].value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resultsData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {resultsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 italic text-sm">
                      No ended auctions recorded in this period to display results.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}