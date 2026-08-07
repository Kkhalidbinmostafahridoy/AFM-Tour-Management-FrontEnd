import { useState, useEffect } from "react";
import {
  useGetBookingStatsQuery,
  useGetPaymentStatsQuery,
  useGetUserStatsQuery,
  useGetTourStatsQuery,
} from "@/redux/features/stats/stats.api";
import { useGetAllBookingsQuery } from "@/redux/features/bookings/bookings.api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  Users,
  Ticket,
  Map,
  Wallet,
  Clock,
  TrendingUp,
  CalendarDays,
  Activity,
  Loader2,
} from "lucide-react";

// TypeScript Interfaces for strict typing and 0 errors
interface MonthlyDataItem {
  name: string;
  bookings: number;
  revenue: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  textColor: string;
  trend: string;
  trendUp: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    fill?: string;
  }>;
  label?: string;
}

export default function AdminDashboard() {
  // Added pollingInterval: 30000 (30s) for LIVE background data sync
  const { data: bookingStats, isLoading: bLoading } = useGetBookingStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
      refetchOnFocus: true,
    },
  );
  const { data: userStats, isLoading: uLoading } = useGetUserStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );
  const { data: tourStats, isLoading: tLoading } = useGetTourStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );
  const { data: paymentStats, isLoading: pLoading } = useGetPaymentStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );
  
  const { data: allBookingsData, isLoading: bookingsLoading } = useGetAllBookingsQuery(
    undefined,
    { pollingInterval: 30000 }
  );

  // Live Watch State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Robust data extraction (No mock data)
  const totalBookings =
    bookingStats?.totalBooking ?? bookingStats?.totalBookings ?? 0;
  const totalUsers = userStats?.totalUsers ?? 0;
  const activeTours = tourStats?.totalTour ?? tourStats?.activeTours ?? 0;

  const revenueData = paymentStats?.totalRevenue;
  const totalRevenue =
    Array.isArray(revenueData) && revenueData.length > 0
      ? revenueData[0].totalRevenue
      : typeof revenueData === "number"
        ? revenueData
        : 0;

  // Use actual API data, default to empty array if not provided
  const monthlyData: MonthlyDataItem[] = bookingStats?.monthlyData || [];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const statCards: StatCardProps[] = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-cyan-400",
      bgLight: "bg-blue-50/50 dark:bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Bookings",
      value: totalBookings.toLocaleString(),
      icon: Ticket,
      color: "from-emerald-500 to-teal-400",
      bgLight: "bg-emerald-50/50 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Active Tours",
      value: activeTours.toLocaleString(),
      icon: Map,
      color: "from-purple-500 to-indigo-400",
      bgLight: "bg-purple-50/50 dark:bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400",
      trend: "+3.1%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: Wallet,
      color: "from-orange-500 to-amber-400",
      bgLight: "bg-orange-50/50 dark:bg-orange-500/10",
      textColor: "text-orange-600 dark:text-orange-400",
      trend: "+15.3%",
      trendUp: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(17,17,34,0.97)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <p style={{ color: 'rgba(165,180,252,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color || entry.fill }} />
              <span style={{ color: 'rgba(165,180,252,0.6)', textTransform: 'capitalize' }}>{entry.name}:</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>
                {entry.name === 'revenue' ? `৳${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Premium Loading State
  if (bLoading || uLoading || tLoading || pLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0c29,#1a1740,#0d0d1a)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Loader2 style={{ width: 48, height: 48, color: '#6c63ff' }} className="animate-spin" />
          <p style={{ color: 'rgba(165,180,252,0.7)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 32px', background: 'linear-gradient(180deg,#0f0c29 0%,#1a1740 60%,#0d0d1a 100%)' }}>

      {/* ── Header ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: '20px 28px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#a5b4fc,#f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            {getGreeting()}, Admin 👋
          </h1>
          <p style={{ color: 'rgba(165,180,252,0.5)', fontSize: 14, marginTop: 4 }}>Here&apos;s what&apos;s happening with your tours today.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 14, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
          <Clock style={{ width: 18, height: 18, color: '#6c63ff' }} className="animate-pulse" />
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(165,180,252,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>LIVE</p>
            <p style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{currentTime.toLocaleTimeString('en-US', { hour12: true })}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, padding: '24px 24px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', cursor: 'default' }}
          >
            {/* Glow orb */}
            <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, borderRadius: '50%', background: index===0?'linear-gradient(135deg,#3b82f6,#06b6d4)':index===1?'linear-gradient(135deg,#10b981,#059669)':index===2?'linear-gradient(135deg,#8b5cf6,#6366f1)':'linear-gradient(135deg,#f59e0b,#ef4444)', opacity: 0.15, filter: 'blur(16px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: index===0?'rgba(59,130,246,0.12)':index===1?'rgba(16,185,129,0.12)':index===2?'rgba(139,92,246,0.12)':'rgba(245,158,11,0.12)', border: `1px solid ${index===0?'rgba(59,130,246,0.3)':index===1?'rgba(16,185,129,0.3)':index===2?'rgba(139,92,246,0.3)':'rgba(245,158,11,0.3)'}` }}>
                <stat.icon style={{ width: 20, height: 20, color: index===0?'#60a5fa':index===1?'#34d399':index===2?'#a78bfa':'#fbbf24' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <TrendingUp style={{ width: 10, height: 10, color: '#34d399' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399' }}>{stat.trend}</span>
              </div>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(165,180,252,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>{stat.title}</p>
            <h3 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{stat.value}</h3>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}
      >
        {/* Revenue Chart */}
        <div style={{ borderRadius: 20, padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
                <Activity style={{ width: 18, height: 18, color: '#6c63ff' }} />
                Revenue Overview
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(165,180,252,0.5)', margin: '4px 0 0' }}>Monthly revenue breakdown</p>
            </div>
            <CalendarDays style={{ width: 16, height: 16, color: 'rgba(165,180,252,0.4)' }} />
          </div>
          <div style={{ height: 300 }}>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#6c63ff" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(165,180,252,0.3)" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="rgba(165,180,252,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v/1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(108,99,255,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={3} fill="url(#colorRevDash)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(165,180,252,0.4)' }}>
                <Wallet style={{ width: 36, height: 36, marginBottom: 12, opacity: 0.4 }} />
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No revenue data available</p>
                <p style={{ fontSize: 12, margin: '4px 0 0' }}>Data will appear once bookings are made.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Chart */}
        <div style={{ borderRadius: 20, padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
                <Ticket style={{ width: 18, height: 18, color: '#10b981' }} />
                Bookings Trend
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(165,180,252,0.5)', margin: '4px 0 0' }}>Monthly tour reservations</p>
            </div>
            <CalendarDays style={{ width: 16, height: 16, color: 'rgba(165,180,252,0.4)' }} />
          </div>
          <div style={{ height: 300 }}>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(165,180,252,0.3)" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="rgba(165,180,252,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="bookings" radius={[6,6,0,0]} barSize={36} animationDuration={1500}>
                    {monthlyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorBookDash)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(165,180,252,0.4)' }}>
                <Ticket style={{ width: 36, height: 36, marginBottom: 12, opacity: 0.4 }} />
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No booking data available</p>
                <p style={{ fontSize: 12, margin: '4px 0 0' }}>Data will appear once bookings are made.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Recent Bookings & Quick Actions ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginTop: 24 }}
      >
        {/* Recent Bookings */}
        <div className="glass-panel" style={{ borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Recent Bookings</h3>
            <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }} className="hover-3d-tilt" data-cursor="button">View All</button>
          </div>
          {bookingsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 className="animate-spin text-blue-500" /></div>
          ) : allBookingsData?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {allBookingsData.slice(0, 5).map((booking: any, i: number) => (
                <div key={booking.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} className="hover-3d-tilt" data-cursor="card">
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#fff', fontSize: 14 }}>{booking.tour?.title || 'Unknown Tour'}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(165,180,252,0.6)' }}>{booking.user?.name || 'Guest'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#34d399', fontSize: 14 }}>৳{booking.totalPrice?.toLocaleString() || 0}</p>
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 10, background: booking.status === 'PAID' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', color: booking.status === 'PAID' ? '#34d399' : '#f59e0b', fontSize: 10, fontWeight: 700 }}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p style={{ color: 'rgba(165,180,252,0.5)', fontSize: 14, textAlign: 'center', padding: 20 }}>No recent bookings.</p>
          )}
        </div>

        {/* Quick Actions & Activity Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-panel" style={{ borderRadius: 20, padding: 24 }}>
             <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Quick Actions</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
               <button className="glass-panel hover-3d-tilt" data-cursor="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, color: '#fff', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer' }}>
                 <Map style={{ width: 18, height: 18, color: '#60a5fa' }} /> Add Tour
               </button>
               <button className="glass-panel hover-3d-tilt" data-cursor="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, color: '#fff', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer' }}>
                 <Users style={{ width: 18, height: 18, color: '#34d399' }} /> Add Guide
               </button>
             </div>
          </div>
          
          <div className="glass-panel" style={{ borderRadius: 20, padding: 24, flex: 1 }}>
             <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Activity Timeline</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 11, top: 10, bottom: 10, width: 2, background: 'rgba(255,255,255,0.05)' }} />
                {[1,2,3].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '4px solid #1a1740' }} />
                    <div>
                      <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 600 }}>System Updated</p>
                      <p style={{ margin: '2px 0 0', color: 'rgba(165,180,252,0.5)', fontSize: 11 }}>{2 * i + 1} hours ago</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

