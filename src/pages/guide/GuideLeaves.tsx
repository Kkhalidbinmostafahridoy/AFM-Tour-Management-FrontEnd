import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { CalendarOff, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MOCK_LEAVES = [
  { id: 1, type: "Sick Leave", from: "Oct 10, 2026", to: "Oct 12, 2026", status: "Approved" },
  { id: 2, type: "Vacation", from: "Dec 01, 2026", to: "Dec 10, 2026", status: "Pending" },
];

export default function GuideLeaves() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Leave request submitted successfully!");
    setIsOpen(false);
  };

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-inner">
            <CalendarOff className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
              Availability & Leaves
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Manage your off-days and leave requests.</p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold h-12 px-6 shadow-lg shadow-rose-500/20 gap-2">
              <Plus className="w-5 h-5" /> Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-md glass-panel">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
                Submit Leave Request
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-1 block">Leave Type</label>
                <Input required className="bg-[#1a1a1a] border-[#2a2a2a] text-white" placeholder="e.g. Sick Leave, Vacation" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-1 block">From</label>
                  <Input type="date" required className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-1 block">To</label>
                  <Input type="date" required className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-1 block">Reason</label>
                <textarea required className="w-full h-24 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-white p-3" placeholder="Brief reason..." />
              </div>
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold h-11">
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave History */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel p-6" data-cursor="card">
        <h2 className="text-xl font-bold text-white mb-6">Leave History</h2>
        <div className="space-y-3">
          {leaves.map(leave => (
            <div key={leave.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div>
                <h4 className="font-bold text-white text-lg">{leave.type}</h4>
                <p className="text-sm text-gray-400">{leave.from} - {leave.to}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                {leave.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
