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
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"><MapPin className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">Manage Destinations</h1><p className="text-slate-400 text-sm">{destinations.length} destinations</p></div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white gap-2"><Plus className="w-4 h-4" /> Add Destination</Button></DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Add Destination</DialogTitle></DialogHeader><DestForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Destination" formData={formData} setFormData={setFormData} divisions={divisions as any} divLoading={divLoading} /></DialogContent>
          </Dialog>
        </motion.div>

        <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm" placeholder="Search destinations..." /></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {destLoading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-400" /></div> : (
            <Table>
              <TableHeader><TableRow className="border-slate-800 hover:bg-transparent"><TableHead className="text-slate-400">Destination Name</TableHead><TableHead className="text-slate-400">District</TableHead><TableHead className="text-slate-400 text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-slate-500 py-12">{searchTerm ? "No destinations match" : "No destinations yet."}</TableCell></TableRow>
                ) : filtered.map((item) => (
                  <TableRow key={item._id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-green-400" />{item.name}</TableCell>
                    <TableCell className="text-slate-400">{item.district?.name || "—"}</TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-2">
                      <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                        <DialogTrigger asChild><Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="text-slate-400 hover:text-green-400 hover:bg-green-400/10"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Edit Destination</DialogTitle></DialogHeader><DestForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Destination" formData={formData} setFormData={setFormData} divisions={divisions as any} divLoading={divLoading} /></DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">{deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</Button>
                    </div></TableCell>
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
