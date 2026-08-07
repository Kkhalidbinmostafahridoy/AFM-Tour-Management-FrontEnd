import PageWrapper from "@/components/layout/PageWrapper";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export default function TourSchedules() {
  const schedules = [
    { id: 1, tour: "Sundarban Safari", date: "Oct 15 - Oct 20, 2026", guide: "Rahim Ali", status: "On Schedule" },
    { id: 2, tour: "Sylhet Tea Tour", date: "Oct 22 - Oct 25, 2026", guide: "Karim Bhai", status: "Delayed" },
  ];

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-inner">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Tour Schedules & Calendar
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Manage dispatch times, dates, and ongoing tours.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map(sch => (
          <div key={sch.id} className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{sch.tour}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sch.status === 'On Schedule' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {sch.status}
              </span>
            </div>
            <p className="text-gray-400 flex items-center gap-2 mb-2"><Clock className="w-4 h-4" /> {sch.date}</p>
            <p className="text-gray-400 text-sm">Assigned Guide: <span className="font-bold text-white">{sch.guide}</span></p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
