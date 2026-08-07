import PageWrapper from "@/components/layout/PageWrapper";
import { FileBarChart, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TourReports() {
  const reports = [
    { id: 1, name: "Q3 2026 Financial Revenue", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "Monthly Guide Performance", type: "CSV", size: "1.1 MB" },
    { id: 3, name: "Customer Satisfaction Survey", type: "PDF", size: "3.5 MB" },
  ];

  const handleExport = (name: string) => {
    toast.success(`Exporting ${name}...`);
  };

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 flex items-center justify-center shadow-inner">
            <FileBarChart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Reports & Exports
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Download revenue and performance analytics.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(rep => (
          <div key={rep.id} className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-xl glass-panel flex flex-col justify-between hover-3d-tilt" data-cursor="card">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300 border border-gray-700">
                  {rep.type} • {rep.size}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-6">{rep.name}</h3>
            </div>
            <Button onClick={() => handleExport(rep.name)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-11 rounded-xl gap-2">
              <DownloadCloud className="w-4 h-4" /> Export Report
            </Button>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
