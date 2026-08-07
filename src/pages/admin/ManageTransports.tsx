/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bus, Plus, Pencil, Trash2, Search, Loader2, Route, Users, DollarSign, Check } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useGetAllTransportsQuery,
  useCreateTransportMutation,
  useUpdateTransportMutation,
  useDeleteTransportMutation,
} from "@/redux/features/transport/transport.api";

interface Transport {
  _id: string;
  vehicleType: string;
  capacity: number;
  route: string;
  price: number;
  name?: string;
  company?: string;
  departureTime?: string;
  arrivalTime?: string;
}

const emptyForm = { vehicleType: "", capacity: "", route: "", price: "", name: "", company: "", departureTime: "", arrivalTime: "" };

const TransportForm = ({ onSubmit, isSubmitting, title, formData, setFormData }: { onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; title: string; formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) => {
  const field = (key: keyof typeof emptyForm, label: string, placeholder: string, type = "text", required = false) => (
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">{label}{required ? " *" : ""}</Label>
      <Input type={type} value={formData[key]} onChange={(e) => setFormData((p: any) => ({ ...p, [key]: e.target.value }))}
        className="bg-slate-800 border-slate-700 text-white" placeholder={placeholder} required={required} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field("vehicleType", "Vehicle Type", "e.g. Bus, Coach, Van", "text", true)}
        {field("capacity", "Capacity (seats)", "e.g. 40", "number", true)}
        <div className="col-span-2">{field("route", "Route", "e.g. Dhaka → Cox's Bazar", "text", true)}</div>
        {field("price", "Price (BDT)", "e.g. 800", "number", true)}
        {field("name", "Vehicle Name", "e.g. Express 101")}
        {field("company", "Company", "e.g. Green Line")}
        {field("departureTime", "Departure Time", "e.g. 08:00 AM")}
        {field("arrivalTime", "Arrival Time", "e.g. 04:00 PM")}
      </div>
      <Button type="submit" disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
        {title}
      </Button>
    </form>
  );
};
export default function ManageTransports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transport | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawData, isLoading } = useGetAllTransportsQuery(undefined, { refetchOnFocus: true });
  const [createTransport, { isLoading: isCreating }] = useCreateTransportMutation();
  const [updateTransport, { isLoading: isUpdating }] = useUpdateTransportMutation();
  const [deleteTransport] = useDeleteTransportMutation();

  const items: Transport[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() =>
    items.filter((t) =>
      t.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [items, searchTerm]);

  const resetForm = () => setFormData({ ...emptyForm });

  const buildPayload = () => ({
    vehicleType: formData.vehicleType,
    capacity: Number(formData.capacity),
    route: formData.route,
    price: Number(formData.price),
    name: formData.name || undefined,
    company: formData.company || undefined,
    departureTime: formData.departureTime || undefined,
    arrivalTime: formData.arrivalTime || undefined,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransport(buildPayload()).unwrap();
      toast.success("Transport created successfully!");
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create transport");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateTransport({ id: editingItem._id, ...buildPayload() }).unwrap();
      toast.success("Transport updated!");
      setEditingItem(null);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update transport");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTransport(id).unwrap();
      toast.success("Transport deleted!");
    } catch {
      toast.error("Failed to delete transport");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: Transport) => {
    setEditingItem(item);
    setFormData({
      vehicleType: item.vehicleType,
      capacity: String(item.capacity),
      route: item.route,
      price: String(item.price),
      name: item.name || "",
      company: item.company || "",
      departureTime: item.departureTime || "",
      arrivalTime: item.arrivalTime || "",
    });
  };



  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 flex items-center justify-center shadow-inner">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Manage Transports</h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{items.length} transport records</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold h-12 px-6 shadow-lg shadow-cyan-500/20 gap-2">
              <Plus className="w-5 h-5" /> Add Transport
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
            <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Add New Transport</DialogTitle></DialogHeader>
            <TransportForm onSubmit={handleCreate} isSubmitting={isCreating} title="Create Transport" formData={formData} setFormData={setFormData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-cyan-500 shadow-lg"
          placeholder="Search by type or route..." />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden" data-cursor="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">Vehicle Type</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Route</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Capacity</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Price</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Schedule</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-12">
                  {searchTerm ? "No transports match your search" : "No transports yet. Add the first one!"}
                </TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item._id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <TableCell className="font-bold text-white pl-6">{item.vehicleType}</TableCell>
                  <TableCell className="text-gray-300 font-medium text-xs"><span className="flex items-center gap-1"><Route className="w-3.5 h-3.5 text-gray-500" />{item.route}</span></TableCell>
                  <TableCell className="text-gray-300 font-medium"><span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-500" />{item.capacity}</span></TableCell>
                  <TableCell className="text-emerald-400 font-bold"><span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{item.price}</span></TableCell>
                  <TableCell className="text-gray-400 text-xs font-mono">{item.departureTime && item.arrivalTime ? `${item.departureTime} → ${item.arrivalTime}` : "—"}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Pencil className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                          <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Edit Transport</DialogTitle></DialogHeader>
                          <TransportForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Transport" formData={formData} setFormData={setFormData} />
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
