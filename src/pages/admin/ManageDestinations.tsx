/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Pencil, Trash2, Search, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetAllDestinationsQuery, useCreateDestinationMutation, useUpdateDestinationMutation, useDeleteDestinationMutation } from "@/redux/features/destination/destination.api";
import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Destination { _id: string; name: string; district?: any; }
interface Division { _id: string; name: string; }

const DestForm = ({ 
  onSubmit, 
  isSubmitting, 
  title, 
  formData, 
  setFormData, 
  divisions, 
  divLoading 
}: { 
  onSubmit: (e: React.FormEvent) => void; 
  isSubmitting: boolean; 
  title: string;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  divisions: any[];
  divLoading: boolean;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Destination Name *</Label>
      <Input value={formData.name} onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. Cox's Bazar" required />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Division</Label>
      <Select value={formData.division} onValueChange={(v) => setFormData((p: any) => ({ ...p, division: v, district: "" }))} disabled={divLoading}>
        <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select division (optional)" /></SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          {(Array.isArray(divisions) ? divisions : []).map((d: Division) => (
            <SelectItem key={d._id} value={d._id} className="text-white hover:bg-slate-700">{d.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold">
      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}{title}
    </Button>
  </form>
);

export default function ManageDestinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);
  const [formData, setFormData] = useState({ name: "", district: "", division: "" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawDest, isLoading: destLoading } = useGetAllDestinationsQuery(undefined, { refetchOnFocus: true });
  const { data: divisions = [], isLoading: divLoading } = useGetDivisionTypesQuery(undefined);
  const [createDestination, { isLoading: isCreating }] = useCreateDestinationMutation();
  const [updateDestination, { isLoading: isUpdating }] = useUpdateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();

  const destinations: Destination[] = useMemo(() => {
    if (Array.isArray(rawDest)) return rawDest;
    if (rawDest && Array.isArray((rawDest as any).data)) return (rawDest as any).data;
    return [];
  }, [rawDest]);

  const filtered = useMemo(() => destinations.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [destinations, searchTerm]);

  const resetForm = () => setFormData({ name: "", district: "", division: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { name: formData.name };
      if (formData.division) payload.division = formData.division;
      if (formData.district) payload.district = formData.district;
      await createDestination(payload).unwrap();
      toast.success("Destination created!"); setIsCreateOpen(false); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to create destination"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingItem) return;
    try {
      const payload: any = { id: editingItem._id, name: formData.name };
      if (formData.division) payload.division = formData.division;
      if (formData.district) payload.district = formData.district;
      await updateDestination(payload).unwrap();
      toast.success("Destination updated!"); setEditingItem(null); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to update destination"); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteDestination(id).unwrap(); toast.success("Destination deleted!"); }
    catch { toast.error("Failed to delete destination"); } finally { setDeletingId(null); }
  };

  const openEdit = (item: Destination) => {
    setEditingItem(item);
    setFormData({ name: item.name, district: item.district?._id || item.district || "", division: "" });
  };



  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-inner">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Manage Destinations</h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{destinations.length} destinations in the system</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold h-12 px-6 shadow-lg shadow-emerald-500/20 gap-2">
              <Plus className="w-5 h-5" /> Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
            <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Add Destination</DialogTitle></DialogHeader>
            <DestForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Destination" formData={formData} setFormData={setFormData} divisions={divisions as any} divLoading={divLoading} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-emerald-500 shadow-lg"
          placeholder="Search destinations..." />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden" data-cursor="card">
        {destLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">Destination Name</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">District</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center text-gray-500 py-12">{searchTerm ? "No destinations match" : "No destinations yet."}</TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item._id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <TableCell className="font-bold text-white pl-6">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400 shrink-0" />{item.name}</span>
                  </TableCell>
                  <TableCell className="text-gray-400 font-medium">{item.district?.name || "—"}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10"><Pencil className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                          <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Edit Destination</DialogTitle></DialogHeader>
                          <DestForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Destination" formData={formData} setFormData={setFormData} divisions={divisions as any} divLoading={divLoading} />
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10">
                        {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
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
