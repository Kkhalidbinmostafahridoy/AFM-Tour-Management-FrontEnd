/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import {
  useGetAllGuidesQuery,
  useCreateGuideMutation,
} from "@/redux/features/guide/guide.api";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Activity,
  Sun,
  Moon,
  CloudSun,
  TrendingUp,
  Award,
  Search,
  Hash,
  Clock,
  ShieldCheck,
  Plus,
  Loader2,
  User,
  AlertTriangle,
} from "lucide-react";

export default function ManageGuides() {
  // --- UNTOUCHED API LOGIC START ---
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create guide");
    }
  };
  // --- UNTOUCHED API LOGIC END ---

  // --- NEW UI FUNCTIONS & LIVE WATCH ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: "Good Morning", Icon: Sun };
    if (hour < 17) return { text: "Good Afternoon", Icon: CloudSun };
    return { text: "Good Evening", Icon: Moon };
  };
  const greeting = getGreeting();
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Derived Stats
  const derivedStats = useMemo(() => {
    const total = guides.length;
    const avgExp =
      total > 0
        ? (
            guides.reduce(
              (sum: number, g: any) => sum + (g.experience || 0),
              0,
            ) / total
          ).toFixed(1)
        : "0.0";
    const locations = guides.map((g: any) => g.location || "Unknown");
    const topLocation =
      locations.length > 0
        ? locations.sort(
            (a: string, b: string) =>
              locations.filter((v: string) => v === b).length -
              locations.filter((v: string) => v === a).length,
          )[0]
        : "N/A";
    return { total, avgExp, topLocation };
  }, [guides]);

  // Local Search Filter
  const filteredGuides = useMemo(() => {
    if (!searchTerm.trim()) return guides;
    const query = searchTerm.toLowerCase();
    return guides.filter(
      (g: any) =>
        (g.name || "").toLowerCase().includes(query) ||
        (g.email || "").toLowerCase().includes(query) ||
        (g.location || "").toLowerCase().includes(query),
    );
  }, [guides, searchTerm]);

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header & Live Watch */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between bg-[#222222] border border-[#2a2a2a] p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-xl bg-[#e8822a]/10 border border-[#e8822a]/30 text-[#e8822a] shadow-md">
            <greeting.Icon className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {greeting.text}, Admin
            </h1>
            <p className="text-sm text-[#9ca3af] mt-1">
              Manage your tour guides and assignments.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#666666] font-mono">
              <Activity className="size-3.5 text-[#e8822a] animate-pulse" />
              <span className="text-[#e8822a] font-semibold">LIVE</span>
              <span className="mx-1 text-[#3a3a3a]">|</span>
              <span className="text-[#9ca3af] font-semibold">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#e8822a] hover:bg-[#d4741f] text-[#1a1a1a] font-bold shadow-lg shadow-[#e8822a]/20 hover:shadow-[#e8822a]/40 transition-all gap-2 h-11 px-6">
              <Plus className="size-4" /> Add New Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#222222] border border-[#3a3a3a] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add a New Tour Guide
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#666666]" />
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Jane Doe"
                    className="pl-10 bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-[#666666] focus:border-[#e8822a] focus:ring-[#e8822a]/20 transition-all h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#666666]" />
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="jane@example.com"
                    className="pl-10 bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-[#666666] focus:border-[#e8822a] focus:ring-[#e8822a]/20 transition-all h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#666666]" />
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 234 567 890"
                    className="pl-10 bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-[#666666] focus:border-[#e8822a] focus:ring-[#e8822a]/20 transition-all h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                    Location
                  </Label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Cox's Bazar"
                    className="bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-[#666666] focus:border-[#e8822a] focus:ring-[#e8822a]/20 transition-all h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                    Experience (Yrs)
                  </Label>
                  <Input
                    required
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="5"
                    className="bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-[#666666] focus:border-[#e8822a] focus:ring-[#e8822a]/20 transition-all h-11"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full mt-4 bg-[#e8822a] hover:bg-[#d4741f] text-[#1a1a1a] font-bold shadow-lg shadow-[#e8822a]/20 hover:shadow-[#e8822a]/40 transition-all h-11"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Add Guide"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Derived Stats Grid */}
      {!isLoading && guides.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#222222] p-4 flex items-center gap-3 shadow-lg hover:border-[#3a3a3a] transition-all">
            <div className="p-2.5 rounded-xl bg-[#e8822a]/10 border border-[#e8822a]/30 text-[#e8822a] shadow-md">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                Total Guides
              </p>
              <p className="text-xl font-bold text-white">
                {derivedStats.total}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-[#2a2a2a] bg-[#222222] p-4 flex items-center gap-3 shadow-lg hover:border-[#3a3a3a] transition-all">
            <div className="p-2.5 rounded-xl bg-[#e8822a]/10 border border-[#e8822a]/30 text-[#e8822a] shadow-md">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                Avg. Experience
              </p>
              <p className="text-xl font-bold text-white">
                {derivedStats.avgExp} yrs
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-[#2a2a2a] bg-[#222222] p-4 flex items-center gap-3 shadow-lg hover:border-[#3a3a3a] transition-all col-span-2 md:col-span-1">
            <div className="p-2.5 rounded-xl bg-[#e8822a]/10 border border-[#e8822a]/30 text-[#e8822a] shadow-md">
              <MapPin className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">
                Top Location
              </p>
              <p className="text-xl font-bold text-white capitalize">
                {derivedStats.topLocation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Guide List Card */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#222222] shadow-2xl overflow-hidden">
        <div className="bg-[#2a2a2a] border-b border-[#2a2a2a] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#e8822a]" /> Active Guides
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-[#666666]" />
            <Input
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#1a1a1a] border-[#3a3a3a] text-[#9ca3af] placeholder:text-[#666666] focus:border-[#e8822a] transition-all"
            />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 w-full animate-pulse rounded-xl bg-[#1a1a1a]"
                />
              ))}
            </div>
          ) : filteredGuides.length === 0 ? (
            <div className="py-12 text-center text-[#666666] space-y-2">
              <AlertTriangle className="size-6 mx-auto" />
              <p className="text-sm font-medium">
                {searchTerm
                  ? "No guides match your search."
                  : "No tour guides found. Start by adding one!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGuides.map((guide: any) => (
                <div
                  key={guide._id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-200 hover:border-[#3a3a3a] hover:bg-[#2a2a2a] cursor-pointer group"
                >
                  {/* Avatar & Identity */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8822a] to-amber-400 flex items-center justify-center font-bold text-[#1a1a1a] text-lg shadow-lg shadow-[#e8822a]/20">
                        {guide.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#4ade80] border-2 border-[#1a1a1a] shadow-sm"></div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {guide.name}
                      </p>
                      <p className="text-[10px] text-[#666666] font-mono">
                        {guide.email}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-[#9ca3af]">
                      <Phone className="size-3.5 text-[#666666]" />{" "}
                      {guide.phone}
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-[#9ca3af]">
                      <MapPin className="size-3.5 text-[#666666]" />{" "}
                      <span className="capitalize">{guide.location}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8822a]/10 border border-[#e8822a]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e882a] shadow-sm shadow-[#e8822a]/10">
                      <Award className="size-2.5" /> {guide.experience} yrs exp.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
