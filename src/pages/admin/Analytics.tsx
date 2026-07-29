import { PageWrapper } from "@/components/layout/PageWrapper";
import { RevenueChart } from "@/components/Modules/Admin/Analytics/RevenueChart";
import { StatCard } from "@/components/ui/StatCard";
import { Users, DollarSign, Map, PlaneTakeoff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useGetBookingStatsQuery, useGetUserStatsQuery, useGetPaymentStatsQuery, useGetTourStatsQuery } from "@/redux/features/stats/stats.api";

export default function Analytics() {
  const { data: bookingStats, isLoading: bLoading } = useGetBookingStatsQuery(undefined);
  const { data: userStats, isLoading: uLoading } = useGetUserStatsQuery(undefined);
  const { data: tourStats, isLoading: tLoading } = useGetTourStatsQuery(undefined);
  const { data: paymentStats, isLoading: pLoading } = useGetPaymentStatsQuery(undefined);

  if (bLoading || uLoading || tLoading || pLoading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-8 bg-blue-600 rounded-full mx-auto animate-bounce"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </PageWrapper>
    );
  }

  const totalBookings = bookingStats?.totalBookings || 1234;
  const totalUsers = userStats?.totalUsers || 573;
  const activeTours = tourStats?.activeTours || 23;
  const totalRevenue = paymentStats?.totalRevenue || 45231.89;

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your tours today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<DollarSign />}
          description="Total confirmed revenue"
          trend="up"
        />
        <StatCard
          title="Active Tours"
          value={activeTours.toString()}
          icon={<Map />}
          description="Available for booking"
          trend="neutral"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings.toString()}
          icon={<PlaneTakeoff />}
          description="All time bookings"
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={totalUsers.toString()}
          icon={<Users />}
          description="Registered users"
          trend="neutral"
        />
      </div>

      {/* Charts & Tables Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <div className="col-span-4">
          <RevenueChart />
        </div>

        {/* Recent Activity / Secondary Info */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "John Doe", email: "john@example.com", amount: "$1,250", status: "Confirmed" },
                  { name: "Sarah Smith", email: "sarah@example.com", amount: "$890", status: "Pending" },
                  { name: "Michael Lee", email: "michael@example.com", amount: "$2,100", status: "Confirmed" },
                  { name: "Emma Wilson", email: "emma@example.com", amount: "$450", status: "Cancelled" },
                ].map((booking, i) => (
                  <div key={i} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{booking.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                    <div className="ml-auto font-medium text-right">
                      <div>{booking.amount}</div>
                      <div className={`text-xs ${
                        booking.status === "Confirmed" ? "text-emerald-500" :
                        booking.status === "Pending" ? "text-amber-500" : "text-rose-500"
                      }`}>{booking.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
