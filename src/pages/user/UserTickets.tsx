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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Support Tickets</h2>
          <p className="text-gray-500">View and track your customer service inquiries.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              <Ticket className="w-4 h-4 mr-2" /> Open New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit Support Ticket</DialogTitle>
              <DialogDescription className="sr-only">
                Fill out the form below to submit a support ticket.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Refund Request for Bali Tour" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  placeholder="Describe your issue in detail..."
                  className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full mt-4">
                {isCreating ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading tickets...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.length === 0 ? (
            <div className="text-center p-10 text-gray-500 bg-white rounded-2xl border border-gray-100">
              You haven't opened any support tickets yet.
            </div>
          ) : (
            tickets.map((ticket: any) => (
              <div key={ticket._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">{ticket.subject}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                      ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                      ticket.status === 'replied' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status === 'open' ? <Clock className="w-3 h-3" /> :
                       ticket.status === 'replied' ? <MessageSquare className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{ticket.message}</p>
                </div>
                <div className="shrink-0 text-sm text-gray-400">
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
