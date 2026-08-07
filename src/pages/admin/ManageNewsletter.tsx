/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, Search, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllNewslettersQuery, useDeleteNewsletterMutation } from "@/redux/features/newsletter/newsletter.api";

interface Subscriber { _id: string; email: string; createdAt?: string; }

export default function ManageNewsletter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawData, isLoading, isError } = useGetAllNewslettersQuery(undefined, { refetchOnFocus: true });
  const [deleteNewsletter] = useDeleteNewsletterMutation();

  // transformResponse already returns [] | Subscriber[], so rawData is always the final array
  const items: Subscriber[] = Array.isArray(rawData) ? rawData : [];

  const filtered = useMemo(() =>
    items.filter((s) => s.email?.toLowerCase().includes(searchTerm.toLowerCase())),
    [items, searchTerm]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteNewsletter(id).unwrap();
      toast.success("Subscriber removed!");
    } catch {
      toast.error("Failed to remove subscriber");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Newsletter Subscribers</h1>
              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />{items.length} subscribers
              </p>
            </div>
          </div>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm"
            placeholder="Search by email..." />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
              <Mail className="w-10 h-10 opacity-30" />
              <p className="font-medium text-red-400">Failed to load subscribers</p>
              <p className="text-sm">Check your network or backend connection.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">#</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Subscribed On</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500 py-12">
                      {searchTerm ? "No subscribers match your search" : "No subscribers yet."}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((item, idx) => (
                  <TableRow key={item._id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-slate-500 font-mono text-sm">{idx + 1}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 text-white">
                        <Mail className="w-4 h-4 text-sky-400" />{item.email}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">
                        {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </TableCell>
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
