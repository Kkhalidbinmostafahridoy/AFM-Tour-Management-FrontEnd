import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Plane, Users, CheckCircle, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MOCK_TOURS = [
  { id: 1, title: "Sundarban Adventure", date: "Oct 15, 2026", status: "Upcoming", tourists: ["John Doe", "Jane Smith", "Alice Cooper"], location: "Khulna" },
  { id: 2, title: "Sylhet Tea Gardens", date: "Oct 22, 2026", status: "Upcoming", tourists: ["Bob Builder", "Charlie Brown"], location: "Sylhet" },
  { id: 3, title: "Cox's Bazar Trip", date: "Sep 10, 2026", status: "Completed", tourists: ["Eve Adam", "Snake Plissken"], location: "Chittagong" },
];

export default function AssignedTours() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTours = MOCK_TOURS.filter(t => t.status === activeTab && t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-500 flex items-center justify-center shadow-inner">
            <Plane className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">
              Assigned Tours
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Manage your assignments and tourist attendance.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex p-1 bg-[#222222] border border-[#2a2a2a] rounded-xl w-full md:w-auto">
          {["Upcoming", "Completed"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab ? "bg-violet-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 bg-[#222222] border-[#2a2a2a] text-white pl-10 focus-visible:ring-violet-500 shadow-lg"
            placeholder="Search tours..."
          />
        </div>
      </div>

      {/* Tour List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">No {activeTab.toLowerCase()} tours found.</div>
        ) : filteredTours.map(tour => (
          <div key={tour.id} className="rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-2xl glass-panel p-6 flex flex-col justify-between hover-3d-tilt" data-cursor="card">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {tour.date}
                </span>
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tour.title}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-2 mb-6">
                <Users className="w-4 h-4" /> {tour.tourists.length} Tourists
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold h-11 rounded-xl">
                  View Tourists & Attendance
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#222222] border-[#3a3a3a] text-white max-w-md glass-panel">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-violet-400">{tour.title} - Tourists</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {tour.tourists.map((tourist, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                      <span className="font-semibold">{tourist}</span>
                      <button className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
                        <CheckCircle className="w-4 h-4" /> Mark Present
                      </button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
