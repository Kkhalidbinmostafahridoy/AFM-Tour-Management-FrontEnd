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
        <div className="rounded-xl border border-border/60 bg-background/90 p-4 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 font-semibold text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-muted-foreground capitalize">
                {entry.name}:
              </span>
              <span className="font-bold text-foreground">
                {entry.name === "revenue"
                  ? `৳${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
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
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 bg-muted/20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">
          Loading Dashboard Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 p-4 md:p-8 bg-gradient-to-br from-background to-muted/20">
      {/* Header Section with Live Watch */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card/60 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {getGreeting()}, Admin 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your tours today.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-inner">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">
              Live Watch
            </p>
            <p className="font-mono text-xl font-bold tracking-tight text-primary">
              {currentTime.toLocaleTimeString("en-US", { hour12: true })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
          >
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bgLight} ${stat.textColor} shadow-sm transition-transform duration-300 group-hover:rotate-12`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.trend}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        {/* Revenue Chart */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Activity className="h-5 w-5 text-primary" />
                Revenue Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Monthly revenue breakdown
              </p>
            </div>
            <button className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[320px] w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `৳${value / 1000}k`}
                  />
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "#cbd5e1",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={4}
                    fill="url(#colorRevenue)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-center text-muted-foreground">
                <Wallet className="mb-3 h-10 w-10 opacity-40" />
                <p className="font-medium">No revenue data available</p>
                <p className="text-xs">
                  Data will appear here once bookings are made.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Ticket className="h-5 w-5 text-emerald-500" />
                Bookings Trend
              </h3>
              <p className="text-sm text-muted-foreground">
                Monthly tour reservations
              </p>
            </div>
            <button className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[320px] w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorBookings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#059669"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
                  />
                  <Bar
                    dataKey="bookings"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                    animationDuration={1500}
                  >
                    {monthlyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorBookings)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-center text-muted-foreground">
                <Ticket className="mb-3 h-10 w-10 opacity-40" />
                <p className="font-medium">No booking data available</p>
                <p className="text-xs">
                  Data will appear here once bookings are made.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
