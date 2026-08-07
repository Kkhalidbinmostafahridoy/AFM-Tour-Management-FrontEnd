/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, Loader2, Filter, Eye } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "@/redux/features/bookings/bookings.api";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  COMPLETE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUSES = ["PENDING", "COMPLETE", "CANCELED", "FAILED"];

export default function ManageBookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingBooking, setViewingBooking] = useState<any>(null);

  const { data: rawData, isLoading } = useGetAllBookingsQuery(undefined, { refetchOnFocus: true });
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const bookings: any[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() =>
    bookings.filter((b) => {
      const matchSearch =
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    }), [bookings, searchTerm, statusFilter]);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus({ id: bookingId, status }).unwrap();
      toast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 flex items-center justify-center shadow-inner">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Manage Bookings
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{bookings.length} total bookings recorded</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-indigo-500 shadow-lg"
            placeholder="Search by user, tour, or ID..." 
          />
        </div>
        <div className="flex bg-[#222222] border border-[#2a2a2a] rounded-xl p-1 shadow-lg">
          {["all", ...STATUSES].map((s) => (
             <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                statusFilter === s
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-[#333333]"
              }`}
            >
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden" data-cursor="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Booking ID</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">User</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Tour</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-center">Guests</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Amount</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Status</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                    {searchTerm || statusFilter !== "all" ? "No bookings match filters" : "No bookings yet."}
                  </TableCell>
                </TableRow>
              ) : filtered.map((booking) => (
                <TableRow key={booking._id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <TableCell className="font-mono text-xs text-indigo-400 pl-4">{booking._id?.slice(-8)}</TableCell>
                  <TableCell>
                    <div className="text-white text-sm font-bold">{booking.user?.name || "—"}</div>
                    <div className="text-gray-500 text-[10px] font-mono mt-0.5">{booking.user?.email || "—"}</div>
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-[150px] truncate font-medium">{booking.tour?.title || "—"}</TableCell>
                  <TableCell className="text-gray-300 text-center font-bold">{booking.guestCount}</TableCell>
                  <TableCell className="text-emerald-400 font-bold">৳{booking.payment?.amount?.toLocaleString() || "—"}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[booking.status] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setViewingBooking(booking)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                        <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Booking Details</DialogTitle></DialogHeader>
                        {viewingBooking && (
                          <div className="space-y-4 text-sm mt-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Booking ID</div><div className="font-mono text-indigo-400 text-xs">{viewingBooking._id}</div></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Status</div><span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-block mt-1 ${STATUS_COLORS[viewingBooking.status] || ""}`}>{viewingBooking.status}</span></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Customer</div><div className="text-white font-bold">{viewingBooking.user?.name}</div><div className="text-gray-500 font-mono text-[10px] mt-0.5">{viewingBooking.user?.email}</div></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tour</div><div className="text-white font-medium">{viewingBooking.tour?.title || "—"}</div></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Guests</div><div className="text-white font-bold">{viewingBooking.guestCount}</div></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Amount Paid</div><div className="text-emerald-400 font-bold">৳{viewingBooking.payment?.amount?.toLocaleString() || "—"}</div></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Payment Status</div><div className="text-white font-bold">{viewingBooking.payment?.status || "—"}</div></div>
                              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3"><div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Transaction ID</div><div className="font-mono text-indigo-400 text-xs">{viewingBooking.payment?.transactionId || "—"}</div></div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-[#3a3a3a]">
                              <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Update Status</div>
                              <div className="flex flex-wrap gap-2">
                                {STATUSES.map((s) => (
                                  <Button key={s} size="sm" disabled={isUpdating || viewingBooking.status === s}
                                    onClick={() => handleStatusUpdate(viewingBooking._id, s)}
                                    className={`text-[10px] font-black tracking-widest uppercase transition-all ${viewingBooking.status === s ? "opacity-50 cursor-not-allowed bg-[#3a3a3a] text-gray-500" : "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300 border border-[#3a3a3a] hover:border-indigo-500"}`}>
                                    {s}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            {(viewingBooking.status === "COMPLETE" || viewingBooking.status === "CONFIRMED") && (
                              <div className="pt-2">
                                <Button onClick={() => {
                                  toast.success("Generating Invoice...");
                                  setTimeout(() => window.print(), 500);
                                }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 shadow-lg shadow-indigo-500/20">
                                  Generate Invoice
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageWrapper>
  );
}
