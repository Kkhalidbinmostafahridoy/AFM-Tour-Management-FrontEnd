/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Plus, Pencil, Trash2, Search, Loader2, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetAllFAQsQuery, useCreateFAQMutation, useUpdateFAQMutation, useDeleteFAQMutation } from "@/redux/features/faq/faq.api";

interface FAQ { _id: string; question: string; answer: string; tour?: string; }
const emptyForm = { question: "", answer: "", tour: "" };
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;
const isValidObjectId = (val: string) => !val || OBJECT_ID_REGEX.test(val);

const FAQForm = ({ onSubmit, isSubmitting, title, formData, setFormData }: { onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; title: string; formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) => {
  const tourError = formData.tour && !isValidObjectId(formData.tour)
    ? "Invalid Tour ID — must be a valid 24-character MongoDB ObjectId"
    : null;
  return (
  <form onSubmit={(e) => { if (tourError) { e.preventDefault(); return; } onSubmit(e); }} className="space-y-4">
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Question *</Label>
      <Input value={formData.question} onChange={(e) => setFormData((p: any) => ({ ...p, question: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. What is the cancellation policy?" required />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Answer *</Label>
      <Textarea value={formData.answer} onChange={(e) => setFormData((p: any) => ({ ...p, answer: e.target.value }))} className="bg-slate-800 border-slate-700 text-white min-h-[100px]" placeholder="Detailed answer..." required />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Tour ID <span className="text-slate-500 normal-case">(optional — 24-char hex)</span></Label>
      <Input
        value={formData.tour}
        onChange={(e) => setFormData((p: any) => ({ ...p, tour: e.target.value.trim() }))}
        className={`bg-slate-800 border-slate-700 text-white font-mono text-sm ${tourError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        placeholder="Leave blank for general FAQ"
        maxLength={24}
      />
      {tourError && (
        <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
          <span>⚠</span> {tourError}
        </p>
      )}
    </div>
    <Button type="submit" disabled={isSubmitting || !!tourError} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold disabled:opacity-50">
      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}{title}
    </Button>
  </form>
);};

export default function ManageFAQs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: rawData, isLoading } = useGetAllFAQsQuery(undefined, { refetchOnFocus: true });
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const items: FAQ[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() => items.filter((f) =>
    f.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [items, searchTerm]);

  const resetForm = () => setFormData({ ...emptyForm });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { question: formData.question, answer: formData.answer };
      if (formData.tour) payload.tour = formData.tour;
      await createFAQ(payload).unwrap();
      toast.success("FAQ created!"); setIsCreateOpen(false); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to create FAQ"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingItem) return;
    try {
      const payload: any = { id: editingItem._id, question: formData.question, answer: formData.answer };
      if (formData.tour) payload.tour = formData.tour;
      await updateFAQ(payload).unwrap();
      toast.success("FAQ updated!"); setEditingItem(null); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to update FAQ"); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteFAQ(id).unwrap(); toast.success("FAQ deleted!"); }
    catch { toast.error("Failed to delete FAQ"); } finally { setDeletingId(null); }
  };

  const openEdit = (item: FAQ) => {
    setEditingItem(item);
    setFormData({ question: item.question, answer: item.answer, tour: (item.tour as any)?._id || item.tour || "" });
  };



  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-500 flex items-center justify-center shadow-inner">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Manage FAQs</h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{items.length} frequently asked questions</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold h-12 px-6 shadow-lg shadow-purple-500/20 gap-2">
              <Plus className="w-5 h-5" /> Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
            <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Add FAQ</DialogTitle></DialogHeader>
            <FAQForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create FAQ" formData={formData} setFormData={setFormData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-purple-500 shadow-lg"
          placeholder="Search questions..." />
      </div>

      {/* FAQ Accordion Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-20 bg-[#222222] border border-[#2a2a2a] rounded-3xl glass-panel">
              {searchTerm ? "No FAQs match your search" : "No FAQs yet. Add the first one!"}
            </div>
          ) : filtered.map((item) => (
            <div key={item._id} className="bg-[#222222] border border-[#2a2a2a] rounded-2xl overflow-hidden glass-panel hover:border-purple-500/20 transition-all" data-cursor="card">
              <div className="flex items-start justify-between p-5 cursor-pointer group" onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">{item.question}</p>
                  {expandedId === item._id && (
                    <p className="mt-3 text-gray-400 text-sm leading-relaxed border-t border-[#333] pt-3">{item.answer}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 ml-4 shrink-0">
                  <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="w-8 h-8 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-400/10">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                      <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Edit FAQ</DialogTitle></DialogHeader>
                      <FAQForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update FAQ" formData={formData} setFormData={setFormData} />
                    </DialogContent>
                  </Dialog>
                  <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} disabled={deletingId === item._id} className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10">
                    {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedId === item._id ? "rotate-180 text-purple-400" : ""}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
