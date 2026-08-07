import { useState, useMemo } from "react";
import { useGetAllUsersQuery, useUpdateUserMutation } from "@/redux/features/user/user.api";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, User, ShieldCheck, UserCog, Mail, Phone, MapPin, Activity, AlertTriangle, Loader2 } from "lucide-react";

export default function ManageUsers() {
  const { data: allUsers = [], isLoading } = useGetAllUsersQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"CUSTOMER" | "ADMIN" | "TOUR_MANAGER">("CUSTOMER");

  const filteredUsers = useMemo(() => {
    let users = allUsers;
    // Filter by Role
    if (activeTab === "CUSTOMER") users = users.filter((u: any) => u.role === "USER" || u.role === "CUSTOMER");
    if (activeTab === "ADMIN") users = users.filter((u: any) => u.role === "ADMIN" || u.role === "SUPER_ADMIN");
    if (activeTab === "TOUR_MANAGER") users = users.filter((u: any) => u.role === "TOUR_MANAGER");

    // Filter by Search Term
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      users = users.filter(
        (u: any) =>
          (u.name || "").toLowerCase().includes(query) ||
          (u.email || "").toLowerCase().includes(query)
      );
    }
    return users;
  }, [allUsers, activeTab, searchTerm]);

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
      await updateUser({ id: userId, data: { status: newStatus } }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#222222] border border-[#2a2a2a] shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            User Management
          </h1>
          <p className="text-[#9ca3af] mt-1 text-sm">Manage Customers, Admins, and Tour Managers.</p>
        </div>
        <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-[#3a3a3a]">
          <button
            onClick={() => setActiveTab("CUSTOMER")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "CUSTOMER" ? "bg-[#3b82f6] text-white shadow-md" : "text-[#9ca3af] hover:text-white"}`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("TOUR_MANAGER")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "TOUR_MANAGER" ? "bg-[#8b5cf6] text-white shadow-md" : "text-[#9ca3af] hover:text-white"}`}
          >
            Tour Managers
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "ADMIN" ? "bg-[#f59e0b] text-white shadow-md" : "text-[#9ca3af] hover:text-white"}`}
          >
            Admins
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel">
        <div className="bg-[#2a2a2a]/50 border-b border-[#3a3a3a] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            {activeTab === "CUSTOMER" ? <User className="size-4 text-blue-500" /> : activeTab === "ADMIN" ? <ShieldCheck className="size-4 text-amber-500" /> : <UserCog className="size-4 text-violet-500" />}
            {activeTab === "CUSTOMER" ? "Customers List" : activeTab === "ADMIN" ? "Admins List" : "Tour Managers List"}
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 size-4 text-[#666666]" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#1a1a1a] border-[#3a3a3a] text-white focus:border-[#3b82f6] transition-all"
            />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin size-8 text-blue-500" /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-[#666666]">
              <AlertTriangle className="size-6 mx-auto mb-2" />
              <p className="text-sm font-medium">No users found in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user: any) => (
                <div key={user._id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:border-[#3a3a3a] glass-panel hover-3d-tilt" data-cursor="card">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-[#666666] font-mono flex items-center gap-1 mt-1">
                        <Mail className="size-3" /> {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${user.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                      <Activity className="size-3" /> {user.status || 'ACTIVE'}
                    </span>
                    <button
                      onClick={() => handleStatusChange(user._id || user.id, user.status || 'ACTIVE')}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${user.status === 'BLOCKED' ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}`}
                      data-cursor="button"
                    >
                      {user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
