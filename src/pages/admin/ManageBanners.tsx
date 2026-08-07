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
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-500 flex items-center justify-center shadow-inner">
            <Image className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">Manage Banners</h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{items.length} banners configured</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold h-12 px-6 shadow-lg shadow-pink-500/20 gap-2">
              <Plus className="w-5 h-5" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
            <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">Create Banner</DialogTitle></DialogHeader>
            <BannerForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Banner" formData={formData} setFormData={setFormData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-pink-500 shadow-lg"
          placeholder="Search banners..." />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden" data-cursor="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">Preview</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Title</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Status</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-12">{searchTerm ? "No banners match" : "No banners yet."}</TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item._id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <TableCell className="pl-6">
                    <img src={item.image} alt={item.title} className="w-24 h-14 object-cover rounded-xl border border-[#3a3a3a] shadow-md"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/96x56/1a1a1a/444?text=No+Img"; }} />
                  </TableCell>
                  <TableCell className="font-bold text-white">{item.title}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-[#333] text-gray-500 border-[#444]"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-pink-400/10"><Pencil className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                          <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">Edit Banner</DialogTitle></DialogHeader>
                          <BannerForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Banner" formData={formData} setFormData={setFormData} />
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
