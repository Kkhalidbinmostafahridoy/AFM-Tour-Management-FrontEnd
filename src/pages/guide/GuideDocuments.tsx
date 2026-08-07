import PageWrapper from "@/components/layout/PageWrapper";
import { FolderCheck, Upload, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuideDocuments() {
  const documents = [
    { id: 1, name: "National ID Card", status: "Verified", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { id: 2, name: "Tour Guide License", status: "Verified", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { id: 3, name: "Police Clearance Certificate", status: "Pending", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ];

  return (
    <PageWrapper className="space-y-8 bg-[#1a1a1a] min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-[#222222] border border-[#2a2a2a] shadow-2xl glass-panel hover-3d-tilt" data-cursor="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 flex items-center justify-center shadow-inner">
            <FolderCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500">
              Documents & Verification
            </h1>
            <p className="text-[#9ca3af] mt-1 text-sm">Upload and manage your required guide credentials.</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold h-12 px-6 shadow-lg gap-2">
          <Upload className="w-5 h-5" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map(doc => (
          <div key={doc.id} className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#222222] shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${doc.bg}`}>
              <doc.icon className={`w-6 h-6 ${doc.color}`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{doc.name}</h3>
            <p className={`text-sm font-bold ${doc.color}`}>{doc.status}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
