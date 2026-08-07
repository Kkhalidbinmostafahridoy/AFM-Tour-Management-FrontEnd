import { motion } from "framer-motion";
import { Users, Calendar, Star, DollarSign } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function GuideDashboard() {
  const stats = [
    { label: "Total Earnings", value: "$4,250", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Assigned Tours", value: "12", icon: Calendar, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Total Tourists", value: "245", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Avg Rating", value: "4.9", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  const upcomingTours = [
    { id: 1, title: "Sundarban Adventure", date: "Oct 15, 2026", tourists: 14, status: "Upcoming" },
    { id: 2, title: "Sylhet Tea Gardens", date: "Oct 22, 2026", tourists: 8, status: "Upcoming" },
  ];

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Guide Overview
          </h1>
          <p className="text-[#9ca3af] mt-1 text-sm">Welcome back! Here's your tour performance.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-xl glass-panel flex items-center gap-4 hover-3d-tilt"
            data-cursor="card"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Tours Preview */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel p-6" data-cursor="card">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" /> My Upcoming Tours
        </h2>
        <div className="space-y-4">
          {upcomingTours.map((tour) => (
            <div key={tour.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div>
                <h4 className="font-bold text-white text-lg">{tour.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{tour.date} • {tour.tourists} Tourists</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {tour.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
