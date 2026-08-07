/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Pencil, Trash2, Search, Loader2, Tag, Check } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllBlogsQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from "@/redux/features/blog/blog.api";

interface Blog {
  _id: string;
  title: string;
  category: string;
  content: string;
  image?: string;
  author: string;
  createdAt?: string;
}

const CATEGORIES = ["Travel Tips", "News", "Guides", "Events"];
const emptyForm = { title: "", category: "", content: "", image: "", author: "" };

const BlogForm = ({ onSubmit, isSubmitting, title, formData, setFormData }: { onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; title: string; formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Title *</Label>
      <Input value={formData.title} onChange={(e) => setFormData((p: any) => ({ ...p, title: e.target.value }))}
        className="bg-slate-800 border-slate-700 text-white" placeholder="Blog title..." required />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Category *</Label>
        <Select value={formData.category} onValueChange={(v) => setFormData((p: any) => ({ ...p, category: v }))}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs uppercase tracking-wider">Author *</Label>
        <Input value={formData.author} onChange={(e) => setFormData((p: any) => ({ ...p, author: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white" placeholder="Author name" required />
      </div>
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Image URL</Label>
      <Input value={formData.image} onChange={(e) => setFormData((p: any) => ({ ...p, image: e.target.value }))}
        className="bg-slate-800 border-slate-700 text-white" placeholder="https://..." />
    </div>
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs uppercase tracking-wider">Content *</Label>
      <Textarea value={formData.content} onChange={(e) => setFormData((p: any) => ({ ...p, content: e.target.value }))}
        className="bg-slate-800 border-slate-700 text-white min-h-[100px]" placeholder="Blog content..." required />
    </div>
    <Button type="submit" disabled={isSubmitting || !formData.category}
      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold">
      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
      {title}
    </Button>
  </form>
);

export default function ManageBlogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rawData, isLoading } = useGetAllBlogsQuery(undefined, { refetchOnFocus: true });
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const items: Blog[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as any).data)) return (rawData as any).data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() =>
    items.filter((b) =>
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [items, searchTerm]);

  const resetForm = () => setFormData({ ...emptyForm });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBlog({ ...formData, image: formData.image || undefined }).unwrap();
      toast.success("Blog created successfully!");
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create blog");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateBlog({ id: editingItem._id, ...formData, image: formData.image || undefined }).unwrap();
      toast.success("Blog updated!");
      setEditingItem(null);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update blog");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted!");
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: Blog) => {
    setEditingItem(item);
    setFormData({ title: item.title, category: item.category, content: item.content, image: item.image || "", author: item.author });
  };



  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Manage Blogs</h1>
            <p className="text-[#9ca3af] mt-1 text-sm">{items.length} blog posts published</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold h-12 px-6 shadow-lg shadow-amber-500/20 gap-2">
              <Plus className="w-5 h-5" /> New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
            <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Create Blog Post</DialogTitle></DialogHeader>
            <BlogForm onSubmit={handleCreate} isSubmitting={isCreating} title="Publish Blog" formData={formData} setFormData={setFormData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-amber-500 shadow-lg"
          placeholder="Search by title, author, category..." />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel overflow-hidden" data-cursor="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">Title</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Category</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Author</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4">Date</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-12">
                  {searchTerm ? "No blogs match your search" : "No blog posts yet. Create your first!"}
                </TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item._id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                  <TableCell className="font-bold text-white max-w-[200px] truncate pl-6">{item.title}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                      <Tag className="w-3 h-3" />{item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300 font-medium">{item.author}</TableCell>
                  <TableCell className="text-gray-500 text-xs font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10"><Pencil className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-lg glass-panel">
                          <DialogHeader><DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Edit Blog Post</DialogTitle></DialogHeader>
                          <BlogForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Blog" formData={formData} setFormData={setFormData} />
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
