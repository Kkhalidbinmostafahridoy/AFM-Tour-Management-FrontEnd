import { useState } from "react";
import { useGetUserTicketsQuery, useCreateTicketMutation } from "@/redux/features/ticket/ticket.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ticket, Clock, CheckCircle, MessageSquare } from "lucide-react";

export default function UserTickets() {
  const { data: tickets = [], isLoading } = useGetUserTicketsQuery(undefined);
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTicket(formData).unwrap();
      toast.success("Support ticket submitted!");
      setIsDialogOpen(false);
      setFormData({ subject: "", message: "" });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to submit ticket");
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-[2rem] bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight">
              Support Tickets
            </h1>
            <p className="text-[#9ca3af] font-medium text-lg mt-1">View and track your customer service inquiries.</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 text-lg flex items-center gap-2">
              <Ticket className="w-5 h-5" /> Open New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#222222] border-[#333] text-white sm:max-w-[425px] glass-panel rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Submit Ticket</DialogTitle>
              <DialogDescription className="text-gray-400">
                Describe your issue and we'll help you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-gray-300 font-bold">Subject</Label>
                <Input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Refund Request for Bali Tour" className="h-12 bg-[#1a1a1a] border-[#333] focus-visible:ring-indigo-500 text-white rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 font-bold">Message</Label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  placeholder="Describe your issue in detail..."
                  className="w-full flex min-h-[120px] rounded-xl border border-[#333] bg-[#1a1a1a] px-4 py-3 text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
                />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg">
                {isCreating ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tickets.length === 0 ? (
            <div className="text-center p-16 text-gray-400 bg-[#222222] rounded-[2rem] border border-[#2a2a2a] glass-panel">
              <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-2">No Support Tickets</h3>
              <p>You haven't opened any support inquiries yet.</p>
            </div>
          ) : (
            tickets.map((ticket: any) => (
              <div key={ticket._id} className="bg-[#222222] p-6 md:p-8 rounded-3xl shadow-xl border border-[#2a2a2a] flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel hover-3d-tilt transition-all duration-300" data-cursor="card">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl text-white">{ticket.subject}</h3>
                    <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-widest ${
                      ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      ticket.status === 'replied' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {ticket.status === 'open' ? <Clock className="w-3.5 h-3.5" /> :
                       ticket.status === 'replied' ? <MessageSquare className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 md:max-w-2xl">{ticket.message}</p>
                </div>
                <div className="shrink-0 text-sm text-gray-500 font-mono bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#333]">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
