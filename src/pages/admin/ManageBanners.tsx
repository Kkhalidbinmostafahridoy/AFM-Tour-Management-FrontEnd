/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Image, Plus, Pencil, Trash2, Search, Loader2, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetAllBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation } from "@/redux/features/banner/banner.api";

interface Banner { _id: string; title: string; image: string; link?: string; description?: string; isActive: boolean; }
const emptyForm = { title: "", image: "", link: "", description: "", isActive: "true" };

const BannerForm = ({ onSubmit, isSubmitting, title, formData, setFormData }: { onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; title: string; formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Title *</Label>
      <Input value={formData.title} onChange={(e) => setFormData((p: any) => ({ ...p, title: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="Banner title" required />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Image URL *</Label>
      <Input value={formData.image} onChange={(e) => setFormData((p: any) => ({ ...p, image: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="https://..." required />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Link URL</Label>
      <Input value={formData.link} onChange={(e) => setFormData((p: any) => ({ ...p, link: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="https://..." />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Description</Label>
      <Input value={formData.description} onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="Short description..." />
    </div>
    <div className="flex items-center gap-3">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Active</Label>
      <button type="button" onClick={() => setFormData((p: any) => ({ ...p, isActive: p.isActive === "true" ? "false" : "true" }))} className="text-slate-400 hover:text-emerald-400 transition-colors">
        {formData.isActive === "true" ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7" />}
      </button>
      <span className={`text-sm ${formData.isActive === "true" ? "text-emerald-400" : "text-slate-500"}`}>{formData.isActive === "true" ? "Active" : "Inactive"}</span>
    </div>
    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold">
      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}{title}
    </Button>
  </form>
);

export default function ManageBanners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawData, isLoading } = useGetAllBannersQuery(undefined, { refetchOnFocus: true });
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const items: Banner[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() => items.filter((b) => b.title?.toLowerCase().includes(searchTerm.toLowerCase())), [items, searchTerm]);
  const resetForm = () => setFormData({ ...emptyForm });
  const buildPayload = () => ({ title: formData.title, image: formData.image, link: formData.link || undefined, description: formData.description || undefined, isActive: formData.isActive === "true" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBanner(buildPayload()).unwrap();
      toast.success("Banner created!"); setIsCreateOpen(false); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to create banner"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingItem) return;
    try {
      await updateBanner({ id: editingItem._id, ...buildPayload() }).unwrap();
      toast.success("Banner updated!"); setEditingItem(null); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to update banner"); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteBanner(id).unwrap(); toast.success("Banner deleted!"); }
    catch { toast.error("Failed to delete banner"); } finally { setDeletingId(null); }
  };

  const openEdit = (item: Banner) => {
    setEditingItem(item);
    setFormData({ title: item.title, image: item.image, link: item.link || "", description: item.description || "", isActive: item.isActive ? "true" : "false" });
  };



  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg"><Image className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">Manage Banners</h1><p className="text-slate-400 text-sm">{items.length} banners</p></div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white gap-2"><Plus className="w-4 h-4" /> Add Banner</Button></DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Create Banner</DialogTitle></DialogHeader><BannerForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Banner" formData={formData} setFormData={setFormData} /></DialogContent>
          </Dialog>
        </motion.div>
        <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm" placeholder="Search banners..." /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {isLoading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div> : (
            <Table>
              <TableHeader><TableRow className="border-slate-800 hover:bg-transparent"><TableHead className="text-slate-400">Preview</TableHead><TableHead className="text-slate-400">Title</TableHead><TableHead className="text-slate-400">Status</TableHead><TableHead className="text-slate-400 text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-12">{searchTerm ? "No banners match" : "No banners yet."}</TableCell></TableRow> :
                  filtered.map((item) => (
                    <TableRow key={item._id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell><img src={item.image} alt={item.title} className="w-20 h-12 object-cover rounded-lg border border-slate-700" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x48/1e293b/64748b?text=No+Img"; }} /></TableCell>
                      <TableCell className="font-medium text-white">{item.title}</TableCell>
                      <TableCell><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-700 text-slate-400 border border-slate-600"}`}>{item.isActive ? "Active" : "Inactive"}</span></TableCell>
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-2">
                        <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                          <DialogTrigger asChild><Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="text-slate-400 hover:text-pink-400 hover:bg-pink-400/10"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Edit Banner</DialogTitle></DialogHeader><BannerForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Banner" formData={formData} setFormData={setFormData} /></DialogContent>
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
