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
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"><HelpCircle className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">Manage FAQs</h1><p className="text-slate-400 text-sm">{items.length} frequently asked questions</p></div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white gap-2"><Plus className="w-4 h-4" /> Add FAQ</Button></DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Add FAQ</DialogTitle></DialogHeader><FAQForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create FAQ" formData={formData} setFormData={setFormData} /></DialogContent>
          </Dialog>
        </motion.div>
        <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm" placeholder="Search questions..." /></div>

        {isLoading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div> : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center text-slate-500 py-20 bg-slate-900/80 border border-slate-800 rounded-2xl">{searchTerm ? "No FAQs match your search" : "No FAQs yet. Add the first one!"}</div>
            ) : filtered.map((item) => (
              <motion.div key={item._id} layout className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-start justify-between p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}>
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.question}</p>
                    {expandedId === item._id && <p className="mt-3 text-slate-400 text-sm leading-relaxed">{item.answer}</p>}
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                      <DialogTrigger asChild><Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="text-slate-400 hover:text-purple-400 hover:bg-purple-400/10"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Edit FAQ</DialogTitle></DialogHeader><FAQForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update FAQ" formData={formData} setFormData={setFormData} /></DialogContent>
                    </Dialog>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} disabled={deletingId === item._id} className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">{deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</Button>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === item._id ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
