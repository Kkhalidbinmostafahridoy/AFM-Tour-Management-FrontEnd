import { Outlet, Link, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";

export default function AdminLayout() {
  const { data: user, isLoading } = useUserInfoQuery(undefined);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Admin...
      </div>
    );
  }

  // Very basic authorization check
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
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
    { name: "Dashboard", path: "/admin" },
    { name: "Guides", path: "/admin/guides" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "CMS (Banners/FAQ)", path: "/admin/cms" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col hidden md:flex shrink-0 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-black text-white">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4 md:px-8 flex justify-between items-center shrink-0">
          <h1 className="text-xl font-bold text-gray-800">
            {navItems.find((i) => i.path === location.pathname)?.name ||
              "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              {user?.name}
            </span>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
