// import { useState, useEffect } from "react";
// import {
//   useGetBookingStatsQuery,
//   useGetPaymentStatsQuery,
//   useGetUserStatsQuery,
//   useGetTourStatsQuery,
// } from "@/redux/features/stats/stats.api";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Cell,
// } from "recharts";
// import { motion } from "framer-motion";
// import {
//   Users,
//   Ticket,
//   Map,
//   Wallet,
//   Clock,
//   TrendingUp,
//   CalendarDays,
//   Activity,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const { data: bookingStats, isLoading: bLoading } =
//     useGetBookingStatsQuery(undefined);
//   const { data: userStats, isLoading: uLoading } =
//     useGetUserStatsQuery(undefined);
//   const { data: tourStats, isLoading: tLoading } =
//     useGetTourStatsQuery(undefined);
//   const { data: paymentStats, isLoading: pLoading } =
//     useGetPaymentStatsQuery(undefined);

//   // Live Watch State
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   if (bLoading || uLoading || tLoading || pLoading) {
//     return (
//       <div className="flex h-[80vh] items-center justify-center space-x-2">
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="h-4 w-4 rounded-full bg-blue-600"
//         />
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//           transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
//           className="h-4 w-4 rounded-full bg-indigo-600"
//         />
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//           transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
//           className="h-4 w-4 rounded-full bg-purple-600"
//         />
//       </div>
//     );
//   }

//   // Robust data extraction
//   const totalBookings =
//     bookingStats?.totalBooking ?? bookingStats?.totalBookings ?? 0;
//   const totalUsers = userStats?.totalUsers ?? 0;
//   const activeTours = tourStats?.totalTour ?? tourStats?.activeTours ?? 0;

//   const revenueData = paymentStats?.totalRevenue;
//   const totalRevenue =
//     Array.isArray(revenueData) && revenueData.length > 0
//       ? revenueData[0].totalRevenue
//       : typeof revenueData === "number"
//         ? revenueData
//         : 0;

//   // Fallback monthly data for charts if backend doesn't provide it yet
//   const monthlyData = bookingStats?.monthlyData || [
//     { name: "Jan", bookings: 120, revenue: 15000 },
//     { name: "Feb", bookings: 150, revenue: 18000 },
//     { name: "Mar", bookings: 180, revenue: 22000 },
//     { name: "Apr", bookings: 220, revenue: 26000 },
//     { name: "May", bookings: 190, revenue: 24000 },
//     { name: "Jun", bookings: 250, revenue: 31000 },
//   ];

//   const getGreeting = () => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   const statCards = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       icon: Users,
//       color: "from-blue-500 to-cyan-400",
//       bgLight: "bg-blue-50/50",
//       textColor: "text-blue-600",
//       trend: "+12.5%",
//       trendUp: true,
//     },
//     {
//       title: "Total Bookings",
//       value: totalBookings,
//       icon: Ticket,
//       color: "from-emerald-500 to-teal-400",
//       bgLight: "bg-emerald-50/50",
//       textColor: "text-emerald-600",
//       trend: "+8.2%",
//       trendUp: true,
//     },
//     {
//       title: "Active Tours",
//       value: activeTours,
//       icon: Map,
//       color: "from-purple-500 to-indigo-400",
//       bgLight: "bg-purple-50/50",
//       textColor: "text-purple-600",
//       trend: "+3.1%",
//       trendUp: true,
//     },
//     {
//       title: "Total Revenue",
//       value: `৳${totalRevenue.toLocaleString()}`,
//       icon: Wallet,
//       color: "from-orange-500 to-amber-400",
//       bgLight: "bg-orange-50/50",
//       textColor: "text-orange-600",
//       trend: "+15.3%",
//       trendUp: true,
//     },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: { type: "spring" as const, stiffness: 300, damping: 24 },
//     },
//   };

//   const CustomTooltip = ({
//     active,
//     payload,
//     label,
//   }: {
//     active?: boolean;
//     payload?: {
//       name: string;
//       value: number | string;
//       color?: string;
//       fill?: string;
//     }[];
//     label?: string;
//   }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="rounded-xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-md">
//           <p className="mb-2 font-semibold text-gray-800">{label}</p>
//           {payload.map(
//             (
//               entry: {
//                 name: string;
//                 value: number | string;
//                 color?: string;
//                 fill?: string;
//               },
//               index: number,
//             ) => (
//               <div key={index} className="flex items-center gap-2 text-sm">
//                 <div
//                   className="h-3 w-3 rounded-full"
//                   style={{ backgroundColor: entry.color || entry.fill }}
//                 />
//                 <span className="text-gray-600 capitalize">{entry.name}:</span>
//                 <span className="font-bold text-gray-900">
//                   {entry.name === "revenue"
//                     ? `৳${entry.value.toLocaleString()}`
//                     : entry.value}
//                 </span>
//               </div>
//             ),
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen space-y-8 bg-gray-50/30 p-4 md:p-8">
//       {/* Header Section with Live Watch */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between"
//       >
//         <div>
//           <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-extrabold text-transparent">
//             {getGreeting()}, Admin 👋
//           </h1>
//           <p className="mt-1 text-gray-500">
//             Here's what's happening with your tours today.
//           </p>
//         </div>

//         <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-inner">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
//             <Clock className="h-6 w-6 animate-pulse" />
//           </div>
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
//               Live Watch
//             </p>
//             <p className="font-mono text-xl font-bold text-indigo-950">
//               {currentTime.toLocaleTimeString("en-US", { hour12: true })}
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Stat Cards */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
//       >
//         {statCards.map((stat, index) => (
//           <motion.div
//             key={index}
//             variants={itemVariants}
//             whileHover={{ y: -5, scale: 1.02 }}
//             className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
//           >
//             <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-40" />
//             <div
//               className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10`}
//             />

//             <div className="relative z-10 flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   {stat.title}
//                 </p>
//                 <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
//                   {stat.value}
//                 </h3>
//               </div>
//               <div
//                 className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bgLight} ${stat.textColor} shadow-sm transition-transform duration-300 group-hover:rotate-12`}
//               >
//                 <stat.icon className="h-6 w-6" />
//               </div>
//             </div>

//             <div className="mt-4 flex items-center gap-2">
//               <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
//                 <TrendingUp className="h-3 w-3" />
//                 <span>{stat.trend}</span>
//               </div>
//               <span className="text-xs text-gray-400">vs last month</span>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Charts Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4 }}
//         className="grid grid-cols-1 gap-8 lg:grid-cols-2"
//       >
//         {/* Revenue Chart */}
//         <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl">
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
//                 <Activity className="h-5 w-5 text-blue-500" />
//                 Revenue Overview
//               </h3>
//               <p className="text-sm text-gray-500">Monthly revenue breakdown</p>
//             </div>
//             <button className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900">
//               <CalendarDays className="h-4 w-4" />
//             </button>
//           </div>

//           <div className="h-[320px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={monthlyData}
//                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
//                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
//                   </linearGradient>
//                 </defs>
//                 <XAxis
//                   dataKey="name"
//                   stroke="#94a3b8"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                   dy={10}
//                 />
//                 <YAxis
//                   stroke="#94a3b8"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                   tickFormatter={(value) => `৳${value / 1000}k`}
//                 />
//                 <CartesianGrid
//                   strokeDasharray="4 4"
//                   vertical={false}
//                   stroke="#e2e8f0"
//                 />
//                 <RechartsTooltip
//                   content={<CustomTooltip />}
//                   cursor={{
//                     stroke: "#cbd5e1",
//                     strokeWidth: 1,
//                     strokeDasharray: "4 4",
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#3b82f6"
//                   strokeWidth={4}
//                   fill="url(#colorRevenue)"
//                   animationDuration={1500}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Bookings Chart */}
//         <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl">
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
//                 <Ticket className="h-5 w-5 text-emerald-500" />
//                 Bookings Trend
//               </h3>
//               <p className="text-sm text-gray-500">Monthly tour reservations</p>
//             </div>
//             <button className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900">
//               <CalendarDays className="h-4 w-4" />
//             </button>
//           </div>

//           <div className="h-[320px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={monthlyData}
//                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient
//                     id="colorBookings"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
//                     <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
//                   </linearGradient>
//                 </defs>
//                 <XAxis
//                   dataKey="name"
//                   stroke="#94a3b8"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                   dy={10}
//                 />
//                 <YAxis
//                   stroke="#94a3b8"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <CartesianGrid
//                   strokeDasharray="4 4"
//                   vertical={false}
//                   stroke="#e2e8f0"
//                 />
//                 <RechartsTooltip
//                   content={<CustomTooltip />}
//                   cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
//                 />
//                 <Bar
//                   dataKey="bookings"
//                   radius={[6, 6, 0, 0]}
//                   barSize={40}
//                   animationDuration={1500}
//                 >
//                   {monthlyData.map(
//                     (
//                       _: { name: string; bookings: number; revenue: number },
//                       index: number,
//                     ) => (
//                       <Cell key={`cell-${index}`} fill="url(#colorBookings)" />
//                     ),
//                   )}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  useGetBookingStatsQuery,
  useGetPaymentStatsQuery,
  useGetUserStatsQuery,
  useGetTourStatsQuery,
} from "@/redux/features/stats/stats.api";
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
    </div>
  );
}

