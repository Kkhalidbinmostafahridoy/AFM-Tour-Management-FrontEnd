import { useState } from "react";
import { useGetAllGuidesQuery, useCreateGuideMutation } from "@/redux/features/guide/guide.api";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Mail, Phone, MapPin } from "lucide-react";

export default function ManageGuides() {
  const { data: guides = [], isLoading } = useGetAllGuidesQuery(undefined);
  const [createGuide, { isLoading: isCreating }] = useCreateGuideMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience) || 0,
      };
      await createGuide(payload).unwrap();
      toast.success("Guide created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", location: "", experience: "" });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create guide");
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manage Tour Guides</h2>
          <p className="text-gray-500">View and assign guides to tours.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              <Users className="w-4 h-4 mr-2" /> Add New Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Tour Guide</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-2">
                <Label>Location / Base</Label>
                <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Cox's Bazar" />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input required type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="5" />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full mt-4">
                {isCreating ? "Saving..." : "Add Guide"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading guides...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.length === 0 ? (
            <div className="col-span-full text-center p-10 text-gray-500 bg-white rounded-2xl border border-gray-100">
              No tour guides found. Start by adding one!
            </div>
          ) : (
            guides.map((guide: any) => (
              <div key={guide._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                    {guide.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{guide.name}</h3>
                    <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                      {guide.experience} years exp.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {guide.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {guide.phone}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {guide.location}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </PageWrapper>
  );
}
