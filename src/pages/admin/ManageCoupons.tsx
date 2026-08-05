/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Percent, Plus, Pencil, Trash2, Search, Loader2, Check, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from "@/redux/features/coupon/coupon.api";

interface Coupon { _id: string; code: string; type: "percentage" | "fixed"; value: number; expiryDate: string; usageLimit?: number; usedCount: number; }
const emptyForm = { code: "", type: "percentage", value: "", expiryDate: "", usageLimit: "" };

export default function ManageCoupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<typeof emptyForm>({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawData, isLoading } = useGetAllCouponsQuery(undefined, { refetchOnFocus: true });
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const items: Coupon[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() => items.filter((c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase())), [items, searchTerm]);
  const resetForm = () => setFormData({ ...emptyForm });

  const buildPayload = () => ({
    code: formData.code.toUpperCase(),
    type: formData.type as "percentage" | "fixed",
    value: Number(formData.value),
    expiryDate: formData.expiryDate,
    usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCoupon(buildPayload()).unwrap();
      toast.success("Coupon created!"); setIsCreateOpen(false); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to create coupon"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingItem) return;
    try {
      await updateCoupon({ id: editingItem._id, ...buildPayload() }).unwrap();
      toast.success("Coupon updated!"); setEditingItem(null); resetForm();
    } catch (err: any) { toast.error(err?.data?.message || "Failed to update coupon"); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteCoupon(id).unwrap(); toast.success("Coupon deleted!"); }
    catch { toast.error("Failed to delete coupon"); } finally { setDeletingId(null); }
  };

  const openEdit = (item: Coupon) => {
    setEditingItem(item);
    setFormData({ code: item.code, type: item.type, value: String(item.value), expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "", usageLimit: item.usageLimit ? String(item.usageLimit) : "" });
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  const CouponForm = ({ onSubmit, isSubmitting, title }: { onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Coupon Code *</Label>
          <Input value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className="bg-slate-800 border-slate-700 text-white font-mono tracking-widest" placeholder="SUMMER2025" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Type *</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v }))}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="percentage" className="text-white hover:bg-slate-700">Percentage (%)</SelectItem>
              <SelectItem value="fixed" className="text-white hover:bg-slate-700">Fixed Amount (BDT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Value *</Label>
          <Input type="number" value={formData.value} onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder={formData.type === "percentage" ? "10 (for 10%)" : "500"} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Expiry Date *</Label>
          <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Usage Limit</Label>
          <Input type="number" value={formData.usageLimit} onChange={(e) => setFormData((p) => ({ ...p, usageLimit: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" placeholder="Leave blank for unlimited" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}{title}
      </Button>
    </form>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"><Percent className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">Manage Coupons</h1><p className="text-slate-400 text-sm">{items.length} coupons</p></div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-2"><Plus className="w-4 h-4" /> Create Coupon</Button></DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Create Coupon</DialogTitle></DialogHeader><CouponForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Coupon" /></DialogContent>
          </Dialog>
        </motion.div>
        <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm" placeholder="Search by code..." /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {isLoading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div> : (
            <Table>
              <TableHeader><TableRow className="border-slate-800 hover:bg-transparent"><TableHead className="text-slate-400">Code</TableHead><TableHead className="text-slate-400">Type</TableHead><TableHead className="text-slate-400">Value</TableHead><TableHead className="text-slate-400">Expiry</TableHead><TableHead className="text-slate-400">Used</TableHead><TableHead className="text-slate-400 text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-12">{searchTerm ? "No coupons match" : "No coupons yet."}</TableCell></TableRow> :
                  filtered.map((item) => (
                    <TableRow key={item._id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell><code className="px-2 py-1 bg-slate-800 rounded text-emerald-400 font-mono text-sm tracking-wider"><Hash className="w-3 h-3 inline mr-1" />{item.code}</code></TableCell>
                      <TableCell><span className="px-2 py-0.5 rounded-full text-xs border border-slate-700 text-slate-300">{item.type}</span></TableCell>
                      <TableCell className="text-white font-semibold">{item.type === "percentage" ? `${item.value}%` : `৳${item.value}`}</TableCell>
                      <TableCell><span className={`flex items-center gap-1 text-xs ${isExpired(item.expiryDate) ? "text-red-400" : "text-slate-300"}`}><Calendar className="w-3.5 h-3.5" />{new Date(item.expiryDate).toLocaleDateString()}{isExpired(item.expiryDate) && " (Expired)"}</span></TableCell>
                      <TableCell className="text-slate-400">{item.usedCount}{item.usageLimit ? ` / ${item.usageLimit}` : ""}</TableCell>
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-2">
                        <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                          <DialogTrigger asChild><Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Edit Coupon</DialogTitle></DialogHeader><CouponForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Coupon" /></DialogContent>
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
