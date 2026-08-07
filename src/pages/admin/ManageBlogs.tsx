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
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Blogs</h1>
              <p className="text-slate-400 text-sm">{items.length} blog posts</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white gap-2">
                <Plus className="w-4 h-4" /> New Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
              <DialogHeader><DialogTitle className="text-white">Create Blog Post</DialogTitle></DialogHeader>
              <BlogForm onSubmit={handleCreate} isSubmitting={isCreating} title="Publish Blog" formData={formData} setFormData={setFormData} />
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full max-w-sm"
            placeholder="Search by title, author, category..." />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Title</TableHead>
                  <TableHead className="text-slate-400">Category</TableHead>
                  <TableHead className="text-slate-400">Author</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-12">
                    {searchTerm ? "No blogs match your search" : "No blog posts yet. Create your first!"}
                  </TableCell></TableRow>
                ) : filtered.map((item) => (
                  <TableRow key={item._id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white max-w-[200px] truncate">{item.title}</TableCell>
                    <TableCell><span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit"><Tag className="w-3 h-3" />{item.category}</span></TableCell>
                    <TableCell className="text-slate-300">{item.author}</TableCell>
                    <TableCell className="text-slate-400 text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"><Pencil className="w-4 h-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                            <DialogHeader><DialogTitle className="text-white">Edit Blog Post</DialogTitle></DialogHeader>
                            <BlogForm onSubmit={handleUpdate} isSubmitting={isUpdating} title="Update Blog" formData={formData} setFormData={setFormData} />
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id}
                          className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">
                          {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
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
