/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2, Plus, Pencil, Trash2, Search, Loader2, Star, MapPin, DollarSign, X, Check,
} from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetAllHotelsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} from "@/redux/features/hotel/hotel.api";

interface Hotel {
  _id: string;
  name: string;
  roomType: string;
  price: number;
  rating: number;
  location: string;
}

const emptyForm = { name: "", roomType: "", price: "", rating: "", location: "" };

const HotelForm = ({ onSubmit, isSubmitting, title, formData, setFormData }: { onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; title: string; formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Hotel Name *</Label>
        <Input value={formData.name} onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. Grand Palace Hotel" required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Room Type *</Label>
        <Input value={formData.roomType} onChange={(e) => setFormData((p: any) => ({ ...p, roomType: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. Deluxe Suite" required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Price / night ($) *</Label>
        <Input type="number" value={formData.price} onChange={(e) => setFormData((p: any) => ({ ...p, price: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white" placeholder="120" required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Rating (1–5)</Label>
        <Input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData((p: any) => ({ ...p, rating: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white" placeholder="5" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Location *</Label>
        <Input value={formData.location} onChange={(e) => setFormData((p: any) => ({ ...p, location: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. Cox's Bazar, Bangladesh" required />
      </div>
    </div>
    <div className="flex gap-3 pt-2">
      <Button type="submit" disabled={isSubmitting}
        className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
        {title}
      </Button>
    </div>
  </form>
);

export default function ManageHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawData, isLoading } = useGetAllHotelsQuery(undefined, { refetchOnFocus: true });
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  const [deleteHotel] = useDeleteHotelMutation();

  const hotels: Hotel[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() =>
    hotels.filter((h) =>
      h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [hotels, searchTerm]);

  const resetForm = () => setFormData({ ...emptyForm });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHotel({
        name: formData.name,
        roomType: formData.roomType,
        price: Number(formData.price),
        rating: Number(formData.rating) || 5,
        location: formData.location,
      }).unwrap();
      toast.success("Hotel created successfully!");
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create hotel");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;
    try {
      await updateHotel({
        id: editingHotel._id,
        name: formData.name,
        roomType: formData.roomType,
        price: Number(formData.price),
        rating: Number(formData.rating) || 5,
        location: formData.location,
      }).unwrap();
      toast.success("Hotel updated successfully!");
      setEditingHotel(null);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update hotel");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteHotel(id).unwrap();
      toast.success("Hotel deleted!");
    } catch {
      toast.error("Failed to delete hotel");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      roomType: hotel.roomType,
      price: String(hotel.price),
      rating: String(hotel.rating),
      location: hotel.location,
    });
  };



  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-500 flex items-center justify-center shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">
              Manage Hotels
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{hotels.length} hotels in database</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold h-12 px-6 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 gap-2">
              <Plus className="w-5 h-5" /> Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-violet-400" /> Add New Hotel
              </DialogTitle>
            </DialogHeader>
            <HotelForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Hotel" formData={formData} setFormData={setFormData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-violet-500 shadow-lg"
          placeholder="Search by name or location..." 
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden" data-cursor="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">Hotel Name</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Room Type</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Price</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Rating</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Location</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                    {searchTerm ? "No hotels match your search" : "No hotels yet. Add your first hotel!"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((hotel) => (
                  <TableRow key={hotel._id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                    <TableCell className="font-bold text-white pl-6">{hotel.name}</TableCell>
                    <TableCell className="text-gray-300 font-medium">{hotel.roomType}</TableCell>
                    <TableCell className="text-emerald-400 font-bold">
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{hotel.price}</span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full w-max border border-amber-400/20">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />{hotel.rating}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400 font-medium text-xs">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" />{hotel.location}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={editingHotel?._id === hotel._id} onOpenChange={(open) => { if (!open) { setEditingHotel(null); resetForm(); } }}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => openEdit(hotel)}
                              className="w-8 h-8 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-400/10">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 flex items-center gap-2">
                                <Pencil className="w-5 h-5 text-violet-400" /> Edit Hotel
                              </DialogTitle>
                            </DialogHeader>
                            <HotelForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Hotel" formData={formData} setFormData={setFormData} />
                          </DialogContent>
                        </Dialog>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(hotel._id)} disabled={deletingId === hotel._id}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10">
                          {deletingId === hotel._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </PageWrapper>
  );
}
