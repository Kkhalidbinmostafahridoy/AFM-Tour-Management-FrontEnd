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
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Hotels</h1>
              <p className="text-slate-400 text-sm">{hotels.length} hotels in database</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white gap-2">
                <Plus className="w-4 h-4" /> Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-violet-400" /> Add New Hotel</DialogTitle>
              </DialogHeader>
              <HotelForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Hotel" formData={formData} setFormData={setFormData} />
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm"
            placeholder="Search by name or location..." />
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-medium">Hotel Name</TableHead>
                  <TableHead className="text-slate-400 font-medium">Room Type</TableHead>
                  <TableHead className="text-slate-400 font-medium">Price</TableHead>
                  <TableHead className="text-slate-400 font-medium">Rating</TableHead>
                  <TableHead className="text-slate-400 font-medium">Location</TableHead>
                  <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                      {searchTerm ? "No hotels match your search" : "No hotels yet. Add your first hotel!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((hotel) => (
                    <TableRow key={hotel._id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <TableCell className="font-medium text-white">{hotel.name}</TableCell>
                      <TableCell className="text-slate-300">{hotel.roomType}</TableCell>
                      <TableCell className="text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{hotel.price}</span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />{hotel.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{hotel.location}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog open={editingHotel?._id === hotel._id} onOpenChange={(open) => { if (!open) { setEditingHotel(null); resetForm(); } }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => openEdit(hotel)}
                                className="text-slate-400 hover:text-violet-400 hover:bg-violet-400/10">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2"><Pencil className="w-5 h-5 text-violet-400" /> Edit Hotel</DialogTitle>
                              </DialogHeader>
                              <HotelForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Hotel" formData={formData} setFormData={setFormData} />
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(hotel._id)} disabled={deletingId === hotel._id}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">
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
        </motion.div>
      </div>
    </PageWrapper>
  );
}
