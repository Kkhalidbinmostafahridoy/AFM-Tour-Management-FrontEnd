import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Trash2,
  Pencil,
  Plus,
  Search,
  Loader2,
  MapPin,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetAllTourQuery,
  useDeleteTourMutation,
  useUpdateTourMutation,
} from "@/redux/features/Tour/tour.api";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";

export default function ManageTours() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: rawData, isLoading, refetch } = useGetAllTourQuery(undefined, {
    refetchOnFocus: true,
  });

  const [deleteTour] = useDeleteTourMutation();
  const [updateTour] = useUpdateTourMutation();

  const tours = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    return rawData?.data || [];
  }, [rawData]);

  const filteredTours = useMemo(() => {
    let result = tours;
    if (statusFilter !== "ALL") {
      result = result.filter((t: any) => (t.status || "PUBLISHED") === statusFilter);
    }
    if (searchTerm.trim()) {
      result = result.filter((t: any) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [tours, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTour(id).unwrap();
      toast.success("Tour deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete tour");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateTour({ id, data: { status: newStatus } }).unwrap();
      toast.success(`Tour status updated to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] flex items-center justify-center shadow-inner">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Tour Management
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Create, Edit, Publish, Draft, or Archive tours.</p>
          </div>
        </div>
        <Link to="/admin/add-tour">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-12 px-6 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 gap-2">
            <Plus className="w-5 h-5" /> Create New Tour
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-blue-500 shadow-lg"
          />
        </div>
        <div className="flex bg-[#222222] border border-[#2a2a2a] rounded-xl p-1 shadow-lg">
          {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-[#333333]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tour Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-[#222222] rounded-3xl animate-pulse border border-[#2a2a2a]" />
          ))}
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="bg-[#222222] border border-[#2a2a2a] rounded-3xl p-12 text-center shadow-2xl glass-panel">
          <Compass className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Tours Found</h3>
          <p className="text-gray-400">Try adjusting your search or filters, or create a new tour.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredTours.map((tour: any) => (
              <motion.div
                key={tour._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#222222] border border-[#2a2a2a] rounded-3xl overflow-hidden flex flex-col group glass-panel hover-3d-tilt shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
                data-cursor="card"
              >
                {/* Image Header */}
                <div className="h-48 relative overflow-hidden bg-[#1a1a1a]">
                  {tour.image || (tour.images && tour.images[0]) ? (
                    <img
                      src={tour.image || tour.images[0]}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Compass className="w-12 h-12 text-gray-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                      (tour.status || 'PUBLISHED') === 'PUBLISHED' ? 'bg-emerald-500/80 text-white' :
                      (tour.status || 'PUBLISHED') === 'DRAFT' ? 'bg-amber-500/80 text-white' :
                      'bg-gray-500/80 text-white'
                    }`}>
                      {(tour.status || 'PUBLISHED') === 'PUBLISHED' && <CheckCircle2 className="w-3 h-3" />}
                      {(tour.status || 'PUBLISHED') === 'DRAFT' && <AlertCircle className="w-3 h-3" />}
                      {(tour.status || 'PUBLISHED') === 'ARCHIVED' && <EyeOff className="w-3 h-3" />}
                      {tour.status || 'PUBLISHED'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {tour.title}
                  </h3>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="truncate">{tour.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{tour.maxGuest || 0} Guests Max</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#333333]">
                    <div className="font-bold text-white">
                      ৳{(tour.costFrom || tour.price || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Status Toggle */}
                      {updatingId === tour._id ? (
                         <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : (
                        <select
                          className="bg-[#1a1a1a] text-[10px] text-gray-300 font-bold uppercase tracking-wider border border-[#333333] rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 cursor-pointer"
                          value={tour.status || 'PUBLISHED'}
                          onChange={(e) => handleStatusUpdate(tour._id, e.target.value)}
                        >
                          <option value="PUBLISHED">Publish</option>
                          <option value="DRAFT">Draft</option>
                          <option value="ARCHIVED">Archive</option>
                        </select>
                      )}

                      <Link to={`/admin/edit-tour/${tour._id}`}>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteConfirmation onConfirm={() => handleDelete(tour._id)}>
                        <Button variant="ghost" size="icon" disabled={deletingId === tour._id} className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10">
                          {deletingId === tour._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </DeleteConfirmation>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </PageWrapper>
  );
}
