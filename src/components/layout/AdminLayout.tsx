import { Outlet, Link, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import {
  LayoutDashboard,
  Map,
  Users,
  Ticket,
  Heart,
  LifeBuoy,
  KeyRound,
  BarChart3,
  Plane,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const { data: user, isLoading } = useUserInfoQuery(undefined);
  const location = useLocation();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading Admin...
      </div>
    );

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center p-6">
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You do not have permission to view the Admin Dashboard.
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "All Tours", path: "/admin/tours", icon: Plane },
    { name: "Divisions", path: "/admin/divisions", icon: Map },
    { name: "Manage Guides", path: "/admin/guides", icon: Users },
    { name: "My Bookings", path: "/admin/my-bookings", icon: Ticket },
    { name: "My Wishlist", path: "/admin/my-wishlist", icon: Heart },
    { name: "Support Tickets", path: "/admin/support", icon: LifeBuoy },
    { name: "Change Password", path: "/admin/change-password", icon: KeyRound },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl">
            A
          </div>
          <h2 className="text-xl font-black tracking-tight">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-4 md:px-8 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-xl font-bold text-slate-900 capitalize">
            {navItems.find((i) => i.path === location.pathname)?.name ||
              "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-green-500 font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
              Live Updates Active
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
