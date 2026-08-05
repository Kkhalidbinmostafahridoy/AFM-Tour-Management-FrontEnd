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
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
              <p className="text-slate-400 text-sm">{bookings.length} total bookings</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              placeholder="Search by user, tour, or ID..." />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All Statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Booking ID</TableHead>
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Tour</TableHead>
                  <TableHead className="text-slate-400">Guests</TableHead>
                  <TableHead className="text-slate-400">Amount</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-12">
                      {searchTerm || statusFilter !== "all" ? "No bookings match filters" : "No bookings yet."}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((booking) => (
                  <TableRow key={booking._id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-mono text-xs text-slate-400">{booking._id?.slice(-8)}</TableCell>
                    <TableCell>
                      <div className="text-white text-sm font-medium">{booking.user?.name || "—"}</div>
                      <div className="text-slate-500 text-xs">{booking.user?.email || "—"}</div>
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-[150px] truncate">{booking.tour?.title || "—"}</TableCell>
                    <TableCell className="text-slate-300 text-center">{booking.guestCount}</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">৳{booking.payment?.amount || "—"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[booking.status] || "bg-slate-700 text-slate-400 border-slate-600"}`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" onClick={() => setViewingBooking(booking)} className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                            <DialogHeader><DialogTitle className="text-white">Booking Details</DialogTitle></DialogHeader>
                            {viewingBooking && (
                              <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Booking ID</div><div className="font-mono text-white text-xs">{viewingBooking._id}</div></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Status</div><span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[viewingBooking.status] || ""}`}>{viewingBooking.status}</span></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Customer</div><div className="text-white">{viewingBooking.user?.name}</div><div className="text-slate-400 text-xs">{viewingBooking.user?.email}</div></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Tour</div><div className="text-white">{viewingBooking.tour?.title || "—"}</div></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Guests</div><div className="text-white">{viewingBooking.guestCount}</div></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Amount Paid</div><div className="text-emerald-400 font-semibold">৳{viewingBooking.payment?.amount || "—"}</div></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Payment Status</div><div className="text-white">{viewingBooking.payment?.status || "—"}</div></div>
                                  <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Transaction ID</div><div className="font-mono text-white text-xs">{viewingBooking.payment?.transactionId || "—"}</div></div>
                                </div>
                                <div className="space-y-1.5 pt-2">
                                  <div className="text-slate-400 text-xs uppercase tracking-wider">Update Status</div>
                                  <div className="flex flex-wrap gap-2">
                                    {STATUSES.map((s) => (
                                      <Button key={s} size="sm" disabled={isUpdating || viewingBooking.status === s}
                                        onClick={() => handleStatusUpdate(viewingBooking._id, s)}
                                        className={`text-xs ${viewingBooking.status === s ? "opacity-50 cursor-not-allowed" : ""} bg-slate-800 hover:bg-slate-700 text-white border border-slate-700`}>
                                        {s}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
